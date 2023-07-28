import { ActiveEffect } from "./effect"

export class ComputedRefImpl {
  private _getter: any
  private _dirty: any = true
  private _value: any
  private _effect: any
  constructor(getter) {
    this._getter = getter
    this._effect = new ActiveEffect(getter, ()=> {
      if(!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value() {
    if(this._dirty) {
      this._value = this._effect.run()
      this._dirty = false
    }
    return this._value 
  }
}
export const computed = (getter) => {
  return new ComputedRefImpl(getter)
}