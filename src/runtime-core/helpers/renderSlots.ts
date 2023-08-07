import { createVnode } from "../vnode";

export function renderSlots(slots, name, props) {
  // return createVnode("div", {}, slots)
  const slot = slots[name]
  if(slot) {
    if(typeof slot === 'function') {
      // return createVnode("div", {}, slot)
      return createVnode("div", {}, slot(props))
    }
   
  }
  
}