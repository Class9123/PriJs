import {
  parse
} from "node-html-parser";
import makeUidGenerator from "./UIdgeneratot.js";
import {
  getTagName,
  isElement
} from "./helpers/index.js";
import processAll from "./processors/index.js";

const options = {
  lowerCaseTagName: false, // preserve original tag casing
  comment: true,           // retain HTML comments
  blockTextElements: {
    script: false,
    style: false,
    noscript: false,
    pre: false
  },
  voidTag: {
    closingSlash: true 
  }
};


function getRootComponent(html) {
  const doc = parse(html, options);
  const uid = makeUidGenerator();
  const root = doc.childNodes.find(node => isElement(node) && getTagName(node) === "Component");
  const attr = root.attrs
  const output = [];

  const rootId = uid.nextElement();
  output.push(`
    const ${rootId} = _$._el("div")
    `);
  for (const key in attr){
    output.push(`
    ${rootId}.setAttribute("${key}","${attr[key]}")
    `)
  }
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