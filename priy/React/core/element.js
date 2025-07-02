import { 
  currentComponent
} from "../globals.js";


export default function useElement(selector) {
  const element = currentComponent.querySelector(selector) ?? null;
  return element;
}
