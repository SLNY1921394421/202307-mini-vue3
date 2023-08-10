import { h } from "../../dist/mini-vue.esm-bundler.js";

export const Foo = {
  setup(props) {
    // props.count
    console.log(props);

    // 3.
    // shallow readonly
    props.count++
    console.log(props);

  },
  render() {
    return h("div", {}, "foo: " + this.count);
  },
};
