import * as acorn from 'acorn';

/**
 * Extracts default imports from `.pri` files in JS code.
 * @param {string} code - JavaScript source code
 * @returns {string[]} - Array of imported identifiers (default only) from `.pri` files
 */
export default function extractPriImports(code) {
  const ast = acorn.parse(code, {
    ecmaVersion: 2022,
    sourceType: 'module',
  });

  const priImports = [];

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration') {
      const source = node.source.value;

      // Check if source ends with .pri
      if (source.endsWith('.pri')) {
        const defaultSpecifier = node.specifiers.find(
          spec => spec.type === 'ImportDefaultSpecifier'
        );
        if (defaultSpecifier) {
          priImports.push(defaultSpecifier.local.name);
        }
      }
    }
  }

  return priImports;
}

