import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
function createReactiveObject(target, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers)
  return proxy
}

export const reactive = (target) => {
  return createReactiveObject(target, mutableHandlers)
}

export const readonly = (target) => {
  return createReactiveObject(target, readonlyHandlers)
}