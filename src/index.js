import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter()

router.map({
  '/': { component: require('./components/Nodeinfo.vue') },
  '/nodeinfo': { component: require('./components/Nodeinfo.vue') },
  '/send': { component: require('./components/Send.vue') },
  '/tx': { component: require('./components/Tx.vue') },
  '/tx/:hash': { component: require('./components/Tx.vue') },
  '*': { component: require('./components/Nodeinfo.vue') }
})

const App = Vue.extend(require('./App.vue'))
router.start(App, '#app')
