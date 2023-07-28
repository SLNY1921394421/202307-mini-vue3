import { initProps } from "./componentProps";
import { PublicInstanceProxyHandles } from "./componentPublicInstance";

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {}
  }
  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  // initSlots
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const   Component = instance.type

  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandles)
  const { setup } = Component
  if(setup) {
    const setupResult = setup(instance.props);
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

