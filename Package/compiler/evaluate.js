/* used to get the expression from a text like
 text => [tokens]
 "hi hello {9+7} {30+b.name}" => [
 {
   type:"expression",
   value:"9+7",
   start:10,
   end:14
   },
 {
   type:"expression",
   value:"30+b.name",
   start:17,
   end:27
 }
 ]
*/

export function tokenize(text) {
  const tokens = [];
  let exprBuffer = '';
  let braceDepth = 0;
  let insideExpr = false;
  let exprStart = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (!insideExpr) {
      if (char === '{') {
        insideExpr = true;
        braceDepth = 1;
        exprBuffer = '';
        exprStart = i;
      }
    } else {
      if (char === '{') {
        braceDepth++;
        exprBuffer += char;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          tokens.push({
            type: 'expression',
            value: exprBuffer.trim(),
            start: exprStart,
            end: i + 1
          });
          insideExpr = false;
        } else {
          exprBuffer += char;
        }
      } else {
        exprBuffer += char;
      }
    }
  }

  if (insideExpr) {
    throw new Error('Unmatched "{"');
  }

  return tokens;
}