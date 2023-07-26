class ActiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn
  }
  run() {
    this._fn()
  }
}

let activeEffect;
export const effect = (fn) => {
  const _effect = new ActiveEffect(fn)
  _effect.run()
}

// 收集依赖
const targetMap = new Map()
export const track = (target, key) => {
  // target->key->dep
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if(!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

// 触发依赖
export const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const effect of dep) {
    effect.run()
  }
}
