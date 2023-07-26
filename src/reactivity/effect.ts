class ActiveEffect {
  private _fn: any;
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    return this._fn()
  }
}

let activeEffect;
export const effect = (fn, options: any = {}) => {
  const scheduler = options.scheduler
  const _effect = new ActiveEffect(fn, scheduler)
  _effect.run()
  const runner = _effect.run.bind(activeEffect)
  return runner
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
    if(effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
    
  }
}
