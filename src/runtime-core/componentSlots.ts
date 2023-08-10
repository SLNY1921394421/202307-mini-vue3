import { ShapeFlags } from "../shared/shapeFlags";
export const initSlots = (instance, children) => {
  // instance.slots = Array.isArray(children) ? children : [children]
  // const slots = {}
  // for (const key in children) {
  //   const value = children[key]
  //   slots[key] = normalizeSlotValue(value)
  // }
  // instance.slots = slots

  const { vnode } = instance
  if(vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }

  

  
}
const normalizeObjectSlots = (children, slots) => {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
  slots = slots
}



export function initSlots1(instance, children) {
  const { vnode } = instance;

  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, (instance.slots = {}));
  }
}

const normalizeSlotValue = (value) => {
  // 把 function 返回的值转换成 array ，这样 slot 就可以支持多个元素了
  return Array.isArray(value) ? value : [value];
};

const normalizeObjectSlots1 = (rawSlots, slots) => {
  for (const key in rawSlots) {
    const value = rawSlots[key];
    if (typeof value === "function") {
      // 把这个函数给到slots 对象上存起来
      // 后续在 renderSlots 中调用
      // TODO 这里没有对 value 做 normalize，
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
};