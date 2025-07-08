import * as acorn from 'acorn';
import * as astring from 'astring';
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const pack = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf-8")
);

export default function transformAndWrapPri(scriptCode, htmlScript) {
  const ast = acorn.parse(scriptCode, {
    ecmaVersion: 2022,
    sourceType: 'module',
  });

  const importStmts = [];
  const otherNodes = [];

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration') {
      importStmts.push(astring.generate(node));
    } else {
      otherNodes.push(node);
    }
  }

  const setupBody = otherNodes.map(astring.generate).join('\n');

  const wrappedCode = `
  import _$ from "${pack.name}/internal.js";
  ${importStmts.join('\n')}

  export default function setup(props={}) {
  ${setupBody}

  function mount(){
    ${htmlScript}
  }

  return mount()
  }
  `;
  return {
    code: wrappedCode.trim(),
  };
}