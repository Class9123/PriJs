import { getTagName } from "../helpers/index.js";
import BaseProcessor from "./baseModel.js";

export default class ConditionalProcessor extends BaseProcessor {
  constructor(out, uidGen, processorRegistry) {
    super(out, uidGen);
    this.processorRegistry = processorRegistry;
  }

  process(Ifnode, parentId, reInitFns = null) {
    const IfreInitFns = [];
    const ElsereInitFns = [];

    const nextSibling = Ifnode.nextElementSibling;
    const isElse = nextSibling && getTagName(nextSibling).toLowerCase() === "else";
    const ElseNode = isElse ? nextSibling : null;

    const Ifid = this.uidGen.nextIfBlock();
    const PlaceholderId = this.uidGen.nextPlaceholder();

    let elseBlockId = PlaceholderId;
    let hasElse = false;

    this.addCode(`const ${Ifid} = _el("div");`);

    // Process If children
    Array.from(Ifnode.childNodes).forEach(childNode => {
      this.processorRegistry.processNode(childNode, Ifid, IfreInitFns);
    });

    // Process Else children if valid
    if (ElseNode) {
      hasElse = true;
      elseBlockId = this.uidGen.nextElseBlock();
      this.addCode(`const ${elseBlockId} = _el("div");`);
      Array.from(ElseNode.childNodes).forEach(childNode => {
        this.processorRegistry.processNode(childNode, elseBlockId, ElsereInitFns);
      });
    } else {
      this.addCode(`const ${PlaceholderId} = _com();`);
    }

    const effectFn = this.uidGen.nextEffectFn();
    const condition = Ifnode.getAttribute("condition");
    const showing = this.uidGen.nextShowVariable();

    this.addCode(`
      ${Ifid}.__reinit = () => {
        ${IfreInitFns.join("\n")}
      };
      ${hasElse ? `
      ${elseBlockId}.__reinit = () => {
        ${ElsereInitFns.join("\n")}
      };` : ""}
      
      ${parentId}.appendChild(${Ifid});
      let ${showing} = ${Ifid};
      const ${effectFn} = () => {
        const condition = ${condition};
        let toShow;
        if (condition) {
          toShow = ${Ifid};
        } else {
          toShow = ${elseBlockId};
        }

        if (${showing} !== toShow) {
          ${showing}.replaceWith(toShow);
          ${showing} = toShow;
          toShow.__reinit?.();
        }
      };
      _reactive(${effectFn});
    `);
  }
}