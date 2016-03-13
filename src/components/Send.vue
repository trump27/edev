<template>
  <div>
    <h1>Send Ether</h1>

    <div v-if="msgErr" class="alert alert-danger">{{msgErr}}</div>
    <div v-if="msgInfo" class="alert alert-success">{{msgInfo}}</div>

    <div class="form-horizontal">

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

      <div class="form-group" style="margin-top:30px;">
        <label class="col-sm-2 control-label">To:</label>
        <div class="col-sm-10">
          <select v-model="selectedTo" @click="changeToList" class="form-control" style="background-color:#eee">
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
      this.msgInfo = this.msgErr = ''
      if (!this.from || !this.value || !web3.isAddress(this.to)) {
        this.msgErr = 'invalid input'
        return
      }
      if (isNaN(this.value) || this.value < 0) {
        this.msgErr = 'invalid value'
      }
      web3.defaultAccount = this.from

      var value = web3.toWei(this.value, 'ether')
      var data = {from: this.from, to: this.to, value: value}
      var estimate = web3.eth.estimateGas(data)
      web3.eth.sendTransaction(data, (err, result) => {
        if (err) {
          this.msgErr = err
          console.log('e1: ', err)
          return
        }

        this.msgInfo = 'Txを送信しました (estimate: ' + estimate + ')'
        this.$dispatch('tracking', result, 'send')
      })
    }
  }
}
</script>
