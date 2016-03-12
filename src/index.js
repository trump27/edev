import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter()

router.map({
  '/': { component: require('./components/Nodeinfo.vue') },
  '/nodeinfo': { component: require('./components/Nodeinfo.vue') },
  '*': { component: require('./components/Nodeinfo.vue') }
})

const App = Vue.extend(require('./App.vue'))
router.start(App, '#app')
