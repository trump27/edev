<template>
  <div>
    <h1>Node Information</h1>

    <div v-if="msgErr" class="alert alert-danger">{{msgErr}}</div>
    <div v-if="msgInfo" class="alert alert-success">{{msgInfo}}</div>

    <!--version-->
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">Version</h3>
      </div>
      <div class="panel-body">

        <div class="row">
          <div class="col-sm-3">version.api</div><div class="col-sm-9">{{version.api}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">version.anodepi</div><div class="col-sm-9">{{version.node}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">version.networkapi</div><div class="col-sm-9">{{version.network}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">version.ethereum</div><div class="col-sm-9">{{version.ethereum}}</div>
        </div>
      </div>  <!--panel-body-->
    </div>  <!--panel-->

    <!--net-->
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">net</h3>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-3">currentProvider</div><div class="col-sm-9">{{currentProvider.host}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">net.peerCount</div><div class="col-sm-9">{{net.peerCount}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">net.listening</div><div class="col-sm-9">{{net.listening}}</div>
        </div>
      </div>  <!--panel-body-->
    </div>  <!--panel-->

    <!--eth-->
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">eth</h3>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-3">eth.defaultAccount</div><div class="col-sm-9">{{eth.defaultAccount}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.coinbase</div><div class="col-sm-9">{{eth.coinbase}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.accounts</div>
          <div class="col-sm-9">
            <div v-for="account in accounts">{{account.id}} <span class="badge">{{account.ether}}</span></div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.defaultBlock</div><div class="col-sm-9">{{eth.defaultBlock}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.gasLimit</div><div class="col-sm-9">{{eth.gasLimit}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.pendingCount</div><div class="col-sm-9">{{eth.pending}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.syncing</div><div class="col-sm-9">{{eth.syncing}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.mining</div><div class="col-sm-9">{{eth.mining}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.hashrate</div><div class="col-sm-9">{{eth.hashrate}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.gasPrice</div><div class="col-sm-9">{{eth.gasPrice}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.blockNumber</div><div class="col-sm-9">{{eth.blockNumber}}</div>
        </div>
        <div class="row">
          <div class="col-sm-3">eth.Compilers</div><div class="col-sm-9">{{eth.Compilers | json}}</div>
        </div>
      </div>  <!--panel-body-->
    </div>  <!--panel-->

  </div>
</template>

<script>
import common from '../common.js'
var web3 = common.web3()
var filter

export default {
  route: {
    canDeactivate: (transition) => {
      filter.stopWatching()
      transition.next()
    }
  },

  data () {
    return {
      msgErr: '',
      msgInfo: '',
      version: {
        api: '',
        node: '',
        network: '',
        ethereum: ''
      },
      currentProvider: '',
      net: {
        listening: '',
        peerCount: ''
      },
      eth: {
        defaultAccount: '',
        defaultBlock: '',
        gasLimit: '',
        pending: '',
        syncing: '',
        coinbase: '',
        mining: '',
        hashrate: '',
        gasPrice: '',
        blockNumber: '',
        Compilers: []
      },
      accounts: []
    }
  },
  ready () {
    if (!web3.isConnected()) {
      this.msgErr = 'Couldn\'t connect to node'
      return
    }
    this.nodeInfo()
    this.ethInfo()

    filter = web3.eth.filter('latest')
    filter.watch(() => {
      this.ethInfo()
      console.log('watching...')
    })
  },
  methods: {

    nodeInfo () {
      this.version.api = web3.version.api
      this.version.node = web3.version.node
      this.version.network = web3.version.network
      this.version.ethereum = web3.version.ethereum
      this.currentProvider = web3.currentProvider
      this.net.listening = web3.net.listening
      this.net.peerCount = web3.net.peerCount
    },

    ethInfo () {
      this.eth.defaultAccount = web3.eth.defaultAccount
      this.eth.defaultBlock = web3.eth.defaultBlock
      this.eth.gasLimit = web3.eth.getBlock('latest').gasLimit

      this.eth.pending = web3.eth.getBlockTransactionCount('pending')

      this.eth.syncing = web3.eth.syncing
      this.eth.coinbase = web3.eth.coinbase
      this.eth.mining = web3.eth.mining
      this.eth.hashrate = web3.eth.hashrate
      this.eth.gasPrice = web3.eth.gasPrice
      this.eth.blockNumber = web3.eth.blockNumber
      this.eth.Compilers = web3.eth.getCompilers()
      var accounts = web3.eth.accounts
      if (this.accounts.length > 0) this.accounts.splice(0, this.accounts.length)
      for (var acc in accounts) {
        this.accounts.push({
          id: accounts[acc],
          ether: common.getBalance(accounts[acc])
        })
      }
    }
  }
}
</script>
