import { extend, isObject } from "@mini-vue/shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    if(key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }

    if(key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key, receiver);

    if(isShallow) return res 

    if(isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    if(!isReadonly) {
      // 收集依赖
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value);
      // 触发依赖
      trigger(target, key)
      return res
  }
}

export const mutableHandlers = {
  get: get,
  set: set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})