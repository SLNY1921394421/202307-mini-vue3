import { hasChanged, isObject } from "../../shared";
import { isTracking, trackEffects, triggerRefValue } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  public dep;
  private _rawVal: any;
  constructor(value) {
    this._rawVal = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value () {
    trackRefValue(this)
    return this._value;
  }
  set value(newVal) {
    if(hasChanged(this._rawVal, newVal)) {
      this._rawVal = newVal
      this._value = convert(newVal)
      triggerRefValue(this.dep)
    }
  }
}
export const ref = (value) => {
  return new RefImpl(value)
}
export const trackRefValue = (ref) => {
  if(isTracking()) {
    trackEffects(ref.dep)
  }
}

const convert = (value) => {
  return isObject(value) ? reactive(value) : value
}