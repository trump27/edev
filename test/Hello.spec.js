/* global describe, it, expect */
import Vue from 'vue'
import Component from '../src/components/Hello.vue'

const vm = new Vue({
  template: '<div><cmp v-ref:target></cmp></div>',
  components: {'cmp': Component}
}).$mount()
var Hello = vm.$refs.target

describe('Hello.vue', () => {
  it('render', () => {
    expect(vm.$el.querySelector('.hello h1').textContent).to.equal('Hello World!')
    expect(vm.$el.querySelector('p').textContent).to.equal('This is Hello.vue.')
  })

  it('methods', () => {
    expect(Hello.msg).to.equal('Hello World!')
    Hello.changeValue()
    expect(Hello.msg).to.equal('Hello World!')
    expect(Hello.num1).to.equal(123)
    expect(Hello.vals.a).to.equal(7)
    expect(Hello.vals.b).to.be.false
    expect(Hello.arr).to.lengthOf(2)
  })

  it('use callback', (done) => {
    setTimeout(() => {
      expect(Hello.vals.a).to.equal(7)
      done()
    }, 200)
  })
})

// also see example testing a component with mocks at
// https://github.com/vuejs/vue-loader-example/blob/master/test/unit/a.spec.js#L24-L49
