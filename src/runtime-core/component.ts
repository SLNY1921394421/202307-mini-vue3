import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandles } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode: any, parent) {
  console.log(parent)
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    parent,
    provides: parent ? parent.provides : {},
    emit: () => {}
  }
  component.emit = emit.bind(null, component) as any
  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const   Component = instance.type

  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandles)
  const { setup } = Component
  if(setup) {
    setCurrentInstance(instance)
    const setupResult = setup(instance.props, { emit: instance.emit });
    setCurrentInstance(null)
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function

  // Object
  if(typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render;
}

let currentInstance = null;
export const getCurrentInstance = () => {
  return currentInstance;
}
function setCurrentInstance(instance) {
  currentInstance = instance
}

