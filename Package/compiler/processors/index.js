import {
  getType
} from "../helpers/index.js";

import TextProcessor from "./textPr.js"
import RegularProcessor from "./regularPr.js"
import ConditionalProcessor from "./conditionalPr.js"
import LoopProcessor from "./loopPr.js";

class ProcessorRegistry {
  constructor(out, uidGen) {
    this.out = out;
    this.uidGen = uidGen;
    this.processors = new Map();
    this.initDefaultProcessors();
  }

  initDefaultProcessors() {
    this.processors.set("Text", new TextProcessor(this.out, this.uidGen));
    this.processors.set("Regular", new RegularProcessor(this.out, this.uidGen, this));
    this.processors.set("If", new ConditionalProcessor(this.out, this.uidGen, this));
    this.processors.set("Repeat", new LoopProcessor(this.out, this.uidGen, this));
  }

  register(type, processorClass) {
    const processor = new processorClass(this.out, this.uidGen, this);
    this.processors.set(type, processor);
  }

  processNode(node, parentId) {
    const type = getType(node);
    const processor = this.processors.get(type);

    if (processor) {
      processor.process(node, parentId);
    } else {
      console.warn(`No processor for type: ${type}`);
    }
  }

  processAll(node, parentId) {
    if (!node || !node.childNodes) return;

    Array.from(node.childNodes).forEach(childNode => {
      if (childNode.parentNode) {
        this.processNode(childNode, parentId);
      }
    });
  }
}


export default function processAll(node, out, uidGen, parentId) {
  const registry = new ProcessorRegistry(out,
    uidGen);
  registry.processAll(node,
    parentId);
  return registry;
}