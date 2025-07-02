import * as acorn from 'acorn';
import * as astring from 'astring';
import pack from  "../package.json";

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
  import { setCurrentEffect } from "${pack.name}";
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