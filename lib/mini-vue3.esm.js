const hasOwn = (val, key) => {
    return Object.prototype.hasOwnProperty.call(val, key);
};
/**
 * @private
 * 首字母大写
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * @private
 * 添加 on 前缀，并且首字母大写
 */
const toHandlerKey = (str) => str ? `on${capitalize(str)}` : ``;
const camelizeRE = /-(\w)/g;
/**
 * @private
 * 把烤肉串命名方式转换成驼峰命名方式
 */
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};

const emit = (instance, event, ...rawArgs) => {
    // const { props } = instance
    // const toHandlerKey = (str: string) => {
    //   str ? toHandlerKey(str) : ''
    // }
    // const handlerName = toHandlerKey(event) 
    // const handler = props[handlerName];
    // handler && handler()
    // 1. emit 是基于 props 里面的 onXXX 的函数来进行匹配的
    // 所以我们先从 props 中看看是否有对应的 event handler
    const props = instance.props;
    // ex: event -> click 那么这里取的就是 onClick
    // 让事情变的复杂一点如果是烤肉串命名的话，需要转换成  change-page -> changePage
    // 需要得到事件名称
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    if (handler) {
        handler(...rawArgs);
    }
};

const initProps = (instance, rawProps) => {
    instance.props = rawProps || {};
};

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceProxyHandles = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
        // if(key === '$el') {
        //   return instance.vnode.el
        // }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(instance.props, { emit: instance.emit });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function
    // Object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag } = vnode;
    // 这里就基于 shapeFlag 来处理
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    initialVNode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlag } = vnode;
    if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}

function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    // 基于 children 再次设置 shapeFlag
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 16 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= 8 /* ShapeFlags.TEXT_CHILDREN */;
    }
    return vnode;
}
// 基于 type 来判断是什么类型的组件
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ShapeFlags.ELEMENT */
        : 4 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVnode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
