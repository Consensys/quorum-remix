import Web3 from 'web3'
import { fromAscii } from '../utils/TypeUtils'
import { getConstructor } from '../utils/ContractUtils'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

let web3, tessera

export async function updateWeb3Url (endpoint, tesseraEndpoint) {
  web3 = createWeb3(endpoint)
  tessera = tesseraEndpoint
  await testUrls(endpoint, tesseraEndpoint)
}

function prepareForAxiosCall (url, path = '/') {
  const parsed = new URL(url)
  const username = parsed.username
  const password = parsed.password
  const config = {}
  if (username) {
    config.auth = {
      username: username,
      password: password
    }
  }
  parsed.username = ''
  parsed.password = ''
  parsed.pathname = path
  return [parsed.toString(), config]
}

export async function testUrls (rpcEndpoint, tesseraEndpoint) {
  if (!rpcEndpoint) {
    throw new Error('RPC url must not be blank.')
  }
  try {
    if (rpcEndpoint.startsWith('http')) {
      const [url, config] = prepareForAxiosCall(rpcEndpoint)
      // test with axios because we get more detailed errors back than web3
      await axios.post(url,
        { 'jsonrpc': '2.0', 'method': 'eth_protocolVersion', 'params': [] },
        config)
    }

    // test with Web3 because there are slight differences in how it connects
    const testWeb3 = createWeb3(rpcEndpoint)
    await testWeb3.eth.getProtocolVersion()

  } catch (e) {
    if (e.response) {
      if(e.response.status === 401) {
        throw new Error(`401 Unauthorized. Did you include Basic Auth credentials in the URL? (https://username:password@example.com)`)
      }
      throw new Error(
        `Error response from ${rpcEndpoint}: ${e.response.status} ${e.response.statusText} ${e.response.data}`)
    } else {
      throw new Error(
        `Could not connect to ${rpcEndpoint}: ${e.message}. This could be: a. geth is not running at this address, b. the port is not accessible, or c. CORS settings on geth do not allow this url (check the developer console for CORS errors)`)
    }
  }

  if (tesseraEndpoint !== '') {
    await getPrivateFromOptions(tesseraEndpoint)
    await getPrivateForOptions(tesseraEndpoint)
  }
}

function createWeb3 (endpoint) {
  let provider
  if (endpoint.startsWith('http')) {
    const parsed = new URL(endpoint)
    const headers = []
    if (parsed.username) {
      const encoded = new Buffer(
        `${parsed.username}:${parsed.password}`).toString('base64')
      parsed.username = ''
      parsed.password = ''
      headers.push({ name: 'Authorization', value: `Basic ${encoded}` })
    }
    provider = new Web3.providers.HttpProvider(parsed.toString(), {
      headers: headers,
    })
  } else if (endpoint.startsWith('ws')) {
    // ws provider creates auth header automatically
    provider = new Web3.providers.WebsocketProvider(endpoint)

  } else {
    provider = endpoint
  }
  return new Web3(provider)
}

export async function getAccounts () {
  return await web3.eth.getAccounts()
}

export async function getPrivateFromOptions (tesseraEndpoint = tessera) {
  return getTesseraKeys(tesseraEndpoint, '/keys')
}
export async function getPrivateForOptions (tesseraEndpoint = tessera) {
  return getTesseraKeys(tesseraEndpoint, '/partyinfo/keys')
}

export async function getTesseraKeys (tesseraEndpoint, path) {
  if (!tesseraEndpoint) {
    return []
  }
  const [url, config] = prepareForAxiosCall(tesseraEndpoint, path)
  try {
    const response = await axios.get(url, config)
    return response.data.keys
      .map(party => formatAsSelectOption(party))
  } catch (e) {
    if (e.response) {
      throw new Error(
        `Error response from ${url}: ${e.response.status} ${e.response.statusText}`)
    } else {
      throw new Error(
        `Could not connect to ${url}: ${e.message}. This could be: a. tessera is not running at this address, b. the port is not accessible, or c. CORS settings on tessera do not allow this url (check the developer console for CORS errors)`)
    }
  }
}

function formatAsSelectOption (party) {
  return {
    value: party.key,
    label: party.key,
  }
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

  const web3Contract = new web3.eth.Contract(abi)
  const deployableContract = await web3Contract.deploy({
    data: bytecode,
    arguments: orderedParams,
  })

  const tx = {
    from: txMetadata.account,
    gasPrice: txMetadata.gasPrice,
    value: Web3.utils.toWei(txMetadata.value, txMetadata.valueDenomination),
  }

  tx.gas = txMetadata.gasLimit !== '' ? parseInt(txMetadata.gasLimit, 10) : await deployableContract.estimateGas(tx)

  if (txMetadata.privateTransaction) {
    tx.privateFrom = txMetadata.privateFrom
    tx.privateFor = txMetadata.privateFor
    tx.privacyFlag = parseInt(txMetadata.privacyFlag, 10)
  }

  const response = await deployableContract.send(tx)
  return response
}

export async function contractMethod (txMetadata, params, method, privateFor,
  selectedPrivateFor, contract) {
  const { account, gasLimit, gasPrice, value, valueDenomination } = txMetadata
  var _params = Object.values(params)
  var _sig_params = _params.map((value) => JSON.stringify(value)).join(', ')
  var methodSig = method.name + '(' + _sig_params + ')'

  await verifyContract(contract.address)

  let web3Contract = new web3.eth.Contract(contract.abi, contract.address)
  let web3Method = web3Contract.methods[method.name](..._params)

  var methodArgs = {
    from: account,
    gasPrice,
    value: Web3.utils.toWei(value, valueDenomination),
    args: _params,
    privateFor: privateFor && selectedPrivateFor.filter(
      ({ enabled }) => enabled).map(({ key }) => key),
    privacyFlag: contract.privacyFlag && parseInt(contract.privacyFlag, 10),
  }

  methodArgs.gas = gasLimit !== '' ? parseInt(gasLimit, 10) : await web3Method.estimateGas(methodArgs)

  let callOrSend = method.constant ? 'call' : 'send'
  const res = await web3Method[callOrSend](methodArgs)
  return { methodSig, methodArgs, res }
}

export async function verifyContract(address) {
  const contractBinary = await web3.eth.getCode(address)
  if (contractBinary === '0x') {
    throw new Error(`Contract does not exist at ${address}`)
  }
}
