import { h, ref } from "../../lib/mini-vue3.esm.js";

const count = ref(0);

export const App = {
  name: "App",
  setup() {
    const count = ref(0);

    const onClick = () => {
      count.value++;
    }
    return {
      count,
      onClick,
    }
  },
  render() {
    console.log(this.count);
    return h(
      "div",
      { 
        id: "root"
      },
      [
        h("div", {}, "count:" + this.count),
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
      ]
    );
  },
};