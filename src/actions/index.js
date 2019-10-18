import { getMethodSignature } from '../utils/ContractUtils'

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
