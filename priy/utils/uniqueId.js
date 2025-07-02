let _uidCounter = 0;

export function generateUniqueId(prefix = "uid") {
  const now = Date.now().toString(36); // Timestamp
  const rand = Math.random().toString(36).slice(2, 8); // Random string
  const counter = (_uidCounter++).toString(36); // Incremental counter
  return `${prefix}-${now}-${rand}-${counter}`;
}