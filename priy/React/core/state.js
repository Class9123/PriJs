import {
  currentEffect
} from "../globals.js";
import {
  queueEffect
} from "./dom.js";

export default function useState(initialValue) {
  let value = initialValue;
  const effects = new Set(); 
  const getter = () => {
    if (currentEffect) {
      effects.add(currentEffect);
    }
    return value;
  };

  const setter = (newValue) => { 
    const resolved = typeof newValue === "function" ? newValue(value): newValue;
    if (resolved === value) return;
    value = resolved;
    queueEffect(effects);
  };

  return [getter,
    setter];
}