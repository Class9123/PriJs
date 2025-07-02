import {
  getTagName
} from "../helpers/index.js";
import BaseProcessor from "./baseModel.js";

export default class RegularProcessor extends BaseProcessor {
  constructor(out, uidGen, processorRegistry) {
    super(out, uidGen);
    this.processorRegistry = processorRegistry;
  }

  process(node, parentId, reInitFns = null) {
    const tagName = getTagName(node);
    const elemId = this.uidGen.nextElement();

    this.addCode(`
      const ${elemId} = _el("${tagName}");
      ${parentId}.appendChild(${elemId});
      `);

    this.processChildren(node, elemId, reInitFns);
  }

  processChildren(node, parentId, reInitFns) {
    if (!node.childNodes) return;

    Array.from(node.childNodes).forEach(childNode => {
      this.processorRegistry.processNode(childNode, parentId, reInitFns);
    });
  }
}



