var fs = require('fs')
var solc = require('solc')
var Web3 = require('Web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const regiContract = 'CRegister'

// var cregiJson = JSON.parse(fs.readFileSync('cregister.json', 'utf8'))
// if (cregiJson.address === '') {
//   createRegister()
// }
createRegister()

function createRegister() {
  var cregi_src = fs.readFileSync('contracts/CRegister.sol', 'utf8')
  var output = solc.compile(cregi_src, 1) // 1 activates the optimiser
  var cregi_abi = JSON.parse(output.contracts[regiContract].interface)
  var cregi_code = output.contracts[regiContract].bytecode
  var register = web3.eth.contract(cregi_abi)     // create object

  var accounts = web3.eth.accounts
  web3.eth.defaultAccount = accounts[0]

  var data = {
    data: cregi_code,
    gas: 3000000,
    from: accounts[0]
  }
  console.log('estimate cost: ', web3.eth.estimateGas(data))
  var registInst = register.new(data, function(err, result) {
    if (err) {
      console.log('error: ', err)
      return
    }
    if (!result.address) {
      console.log('txHash: ', result.transactionHash)
    } else {
      console.log('address: ', result.address)
      saveToRegi(result.address, cregi_abi)
    //   // regist self
    //   registInst.add('CRegister', result.address, cregi_abi, cregi_src,
    //     function(err, result) {
    //       if (err) console.log('self regist: ', err)
    //       var txHash = result
    //       var filter = web3.eth.filter('latest')
    //       filter.watch(function (err, result) {
    //         if (err) console.log('regist err: ', err)
    //         var receipt = web3.eth.getTransactionReceipt(txHash)
    //         if (receipt && receipt.transactionHash === txHash) {
    //             console.log('registed: ', txHash)
    //             filter.stopWatching()
    //         }
    //       })
    //     }
    //   )
    }
  })
}

function saveToRegi(address, abi) {
  var data = {address: address, abi: abi }
  var buf = JSON.stringify(data, null, '  ')
  fs.writeFile('./cregister.json', buf , 'utf8', function (err) {
    if (err) {
      console.log('save error: ', err)
    } else console.log('saved cregister.json')
  })
}