import fs from 'fs';
import path from 'path';
import makeScript from "../compiler/index.js";
import transformAndWrapPri from "../utils/createSetupFunc.js";
import beautify from "js-beautify"

function transformPriFile(code, componentName = 'App') {
  const match = code.match(/<Component\b[^>]*>([\s\S]*?)<\/Component\s*>/i);

  const fullComponentBlock = match?.[0] || ''; 
  const scriptPart = code.replace(fullComponentBlock, '').trim(); 

  const htmlScript = makeScript(fullComponentBlock);
  const script = transformAndWrapPri(scriptPart, htmlScript);
  return {
    script: script.code
  };
}


export default function scanComponent(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");

  const componentName = path.relative("src", filePath).replace(path.extname(filePath), '');

  return transformPriFile(code, componentName);
}