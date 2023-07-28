import { h } from '../lib/mini-vue3.esm.js';
window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'blue'],
        onClick() {
          console.log('onclick事件 ');
        },
        onMousedown() {
          console.log('onclick事件 ');
        }
      },
      // String
      'hello ' + this.msg
      // Array
      // [h('p', {class: 'red'}, 'hello'), h('p', {class: 'blue'}, 'mini-vue')]
    ); 
  },
  setup() {
    return {
      msg: 'vue3'
    }
  }
}