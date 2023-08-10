import { h, createTextVNode } from "../../dist/mini-vue.esm-bundler.js"
import { Foo } from "./Foo.js"

// Fragment 以及 Text
export const App = {
  name: "App",
  render () {
    const app = h("div", {}, "App")
    const foo = h(Foo, {},
      {
        header: ({ age }) => [
          h('p', {}, 'header' + age),
          createTextVNode('hello world')
        ],
        footer: () => h('p', {}, 'footer')
      })
    return h("div", {}, [app, foo])
  },

  setup () {
    return {}
  },
}
