import { ShapeFlags } from "@mini-vue/shared";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export { createVnode as createElementVNode }

export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    component: null,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    el: null
  }

  // 基于 children 再次设置 shapeFlag
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }

  // 组件+children Object
  if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if(typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
    }
  }


  return vnode
}

export const createTextVNode = (text) => {
  return createVnode(Text, {}, text)
}

// 基于 type 来判断是什么类型的组件
function getShapeFlag(type: any) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}