import {
  getTagName
} from "../helpers/index.js";
import BaseProcessor from "./baseModel.js";

export default class ConditionalProcessor extends BaseProcessor {
  constructor(out, uidGen, processorRegistry) {
    super(out, uidGen);
    this.processorRegistry = processorRegistry;
  }

  process(Ifnode, parentId) {
    const nextSibling = Ifnode.nextElementSibling;
    const isElse = nextSibling && getTagName(nextSibling) === "Else";
    const ElseNode = isElse ? nextSibling: null;

    const Ifid = this.uidGen.nextIfBlock();
    const PlaceholderId = this.uidGen.nextPlaceholder();

    let elseBlockId = PlaceholderId;
    let hasElse = false;

    // Create If block
    this.addCode(`const ${Ifid} = _$._el("div");`);
    this.addCode(`${Ifid}.renderChilds = () => {`);
    this.addCode(`  ${Ifid}.innerHTML = "";`);
    Array.from(Ifnode.childNodes).forEach(childNode => {
      this.processorRegistry.processNode(childNode, Ifid);
    });
    this.addCode(`};`);

    // Create Else block if present
    if (ElseNode) {
      hasElse = true;
      elseBlockId = this.uidGen.nextElseBlock();
      this.addCode(`const ${elseBlockId} = _$._el("div");`);
      this.addCode(`${elseBlockId}.renderChilds = () => {`);
      this.addCode(`  ${elseBlockId}.innerHTML = "";`);
      Array.from(ElseNode.childNodes).forEach(childNode => {
        this.processorRegistry.processNode(childNode, elseBlockId);
      });
      this.addCode(`};`);
    } else {
      // Create placeholder comment node
      this.addCode(`const ${PlaceholderId} = _$._com();`);
    }

    // Reactive switching effect with condition tracking
    const effectFn = this.uidGen.nextEffectFn();
    const condition = Ifnode.getAttribute("condition");
    const currentBlock = this.uidGen.nextShowVariable();
    const prevCondition = this.uidGen.nextShowVariable();

    this.addCode(`
      let ${currentBlock} = null;
      let ${prevCondition} = undefined;
      
      const ${effectFn} = () => {
        const conditionResult = ${condition};
        
        // Only update if condition result actually changed
        if (${prevCondition} !== conditionResult) {
          const newBlock = conditionResult ? ${Ifid} : ${elseBlockId};
          
          if (${currentBlock} === null) {
            // First render
            ${parentId}.appendChild(newBlock);
            ${currentBlock} = newBlock;
            // Only render children for actual blocks, not placeholders
            if (newBlock.renderChilds) {
              newBlock.renderChilds();
            }
          } else if (${currentBlock} !== newBlock) {
            // Condition changed, switch blocks
            ${currentBlock}.replaceWith(newBlock);
            ${currentBlock} = newBlock;
            // Only render children for actual blocks, not placeholders
            if (newBlock.renderChilds) {
              newBlock.renderChilds();
            }
          }
          
          ${prevCondition} = conditionResult;
        }
      };
      _$._reactive(${effectFn});
    `);
  }
}