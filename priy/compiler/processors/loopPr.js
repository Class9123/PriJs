import { getTagName } from "../helpers/index.js";
import BaseProcessor from "./baseModel.js";

export default class LoopProcessor extends BaseProcessor {
  constructor(out, uidGen, processorRegistry) {
    super(out, uidGen);
    this.processorRegistry = processorRegistry;
  }

  process(node, parentId, reInitFns = null) {
    const [local, source] = node.getAttribute("for").split(" in ").map(s => s.trim());
    const keyExpr = node.getAttribute("key")?.trim();
    
    if (!keyExpr) {
      this.generateSimpleLoop(node, parentId, local, source, reInitFns);
    } else {
      this.generateKeyedLoop(node, parentId, local, source, keyExpr, reInitFns);
    }
  }

  generateSimpleLoop(node, parentId, local, source, reInitFns) {
    const anchorId = this.uidGen.nextPlaceholder();
    const effectFn = this.uidGen.nextEffectFn();

    this.addCode(`
      const ${anchorId} = _com("loop:${source}");
      ${parentId}.appendChild(${anchorId});
      
      // Fast initial render
      (() => {
        const data = ${source}();
        const frag = document.createDocumentFragment();
        
        data.forEach((${local}, index) => {
    `);

    // Process child nodes correctly
    node.childNodes.forEach(childNode => {
      this.processorRegistry.processNode(childNode, "frag");
    });

    this.addCode(`
        });
        
        ${parentId}.insertBefore(frag, ${anchorId});
      })();
      
      // Setup reactivity for updates
      const ${effectFn} = () => {
        // Clear existing content
        let current = ${anchorId}.previousSibling;
        while (current && current !== ${parentId}.firstChild?.previousSibling) {
          const prev = current.previousSibling;
          if (current.nodeType !== 8) { // Not a comment node
            current.remove();
          } else {
            break; // Hit another loop's anchor
          }
          current = prev;
        }
        
        const data = ${source}();
        const frag = document.createDocumentFragment();
        
        data.forEach((${local}, index) => {
    `);

    // Same child processing for updates
    node.childNodes.forEach(childNode => {
      this.processorRegistry.processNode(childNode, "frag");
    });

    this.addCode(`
        });
        
        ${parentId}.insertBefore(frag, ${anchorId});
      };
      
      _reactive(${effectFn}, () => ${source}());
    `);

    if (reInitFns) {
      reInitFns.push(`${effectFn}();`);
    }
  }

  generateKeyedLoop(node, parentId, local, source, keyExpr, reInitFns) {
    const anchorId = this.uidGen.nextPlaceholder();
    const listId = this.uidGen.nextElement();
    const effectFn = this.uidGen.nextEffectFn();

    this.addCode(`
      const ${anchorId} = _com("loop:${source}");
      ${parentId}.appendChild(${anchorId});
      let ${listId} = new Map();
      
      // Fast initial render
      (() => {
        const data = ${source}();
        const masterFrag = document.createDocumentFragment();
        
        data.forEach((${local}, index) => {
          const key = ${keyExpr};
          const itemFrag = document.createDocumentFragment();
    `);

    // Process children into itemFrag
    node.childNodes.forEach(childNode => {
      this.processorRegistry.processNode(childNode, "itemFrag");
    });

    this.addCode(`
          const nodes = [...itemFrag.childNodes];
          nodes.forEach(n => masterFrag.appendChild(n));
          ${listId}.set(key, nodes);
        });
        
        ${parentId}.insertBefore(masterFrag, ${anchorId});
      })();
      
      // Setup reactivity for updates
      const ${effectFn} = () => {
        const data = ${source}();
        const newList = new Map();
        const frag = document.createDocumentFragment();
        
        data.forEach((${local}, index) => {
          const key = ${keyExpr};
          let nodes = ${listId}.get(key);
          
          if (nodes) {
            // Reuse existing nodes
            nodes.forEach(n => frag.appendChild(n));
            newList.set(key, nodes);
          } else {
            // Create new nodes
            const itemFrag = document.createDocumentFragment();
    `);

    node.childNodes.forEach(childNode => {
      this.processorRegistry.processNode(childNode, "itemFrag");
    });

    this.addCode(`
            const itemNodes = [...itemFrag.childNodes];
            itemNodes.forEach(n => frag.appendChild(n));
            newList.set(key, itemNodes);
          }
        });
        
        // Remove unused nodes
        ${listId}.forEach((nodes, key) => {
          if (!newList.has(key)) {
            nodes.forEach(n => n.remove());
          }
        });
        
        ${parentId}.insertBefore(frag, ${anchorId});
        ${listId} = newList;
      };
      
      _reactive(${effectFn}, () => ${source}());
    `);

    if (reInitFns) {
      reInitFns.push(`${effectFn}();`);
    }
  }
}