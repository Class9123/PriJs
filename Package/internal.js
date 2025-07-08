import {
  setCurrentEffect
} from "./React/globals.js";
import {
  useMemo
} from "./React/index.js"


function _com() {
  return document.createComment("Something");
}
function _el(tag) {
  return document.createElement(tag);
}
function _txt(str) {
  return document.createTextNode(str);
}
function _reactive(fn, exp = null) {
  const effect = {
    fn: fn,
    cleanup: null
  };
  setCurrentEffect(effect);
  effect.fn()
  if (exp) exp()
  setCurrentEffect(null);
}

export default {
  _el,
  _reactive,
  _txt,
  _com
}