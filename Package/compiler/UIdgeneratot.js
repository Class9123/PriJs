export default function makeUidGenerator() {
  const counters = {
    comment: 0,
    textNode: 0,
    element: 0,
    effectFn: 0,
    ifBlock: 0, 
    elseBlock: 0,
    showing:0,
    For:0
  };

  const seen = new Set();

  function getUnique(prefix) {
    let id;
    do {
      id = `_$${prefix}${counters[prefix]++}`;
    } while (seen.has(id));
    seen.add(id);
    return id;
  }

  return {
    nextPlaceholder() {
      return getUnique("comment");
    },
    nextTextNode() {
      return getUnique("textNode");
    },
    nextElement() {
      return getUnique("element");
    },
    nextEffectFn() {
      return getUnique("effectFn");
    },
    nextIfBlock() {
      return getUnique("ifBlock");
    },
    nextElseBlock() {
      return getUnique("elseBlock");
    },
    nextShowVariable() {
      return getUnique("showing");
    },
    nextForBlock() {
      return getUnique("For");
    },
  };
}