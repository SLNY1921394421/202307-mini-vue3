import { extend } from "../../shared";

class ActiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  public scheduler: Function | undefined;
  onStop?: ()=> void
  constructor(fn,scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    activeEffect = this;
    return this._fn()
  }
  stop() {
    if(this.active) {
      cleanupEffect(this)
      if(this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

export const cleanupEffect = (effect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  });
}

let activeEffect;
export const effect = (fn, options: any = {}) => {
  const scheduler = options.scheduler
  const _effect = new ActiveEffect(fn, scheduler)
  // _effect.onStop = options.onStop
  extend(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(activeEffect)
  runner.effect = _effect
  return runner
}

export const stop = (runner) => {
  runner.effect.stop()
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

  if(!activeEffect) return;
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
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
