<template>
  <div>
    <navbar></navbar>
    <div class="container">
      <router-view transition="route"></router-view>
    </div>

    <div v-if="watchLog.length" @click="togglePanel" id="logPanel">
      <ul>
        <li v-for="log in watchLog">
          {{log.time}} {{log.msg}} : {{log.tx}}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import common from './common.js'
var web3 = common.web3()

export default {
  data () {
    return {
      watchLog: []
    }
  },
  components: {
    Navbar
  },
  methods: {
    togglePanel () {
      var element = document.getElementById('logPanel')
      if (element.clientHeight === 30) {
        element.style.height = '200px'
      } else {
        element.style.height = '32px'
      }
    },

    addLog (msg, tx) {
      var time = (new Date()).toLocaleTimeString()
      this.watchLog.unshift({msg: msg, tx: tx, time: time})
    }
  },

  events: {
    'tracking': function (tx, msg) {
      this.addLog('watching: ' + msg, tx)
      var txHash = tx; var self = this
      var filter = web3.eth.filter('latest')
      filter.watch(function (err, result) {
        if (err) {
          console.log('watch: ', err)
          self.addLog('watching: ' + msg, tx)
        }
        var receipt = web3.eth.getTransactionReceipt(txHash)
        // console.log('filter: ', result)
        if (receipt && receipt.transactionHash === txHash) {
          console.log('ok', txHash)
          self.addLog('mined: ' + msg, tx)
          filter.stopWatching()
        }
      })
    }
  }

}
</script>

<style lang="stylus">
body
  font-family "メイリオ",Meiryo,"Helvetica Neue",Helvetica,Arial,sans-serif;
.route-transition
  transition all 0.8s ease
.route-leave
  display none
.route-enter
  opacity 0
  padding 0 0
  height 0
  transform translate3d(0, 0, 0)
div.container
  margin-top 60px
.space
  margin-top 20px

#logPanel
  font-size 11px
  position fixed
  bottom 0
  height 32px
  right 25px
  left 25px
  background-color lemonchiffon
  border 1px solid #aaa
  overflow-y scroll
</style>
