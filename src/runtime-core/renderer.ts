import { ShapeFlags } from "../../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";
export function createRenderer(options) {
  const { createElement, patchProp, insert } = options

  function render( vnode, container) {
    patch(vnode, container, null)
  }
  function patch(vnode, container, parentComponent) {
    const { type, shapeFlag } = vnode
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
      case Text:
        processText(vnode, container)
        break;
        
    
      default:
        // 这里就基于 shapeFlag 来处理
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }



    
  }

  function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }
  function mountComponent(initialVNode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: any, initialVNode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance)
    initialVNode.el = subTree.el
  }

  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    
    // const el = (vnode.el = document.createElement(vnode.type));
    const el = (vnode.el = createElement(vnode.type));


    const { children, shapeFlag } = vnode;
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }
    
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if(isOn(key)) {
      //   const event = key.slice(2).toLowerCase();
      //   el.addEventListener(event, val);
      // } else {
      //   el.setAttribute(key, val);
      // }
      patchProp(el, key, val)
    }

    // container.append(el);
    insert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(v => {
      patch(v, container, parentComponent)
    });
  }

  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode
    const textNode =(vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  return {
    createApp: createAppAPI(render) 
  }
}