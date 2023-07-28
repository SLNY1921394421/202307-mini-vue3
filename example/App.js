import { h } from '../lib/mini-vue3.esm.js'
export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'blue'],
      },
      // String
      // 'hello mini-vue3'
      // Array
      [h('p', {class: 'red'}, 'hello'), h('p', {class: 'blue'}, 'mini-vue')]
    ); 
  },
  setup() {
    return {
      msg: 'vue3'
    }
  }
}