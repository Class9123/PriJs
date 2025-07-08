import {
  getTagName
} from "../helpers/index.js";
import BaseProcessor from "./baseModel.js";
const domProps = {
  checked: "checked",
  value: "value",
  selected: "selected",
  disabled: "disabled",
  readonly: "readOnly",
  hidden: "hidden",
};


function isComponentTag(tagName) {
  return /[A-Z]/.test(tagName[0]);
}

function generatePropsObjectString(attrs) {
  const props = [];

  for (let name in attrs) {
    const value = attrs[name].trim();

    if (name.startsWith("@") || name === "ref") continue; // skip event/ref
    if (name.startsWith(":")) {
      // :prop="expr"
      const key = name.slice(1);
      props.push(`${JSON.stringify(key)}: ${value}`);
    } else {
      // Static prop
      props.push(`${JSON.stringify(name)}: ${JSON.stringify(value)}`);
    }
  }

  return `{ ${props.join(", ")} }`;
}

export default class RegularProcessor extends BaseProcessor {
  constructor(out, uidGen, processorRegistry) {
    super(out, uidGen);
    this.processorRegistry = processorRegistry;
  }

  process(node, parentId) {
    const tagName = getTagName(node);
    const elemId = this.uidGen.nextElement();
    const attrs = node.attributes || {};

    if (isComponentTag(tagName)) {
      this.addCode(`
        const ${elemId} = ${tagName}(${generatePropsObjectString(attrs)})
        `)
    } else {
      this.addCode(`
        const ${elemId} = _$._el("${tagName}");
        `);
      for (let name in attrs) {
        name = name?.trim()
        const value = attrs[name]?.trim();
        this.attachAttribute(elemId, name, value)
      }

      this.processChildren(node, elemId);
    }
    this.addCode(`      ${parentId}.appendChild(${elemId});`)
  }

  processChildren(node, parentId) {
    if (!node.childNodes) return;

    Array.from(node.childNodes).forEach(childNode => {
      this.processorRegistry.processNode(childNode, parentId);
    });
  }

  attachAttribute(elemId, name, value) {
    if (name.startsWith(":")) {
      const key = name.slice(1);
      const fn = this.uidGen.nextEffectFn();

      // Use DOM property if matched, else fallback to attribute
      if (domProps[key]) {
        const prop = domProps[key];
        this.out.push(`
          const ${fn} = () => {
          ${elemId}.${prop} = ${value};
          };
          _$._reactive(${fn});
          `);
      } else {
        this.out.push(`
          const ${fn} = () => {
          ${elemId}.setAttribute("${key}", ${value});
          };
          _$._reactive(${fn});
          `);
      }

    } else if (name.startsWith("@")) {
      const eventName = name.slice(1);
      const fn = this.uidGen.nextEffectFn();
      this.out.push(`
        const ${fn} = () => {
        ${elemId}.on${eventName} = ${value};
        };
        _$._reactive(${fn});
        ${fn}();
        `);

    } else if (name.startsWith("$")) {
      const key = name.slice(1);
      if (key === "ref") {
        this.addCode(`${value} = ${elemId}`);
      } else if (key === "html") {
        this.addCode(`${elemId}.innerHTML += ${value}`);
      }
      else if (key==="show"){
        const effectFn = this.uidGen.nextEffectFn()
        const prevValue = this.uidGen.nextShowVariable()
        this.addCode(`
        let ${prevValue} ; 
        const ${effectFn} = () =>{
          const con = ${value}
          if (con!==${prevValue}){
            con ? ${elemId}.style.display = "" : ${elemId}.style.display = "none"
          }
          
        }
        
        _$._reactive(${effectFn})
        `)
      }

    } else {
      this.out.push(`${elemId}.setAttribute("${name}", ${JSON.stringify(value)});`);
    }
  }
}