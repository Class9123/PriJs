import {
  getRawText
} from "../helpers/index.js";
import {
  tokenize
} from "../evaluate.js";
import BaseProcessor from "./baseModel.js";

export default class TextProcessor extends BaseProcessor {
  process(node, parentId, reInitFns = null) {
    const rawText = getRawText(node).trim();
    if (!rawText) return;

    const tokens = tokenize(rawText);
    if (tokens.length === 0) {
      // Only static text
      const textId = this.uidGen.nextTextNode();
      this.addCode(`
        const ${textId} = _txt(\`${rawText.replace(/`/g, '\\`')}\`);
        ${parentId}.appendChild(${textId});
      `);
      return;
    }

    let lastIndex = 0;

    tokens.forEach(expression => {
      if (!expression.value?.trim()) return; // skip empty expressions

      // Static text before this expression
      if (expression.start > lastIndex) {
        const staticText = rawText.slice(lastIndex, expression.start);
        if (staticText.trim()) {
          const textId = this.uidGen.nextTextNode();
          this.addCode(`
            const ${textId} = _txt(\`${staticText.replace(/`/g, '\\`')}\`);
            ${parentId}.appendChild(${textId});
          `);
        }
      }

      // Reactive expression
      const textId = this.uidGen.nextTextNode();
      const effectFn = this.uidGen.nextEffectFn();

      this.addCode(`
        const ${textId} = _txt("");
        const ${effectFn} = () => {
          if (!${textId}.isConnected) return;
          ${textId}.data = String(${expression.value} ?? "");
        };
        _reactive(${effectFn}, () => { ${expression.value} });
        ${reInitFns === null ? `${textId}.data = String(${expression.value} ?? "");` : ""}
        ${parentId}.appendChild(${textId});
      `);

      if (reInitFns) {
        reInitFns.push(`${textId}.data = String(${expression.value} ?? "")`);
      }

      lastIndex = expression.end;
    });

    // Final static text after the last token
    const endText = rawText.slice(lastIndex);
    if (endText.trim()) {
      const textId = this.uidGen.nextTextNode();
      this.addCode(`
        const ${textId} = _txt(\`${endText.replace(/`/g, '\\`')}\`);
        ${parentId}.appendChild(${textId});
      `);
    }
  }
}