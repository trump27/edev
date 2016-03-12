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
    return web3.fromWei(web3.eth.getBalance(addr), 'ether')
  }
}
