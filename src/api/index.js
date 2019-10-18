import Web3 from 'web3'
import { fromAscii } from '../utils/TypeUtils'
import { getConstructor } from '../utils/ContractUtils'

let web3;

export function updateWeb3Url(url) {
  console.log('updating web3', url)
  web3 = new Web3(url)
}

export async function deploy (contract, params, txMetadata) {
  let abi = contract.abi
  const constructor = getConstructor(abi)
  const bytecode = '0x' + contract.evm.bytecode.object
  const orderedParams = constructor.inputs.map(({ name, type }) => {
    const value = params[name]
    if (type.startsWith('bytes')) {
      // web3js doesn't automatically convert string to bytes32
      return fromAscii(value)
    }
    return value
  })
  const tx = {
    from: txMetadata.account,
    gasPrice: txMetadata.gasPrice,
    gas: txMetadata.gasLimit,
    value: Web3.utils.toWei(txMetadata.value, txMetadata.valueDenomination),
    privateFrom: txMetadata.privateFrom,
    privateFor: txMetadata.privateFor
  }
  const web3Contract = new web3.eth.Contract(abi)
  console.log('contract', web3Contract, 'args', orderedParams, 'meta', tx)
  const deployableContract = await web3Contract.deploy({
    data: bytecode,
    arguments: orderedParams,
  })
  const response = await deployableContract.send(tx)
  return response
}

export async function contractMethod (txMetadata, params, method, privateFor,
  selectedPrivateFor, contract) {
  const { account, gasLimit, gasPrice, value, valueDenomination } = txMetadata
  var _params = Object.values(params)
  var _sig_params = _params.map((value) => JSON.stringify(value)).join(', ')
  var methodSig = method.name + '(' + _sig_params + ')'
  var methodArgs = {
    from: account,
    gas: gasLimit,
    gasPrice,
    value: Web3.utils.toWei(value, valueDenomination),
    args: _params,
    privateFor: privateFor && selectedPrivateFor.filter(
      ({ enabled }) => enabled).map(({ key }) => key)
  }

  let web3Contract = new web3.eth.Contract(contract.abi, contract.address)
  let web3Method = web3Contract.methods[method.name](..._params)
  let callOrSend = method.constant ? 'call' : 'send'
  console.log('test', callOrSend, method.name, _params, methodArgs)
  const res = await web3Method[callOrSend](methodArgs)
  return { methodSig, methodArgs, res }
}
