import {
  getTagName
} from "../helpers/index.js";
import BaseProcessor from "./baseModel.js";

export default class LoopProcessor extends BaseProcessor {
  constructor(out, uidGen, processorRegistry) {
    super(out, uidGen);
    this.processorRegistry = processorRegistry;
  }

  process(node, parentId ) {
    const [local,
      source] = node.getAttribute("for").split(" in ").map(s => s.trim());
    const effectFn = this.uidGen.nextEffectFn()
    const elemId = this.uidGen.nextElement()
    const ref = node.getAttribute("$ref") 
    this.addCode(`
    const ${elemId} = _$._el("div")
    ${elemId}.setAttribute("class","${node.getAttribute("class")}")
    ${ref ? ` ${ref}=${elemId} ` : ""}
    `)
    this.addCode(`
     const ${effectFn} = () => {
     ${elemId}.innerHTML = ""
     const data = ${source}
     data.forEach((${local})=>{
    `)
    node.childNodes.forEach(childNode=>{
      this.processorRegistry.processNode(childNode, elemId, null);
    })
    this.addCode(`
     }) } 
     _$._reactive(${effectFn})
     ${parentId}.append(${elemId})
    `)
  }

}