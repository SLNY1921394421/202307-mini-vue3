// 可以在 setup 中使用 getCurrentInstance 获取组件实例对象
import { h, getCurrentInstance } from "../../lib/mini-vue3.esm.js";

export default {
  name: "App",
  render() {
    return () => h("div", {}, [h("p", {}, "getCurrentInstance")]);
  },
  setup() {

    console.log(getCurrentInstance())
  },
};
