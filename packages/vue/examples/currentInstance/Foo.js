import { h, getCurrentInstance } from '../../dist/mini-vue.esm-bundler.js'

export const Foo = {
  name: 'Foo',
  render () {
    return h('div', {}, 'foo')
  },
  setup () {
    const instance = getCurrentInstance()
    console.log('Foo: ', instance)
  }
}