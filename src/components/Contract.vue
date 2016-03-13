<template>
  <div>
    <h1>Contract</h1>

    <div v-if="msgErr" class="alert alert-danger">{{msgErr}}</div>
    <div v-if="msgInfo" class="alert alert-success">{{msgInfo}}</div>

    <table class="table table-condensed table-bordered table-hover">
      <tr>
        <th>Name</th><th>Address</th>
      </tr>
      <tr v-for="cont in contracts">
        <td>{{name}}</td><td>{{address}}</td>
      </tr>
    </table>

    <div class="form-horizontal">
      <div class="form-group">
        <legend>Regist</legend>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">Name:</label>
        <div class="col-sm-10">
          <input v-model="register.name" type="text" class="form-control" required="required" placeholder="string">
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">Address:</label>
        <div class="col-sm-10">
          <input v-model="register.address" type="text" class="form-control" required="required" placeholder="string">
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">ABI:</label>
        <div class="col-sm-10">
          <textarea v-model="register.abi" class="form-control" rows="3"></textarea>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label">Source:</label>
        <div class="col-sm-10">
          <textarea v-model="register.source" class="form-control" rows="3"></textarea>
        </div>
      </div>

      <button @click.prevent="regist" class="btn btn-primary">Regist</button>
    </div>

  </div>
</template>

<script>
import common from '../common.js'
var web3 = common.web3()
var register = null

export default {
  data () {
    return {
      msgErr: '',
      msgInfo: '',
      contracts: [],
      register: {
        name: '',
        address: '',
        abi: '',
        source: ''
      }
    }
  },
  ready () {
    web3.eth.defaultAccount = (web3.eth.accounts)[0]
    register = common.loadRegister()
    console.log(register)

    var event = register.Changed()
    event.watch(function (err, result) {
      if (err) {
        console.log('event error: ', err)
      } else {
        console.log('Changed: ', result)
      }
    })

    this.getList()
  },

  methods: {
    getList () {
      var cnt = register.getCount.call().toNumber()
      console.log(cnt)

      if (this.contracts.length > 0) this.contracts.splice(0, this.contracts.length)
      for (var i = 0; i < cnt; i++) {
        var item = register.getContInfoByIndex(i)
        this.contracts.push({name: item[0], addr: item[1]})
      }
    },

    regist () {
      this.msgInfo = this.msgErr = ''
      if (!this.register.name || !this.register.address || !this.register.abi) {
        this.msgErr = 'invalid input'
      }

      register.regist(
        this.register.name,
        this.register.address,
        this.register.abi,
        this.register.source,
        {gas: 300000},
        (err, result) => {
          if (err) {
            this.msgErr = err
            console.log('ex error: ', err)
            return
          }
          this.msgInfo = 'Txを送信しました'
          this.$dispatch('tracking', result, 'contract regist')
        }
      )
    }
  }
}
</script>
