<template>
  <div>
    <h1>Transactions</h1>

    <div v-if="msgErr" class="alert alert-danger">{{msgErr}}</div>
    <div v-if="msgInfo" class="alert alert-success">{{msgInfo}}</div>

    <div class="form-inline">
      <label >Block #:</label>
      <input v-model="blockFrom" size="5" class="form-control" placeholder="from">～
      <input v-model="blockTo" size="5" class="form-control" placeholder="to">
      <button @click="searchTx" class="btn btn-primary">Search</button>
    </div>
    <div class="form-inline">
      <label >Tx hash:</label>
      <input v-model="txHash" size="50" class="form-control" placeholder="tx hash">
      <button @click="searchTxHash" class="btn btn-primary">Search</button>
    </div>

    <div><br></div>
    <div v-for="tx in txs" class="panel panel-success">
      <div class="panel-heading"><h3 class="panel-title">Block #{{tx.number}}</h3></div>
      <div class="panel-body">
        <dl class="dl-horizontal">
          <dt>Hash</dt><dd>{{tx.hash}}</dd>
          <dt>timestamp</dt><dd>{{tx.timestamp}}</dd>
          <dt>nonce</dt><dd>{{tx.nonce}}</dd>
          <dt>miner</dt><dd>{{tx.miner}}</dd>
          <dt>difficulty</dt><dd>{{tx.difficulty}}</dd>
          <dt>nonce</dt><dd>{{tx.nonce}}</dd>
          <dt>gasLimit</dt><dd>{{tx.gasLimit}}</dd>
          <dt>gasUsed</dt><dd>{{tx.gasUsed}}</dd>
        </dl>

        <div class="panel panel-info">
          <div class="panel-heading"><h3 class="panel-title">Transactions</h3></div>
          <ul class="list-group">
            <li v-for="txl in tx.transactions" class="list-group-item">
              <dl class="dl-horizontal">
                <dt>#</dt><dd>{{txl.transactionIndex}}</dd>
                <dt>hash</dt><dd>{{txl.hash}}</dd>
                <dt>nonce</dt><dd>{{txl.nonce}}</dd>
                <dt>from</dt><dd><a v-link="'/account/' + txl.from">{{txl.from}}</a></dd>
                <dt>to</dt><dd><a v-link="'/account/' + txl.to">{{txl.to}}</a></dd>
                <dt>value</dt><dd>{{txl.value}} <span class="badge">{{txl.etherValue}}</span></dd>
                <dt>gasPrice</dt><dd>{{txl.gasPrice}}</dd>
                <dt>gas</dt><dd>{{txl.gas}}</dd>
                <dt>input</dt><dd>{{txl.input}}</dd>
              </dl>
            </li>
          </ul>
        </div>

      </div>      <!--panel body-->

    </div>
  </div>
</template>

<script>
import common from '../common.js'
var web3 = common.web3()

export default {
  data () {
    return {
      msgErr: '',
      msgInfo: '',
      blockFrom: '',
      blockTo: '',
      txs: [],
      txHash: ''
    }
  },

  ready () {
    this.blockTo = web3.eth.blockNumber
    this.blockFrom = (this.blockTo > 500) ? this.blockTo - 500 : 0
    if (this.$route.params.hash) {
      this.txHash = this.$route.params.hash
      this.searchTxHash()
    }
  },

  methods: {
    // getTx (txHash, block) {
    //   var tx = web3.eth.getTransaction(txHash)
    //   if (!tx) return null
    //   tx.valueEther = web3.fromWei(tx.value, 'ether')
    //   if (!block) {
    //     block = web3.eth.getBlock(tx.blockHash)
    //   }
    //   tx.timestamp = common.unixtime2date(block.timestamp)
    //   return tx
    // },

    /**
     * 格納するblock, txを作成する
     * @param {number} blockNumer transaction count > 0 のblock
     * @return {object}
     */
    setBlock (blockNumer) {
      // deep copy
      var block = JSON.parse(JSON.stringify(web3.eth.getBlock(blockNumer)))
      var txlist = []
      for (var i = 0; i < block.transactions.length; i++) {
        var tx = web3.eth.getTransaction(block.transactions[i])
        tx = JSON.parse(JSON.stringify(tx))
        tx.etherValue = web3.fromWei(tx.value, 'ether')
        txlist.push(tx)
      }
      delete block.transactions
      block.transactions = txlist
      block.timestamp = common.unixtime2date(block.timestamp)
      // console.log(block)
      return block
    },

    searchTx () {
      if (this.txs.length > 0) this.txs.splice(0, this.txs.length)

      for (var i = this.blockTo; i >= this.blockFrom; i--) {
        if (web3.eth.getBlockTransactionCount(i) > 0) {
          this.txs.push(this.setBlock(i))
        }
      }
      // console.log(this.txs)
    },

    searchTxHash () {
      if (this.txs.length > 0) this.txs.splice(0, this.txs.length)
      this.msgErr = ''
      if (!this.txHash) {
        this.msgErr = 'invalid tx hash'
        return
      }
      var tx = web3.eth.getTransaction(this.txHash)
      // console.log(tx)
      if (tx) {
        this.txs.push(this.setBlock(tx.blockNumber))
      } else {
        this.msgErr = 'not found'
      }
    }
  }
}
</script>
