import { getMethodSignature } from '../utils/ContractUtils'
import { contractMethod, deploy } from '../api'

export function methodCallSuccess (address, method, res) {
  return {
    type: 'METHOD_CALL',
    payload: {
      address,
      methodSignature: getMethodSignature(method),
      result: res,
    }
  }
}

export function expandContract (address, expanded) {
  return {
    type: 'EXPAND_CONTRACT',
    payload: { address, expand: !expanded }
  }
}

export function selectContract (contractName) {
  return { type: 'SELECT_CONTRACT', payload: contractName }
}

export function addContract (contract, address, txMetadata) {
  return {
    type: 'ADD_CONTRACT',
    payload: {
      ...contract,
      address: address,
      privateFor: txMetadata.privateFor,
      privateFrom: txMetadata.privateFrom
    }
  }
}

export function changeTesseraEndpoint (endpointInput) {
  return { type: 'CHANGE_TESSERA_ENDPOINT', payload: endpointInput }
}

export function updatePrivateFor (selection) {
  return {
    type: 'UPDATE_PRIVATE_FOR',
    payload: selection && selection.map((option) => option.value)
  }
}

export function selectAccount (account) {
  return { type: 'SELECT_ACCOUNT', payload: account }
}

export function changeGasPrice (value) {
  return {
    type: 'CHANGE_GAS_PRICE',
    payload: value
  }
}

export function changeGasLimit (value) {
  return {
    type: 'CHANGE_GAS_LIMIT',
    payload: value
  }
}

export function changeValue (value) {
  return { type: 'CHANGE_VALUE', payload: value }
}

export function changeValueDenomination (value) {
  return {
    type: 'CHANGE_VALUE_DENOMINATION',
    payload: value
  }
}

export function fetchCompilationSuccess (result) {
  return {
    type: 'FETCH_COMPILATION',
    payload: result.data,
  }
}

export function fetchNetworkSuccess (provider, details, endpoint, accounts) {
  return {
    type: 'FETCH_NETWORK_SUCCESS',
    payload: {
      provider,
      details,
      endpoint,
      accounts,
    }
  }
}

export function removeContract (address) {
  return { type: 'REMOVE_CONTRACT', payload: address }
}

async function fetchAccounts (client) {
  let accounts = await client.udapp.getAccounts()
  return (typeof accounts === 'string') ? [accounts] : accounts
}

export function fetchCompilationResult (client, dispatch) {
  return async dispatch => {
    try {
      const result = await client.solidity.getCompilationResult()
      dispatch(fetchCompilationSuccess(result))
    } catch (e) {
      console.log('error getting compilation result', e)
    }
  }
}

export function fetchNetworkData (client) {
  return async dispatch => {
    try {
      console.log('Fetching network data')
      const provider = await client.network.getNetworkProvider()
      const details = await client.network.detectNetwork()
      let endpoint = ''
      if (provider === 'web3') {
        endpoint = await client.network.getEndpoint()
      }
      // accounts are updated on each network change, so it makes sense to grab
      // them together
      const accounts = await fetchAccounts(client)
      dispatch(fetchNetworkSuccess(provider, details, endpoint, accounts))
    } catch (e) {
      console.error('Error fetching network data', e)
    }
  }
}

export function deployContract (params, contract, txMetadata) {
  return async dispatch => {
    console.log('onDeploy', params)
    const response = await deploy(contract, params, txMetadata)

    console.log('finished', response, response.options.address)
    dispatch(addContract(contract, response.options.address, txMetadata))
  }
}

export function doMethodCall (contract, method, params, txMetadata, privateFor,
  selectedPrivateFor) {
  return async dispatch => {
    const __ret = await contractMethod(txMetadata, params, method, privateFor,
      selectedPrivateFor, contract)
    var methodSig = __ret.methodSig
    var methodArgs = __ret.methodArgs
    const res = __ret.res
    console.log('transaction send response', res, method, methodSig, methodArgs)
    dispatch(methodCallSuccess(contract.address, method, res))
  }
}
