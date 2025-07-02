export default class BaseProcessor {
  constructor(out, uidGen) {
    this.out = out;
    this.uidGen = uidGen;
  }

  addCode(code) {
    this.out.push(code);
  }

  process(node, parentId, reInitFns = null) {
    throw new Error("Must implement process method");
  }
}