<template>
  <div>
    <h1>Send Ether</h1>

    <div v-if="msgErr" class="alert alert-danger">{{msgErr}}</div>
    <div v-if="msgInfo" class="alert alert-success">{{msgInfo}}</div>

    <div class="form-group">
      <label class="col-sm-2 control-label">From:</label>
      <div class="col-sm-10">
        <select v-model="from" class="form-control">
          <option v-for="option in accounts" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-2 control-label">To:</label>
      <div class="col-sm-10">
        <select v-model="selectedTo" @click="changeToList" class="form-control">
          <option v-for="option in accounts" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-2 control-label"></label>
      <div class="col-sm-10">
        <input v-model="to" type="text" class="form-control" required="required" placeholder="address">
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-2 control-label">Value:</label>
      <div class="col-sm-10">
        <input v-model="value" type="text" class="form-control" required="required" placeholder="ether">
      </div>
    </div>

    <button @click.prevent="sendTransaction" class="btn btn-primary">Send transaction</button>

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
      accounts: [],
      from: '',
      selectedTo: '',
      to: '',
      value: ''
    }
  },
  ready () {
    var account = web3.eth.accounts
    for (var idx in account) {
      this.accounts.push({text: account[idx], value: account[idx]})
    }
  },

  methods: {
    changeToList () {
      this.to = this.selectedTo
    },

    sendTransaction () {
      if (!this.from || !this.to || !this.value) {
        this.msgErr = 'invalid address'
        return
      }
      web3.defaultAccount = this.from
      web3.eth.sendTransaction(
        {from: this.from, to: this.to, value: this.value},
        (err, result) => {
          if (err) {
            this.msgErr = err
            console.log('e1: ', err)
            return
          }
          var txhash = result
          var filter = web3.eth.filter('latest')

          filter.watch(function (error, result) {
            if (error) console.log('watch: ', error)
            // XXX this should be made asynchronous as well.  time
            // to get the async library out...
            var receipt = web3.eth.getTransactionReceipt(txhash)

            console.log('filter: ', result)

            if (receipt && receipt.transactionHash === txhash) {
              console.log('ok', txhash)
              filter.stopWatching()
            }
          })
        }
      )
    }
  }
}
</script>
