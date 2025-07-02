import getHelperString from "./createHelpers.js";
import beautify from "js-beautify";

const NODE_TYPES = {
  TEXT: 3,
  ELEMENT: 1
};

export function formatJs(code) {
  return beautify(code)
}

function getTagName(node) {
  return node.rawTagName;
}

function isElement(node) {
  return node.nodeType===NODE_TYPES.ELEMENT;
}

function isText(node) {
  return node.nodeType === NODE_TYPES.TEXT;
}

function getRawText(textNode){
  return textNode.rawText;
}

function getType(node) {
  let type ;
  if(isText(node)) type ="Text"
  else if(isElement(node)){
    switch (getTagName(node)) {
      case "If":
        type="If"
        break;
      case "Else":
        type="Else"
        break;
      case "Elseif":
        type="Elseif"
        break;
      case "Repeat":
        type="Repeat"
        break;
      default:
        type="Regular"
    }
  }
  return type;
}

export {
  getHelperString,
  getTagName,
  isElement,
  isText,
  getRawText,
  getType
};