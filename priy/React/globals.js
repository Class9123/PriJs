// stores variables used in multiple files

export const DEBUG_MODE = false;
export let currentEffect = null;

export function setCurrentEffect(effect) {
  currentEffect = effect;
}

export let currentComponent = null;
export function setCurrentComponent(component) {
  currentComponent = component;
}

export const virtualRoot = document.createElement("div");