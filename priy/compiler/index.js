import {
  parse
} from "node-html-parser";
import makeUidGenerator from "./UIdgeneratot.js";
import {
  getHelperString,
  getTagName,
  isElement
} from "./helpers/index.js";
import processAll from "./processors/index.js";

const CONDITIONAL_TAGS = {
  IF: "If",
  ELSEIF: "Elseif",
  ELSE: "Else"
};


function getRootComponent(html) {
  const doc = parse(html, {
    lowerCaseTagName: false
  });
  const uid = makeUidGenerator();
  const root = doc.childNodes.find(node => isElement(node) && getTagName(node) === "Component");

  const output = [getHelperString()];

  const rootId = uid.nextElement();
  output.push(`
    const ${rootId} = _el("div")
    `);
  processAll(root, output, uid, rootId);

  output.push(`
    return ${rootId}
    `);

  return output.join("\n");
}

export default function transform(html) {
  const code = getRootComponent(html);
  return code
}