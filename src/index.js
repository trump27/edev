import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter()

router.map({
  '/': { component: require('./components/Hello.vue') },
  '/hello': { component: require('./components/Hello.vue') },
  '*': { component: require('./components/Hello.vue') }
})

const App = Vue.extend(require('./App.vue'))
router.start(App, '#app')
