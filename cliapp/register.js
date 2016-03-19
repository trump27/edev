/**
 * example)
 * node xxx.js xxxxx.sol
 */
var fs = require('fs')
var solc = require('solc')
var Web3 = require('Web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

// const regiContract = 'CRegister'

/**
 * check
 */
if (!process.argv[2]) { console.log('error: insufficient argument'); process.exit() }
if (!web3.eth.mining) { console.log('error: not mining.'); process.exit() }

/**
 * initialize
 */
web3.eth.defaultAccount = web3.eth.accounts[0]
var gasLimit = web3.eth.getBlock('latest').gasLimit

/**
 * process start
 */
var srcFile = process.argv[2]
var complied = compile(srcFile)

// compile & deploy each contract
for (var contractName in complied.contracts) {
  // compile contract
  var compileResult = complied.contracts[contractName]
  // deploy contract
  deployContract(compileResult.bytecode, JSON.parse(compileResult.interface))
  .then((address) => {
    console.log(contractName, 'contract address:', address)
  }, (err) => {
    console.log(err)
  })
}
// end of process

/** ========================= functions ========================= */
/**
 * Compile by solc / sync
 * @param {file} srcFile source file
 * @return {object} compiled
 */
function compile (srcFile) {
  var src = fs.readFileSync(srcFile, 'utf8')
  console.log('compiling... :', srcFile)
  var compiled = solc.compile(src, 1) // 1 activates the optimiser
  if (compiled.errors) {
    console.log('compile error')
    for (var msg in compiled.errors) console.log(compiled.errors[msg])
  }
  return compiled
}

/**
 * Deploy contract / async
 * @param {string} bytecode
 * @param {object} ABIJson ABI
 * @return {object} promise(contract address)
 */
function deployContract (bytecode, ABIJson) {
  return new Promise(function (resolve, reject) {
    var data = {
      data: bytecode, gas: gasLimit, from: web3.eth.accounts[0]
    }
    var contract = web3.eth.contract(ABIJson)
    contract.new(data, (err, deployed) => {
      if (err) { console.log(err); reject(err); return }
      if (deployed.address) {
        resolve(deployed.address)
      } else {
        console.log('mining.. tx:', deployed.transactionHash)
      }
    })
  })
}

// var deployContract = function (bytecode, ABIJson) {
//   return new Promise(function (resolve, reject) {
//     var data = {
//       data: bytecode, gas: gasLimit, from: web3.eth.accounts[0]
//     }
//     var contract = web3.eth.contract(ABIJson)
//     contract.new(data, (err, deployed) => {
//       if (err) { console.log(err); reject(err); return }
//       if (deployed.address) {
//         resolve(deployed.address)
//       } else {
//         console.log('wait mined...')
//       }
//     })
//   })
// }

// function saveToRegi (address, abi) {
//   var data = { address: address, abi: abi }
//   var buf = JSON.stringify(data, null, '  ')
//   fs.writeFile('./cregister.json', buf, 'utf8', function (err) {
//     if (err) {
//       console.log('save error: ', err)
//     } else console.log('saved cregister.json')
//   })
// }
