import { h, createTextVNode } from "../../lib/mini-vue3.esm.js";
import Child from "./Child.js";

export default {
  name: "App",
  setup() {},

  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Child,
      {},
      // h("p", {}, "123")
      // [h("p", {}, "123"),h("p", {}, "456")]
      {
        header: ({ age }) => [h("p", {}, "header" + age), createTextVNode("你好")],
        footer: () => h("p", {}, "footer"),
      }
    );
    return h("div", {}, [app, foo])


    // return h("div", {}, [
    //   h("div", {}, "你好"),
    //   h(
    //     Child,
    //     {
    //       msg: "your name is child",
    //     },
    //     {
    //       default: ({ age }) => [
    //         h("p", {}, "我是通过 slot 渲染出来的第一个元素 "),
    //         h("p", {}, "我是通过 slot 渲染出来的第二个元素"),
    //         h("p", {}, `我可以接收到 age: ${age}`),
    //       ],
    //     }
    //   ),
    // ]);
  },
};
