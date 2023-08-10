import { isObject } from "@mini-vue/shared";
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

function createReactiveObject(target, baseHandlers) {
  if(!isObject(target)) {
    console.warn(`target${target}必须是对象`)
    return target
  }
  return new Proxy(target, baseHandlers)
}

export const reactive = (target) => {
  return createReactiveObject(target, mutableHandlers)
}

export const readonly = (target) => {
  return createReactiveObject(target, readonlyHandlers)
}

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY]
}

export const shallowReadonly = (target) => {
  return createReactiveObject(target, shallowReadonlyHandlers)
}

export const isProxy = (value) => {
  return isReactive(value) || isReadonly(value)
}