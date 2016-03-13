import Web3 from 'Web3'
const provider = 'http://localhost:8545'
var web3

export default {
  web3 () {
    if (!web3) {
      web3 = new Web3(new Web3.providers.HttpProvider(provider))
      console.log('new provider: ', provider)
    }
    return web3
  },

  getBalance (addr) {
    return web3.fromWei(web3.eth.getBalance(addr), 'ether').toNumber(3)
  },

  loadRegister () {
    var rJson = require('../cliapp/cregister.json')
    return this.loadContract(rJson.address, rJson.abi)
  },

  loadContract (address, abiJson) {
    var cont = web3.eth.contract(abiJson)
    return cont.at(address)
  },

  unixtime2date (ux) {
    if (!ux) return ''
    var d = new Date(ux * 1000)
    return [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate()
    ].join('/') + ' ' + d.toLocaleTimeString()
  }
}
