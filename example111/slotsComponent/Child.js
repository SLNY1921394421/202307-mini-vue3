import { h, renderSlots } from "../../lib/mini-vue3.esm.js";
export default {
  name: "Child",
  setup(props, context) {},
  render() {
    console.log(this.$slots)
    const foo = h("div", {}, "foo")
    return h("div", {},
      // [foo, renderSlots(this.$slots)]
      [
        renderSlots(this.$slots, 'header', {
          age: 18
        }),
        foo,
        renderSlots(this.$slots, 'footer'),
      ]
    )
    // return h("div", {}, [
    //   h("div", {}, "child"),
    //   // renderSlot 会返回一个 vnode
    //   // 其本质和 h 是一样的
    //   // 第三个参数给出数据
    //   // renderSlots(this.$slots, "default", {
    //   //   age: 16,
    //   // }),
    // ]);
  },
};
