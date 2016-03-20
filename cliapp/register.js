/**
 * example)
 * node register.js Register.sol    # at first
 */
var fs = require('fs')
var solc = require('solc')
var Web3 = require('Web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const registerName = 'Register'             // register contract name
const registerSettingJson = './register.json'   // file of register setting
const nullCode = '0x0'                      // for checking registed code

/**
 * check
 */
if (!process.argv[2]) { console.log('[error] insufficient argument'); process.exit() }
if (!web3.isConnected) { console.log('[error] cannot access web3'); process.exit() }
// if (!web3.eth.mining) { console.log('[error] not mining.'); process.exit() }

/**
 * initialize
 */
web3.eth.defaultAccount = web3.eth.accounts[0]
var gasLimit = web3.eth.getBlock('latest').gasLimit
var register = getRegister(registerSettingJson)    // register contract instance
// register.getCount()

/**
 * process start
 */
var srcFile = process.argv[2]       // source file of contracts

// compile all contract
var compiled = compile(srcFile)

// check compiled
var contractNames = []
for (var cont in compiled.contracts) { contractNames.push(cont) }
if (contractNames.length === 0) process.exit()
if (!register && contractNames[0] !== registerName) {
  console.log('[error] regist Register contract at first:')
  process.exit()
}

var sequence = Promise.resolve()    // for sequential processes(Promise) in loop

/**
 * regist processes
 */
contractNames.forEach((contractName) => {
  sequence = sequence.then(() => {
    console.log('target contract', contractName)
    var params = {
      name: contractName,
      address: '',
      abi: JSON.parse(compiled.contracts[contractName].interface),
      bytecode: compiled.contracts[contractName].bytecode,
      srcFile: srcFile
    }
    return params           // set parameters for procceses
  })
  .then(deployContract)     // send conract to EVM
  .then(saveRegister)       // save register.json if Register contract
  .then(registContract)     // regist contract to Register-contract if not self
  .catch((err) => {         // stop if has error
    console.log('[error]', err)
    process.exit()          // exit
  })
  .then(() => {
    console.log('---')
  })
})  // end of processes

/** ========================= functions ========================= */
/**
 * Compile by solc / use Promise
 * @param {file} srcFile source file
 * @return {object} compiled
 */
function compile (srcFile) {
  var src = fs.readFileSync(srcFile, 'utf8')
  console.log('compiling.. :', srcFile)
  var compiled = solc.compile(src, 1) // 1 activates the optimiser
  if (compiled.errors) {
    console.log('[error] compile error')
    for (var msg in compiled.errors) console.log(compiled.errors[msg])
  }
  return compiled
}

/**
 * Deploy contract / use Promise
 * @param {object} params
 * @return {object} Promise
 */
function deployContract (params) {
  return new Promise((resolve, reject) => {
    var data = {
      data: params.bytecode, gas: gasLimit, from: web3.eth.accounts[0]
    }
    var contract = web3.eth.contract(params.abi)
    contract.new(data, (err, result) => {
      if (err) { console.log(err); reject(err); return }
      if (result.address) {
        console.log(params.name, 'address:', result.address)
        params.address = result.address
        resolve(params)
      } else {
        console.log('deploying.. tx:', result.transactionHash)
      }
    })
  })
}

/**
 * save register setting / use Promise
 * @param {object} params
 * @return {object} Promise
 */
function saveRegister (params) {
  return new Promise((resolve, reject) => {
    if (params.name !== registerName) {
      resolve(params); return
    }
    var src = fs.readFileSync(params.srcFile, 'utf8')
    var data = { register: params.name, address: params.address, abi: params.abi, source: src }
    var buf = JSON.stringify(data, null, '  ')
    fs.writeFile(registerSettingJson, buf, 'utf8', function (err) {
      if (err) {
        console.log('[error] cannot save Register:', err)
        reject(err)
      } else {
        console.log('saved Register info:', registerSettingJson)
        resolve(params)
      }
    })
  })
}

/**
 * regist compiled contract / use Promise
 * @param {object} params
 * @return {object} Promise
 */
function registContract (params) {
  return new Promise(function (resolve, reject) {
    if (params.name === registerName) {
      resolve(params); return
    }
    var abi = JSON.stringify(params.abi)
    var src = fs.readFileSync(params.srcFile, 'utf8')
    register.regist(params.name, params.address, abi, src,
      {gas: gasLimit},
      (err, txHash) => {
        if (err) {
          console.log('[error] regist failed:', params.name, err)
          reject(err)
          return
        }
        console.log('registing.. tx:', params.name, txHash)
        watchMining(txHash)
        .then(() => {
          // check code
          var code = web3.eth.getCode(params.address)
          if (code === nullCode) {
            console.log('regist failed(null code)', params.name, params.address)
            reject()
            return
          }
          console.log('contract registed:', params.name)
          resolve(params)
        }, (err) => {
          console.log('transaction fail:', params.name)
          reject(err)
        })
      }
    )
  })
}

/** ====================== util functions ====================== */
/**
 * watch mining / use Promise
 * @param {string} txHash Transaction hash
 * @return {object} Promise
 */
function watchMining (txHash) {
  return new Promise(function (resolve, reject) {
    var filter = web3.eth.filter('latest')
    filter.watch((err, result) => {
      if (err) { reject(err); return }
      var receipt = web3.eth.getTransactionReceipt(txHash)
      if (receipt && receipt.transactionHash === txHash) {
        filter.stopWatching()
        resolve(txHash)
      }
    })
  })
}

/**
 * Get instance of register contract
 * @param {string} path of settingFile
 * @return {object} instance of register contract
 */
function getRegister (SettingJson) {
  var setting
  try {
    setting = require(SettingJson)
  } catch (e) { return null }

  // check code
  var code = web3.eth.getCode(setting.address)
  if (code === nullCode) return null

  var contract = web3.eth.contract(setting.abi)
  var instance = contract.at(setting.address)

  return instance
}
