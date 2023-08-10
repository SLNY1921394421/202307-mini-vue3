import { h, renderSlots } from "../../dist/mini-vue.esm-bundler.js"

export const Foo = {
  setup () {
    return {}
  },
  render () {
    const foo = h("p", {}, "foo")

    const age = 18
    // children -> vnode
    // renderSlot
    return h("div", {},
      [
        renderSlots(this.$slots, 'header', { age }),
        foo,
        renderSlots(this.$slots, 'footer')
      ])
  },
}
