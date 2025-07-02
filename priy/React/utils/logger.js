import {
  DEBUG_MODE
} from "../globals.js";

export function logInfo(...args) {
  if (DEBUG_MODE) console.info("[Info]", ...args);
}
export function logWarn(...args) {
  if (DEBUG_MODE) console.warn("[Warn]", ...args);
}
export function logError(...args) {
  if (DEBUG_MODE) console.error("[Error]", ...args);
}
