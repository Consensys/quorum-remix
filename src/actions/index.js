import { getMethodSignature } from '../utils/ContractUtils'
import {
  contractMethod,
  deploy,
  getAccounts,
  testUrls,
  updateWeb3Url
} from '../api'

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

export function setError (message = '') {
  return { type: 'SET_ERROR', payload: message }
}

export function editNetwork (edit) {
  return { type: 'EDIT_NETWORK', payload: edit }
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

export function removeContract (address) {
  return { type: 'REMOVE_CONTRACT', payload: address }
}

export function fetchCompilationResult (client) {
  return async dispatch => {
    try {
      const result = await client.solidity.getCompilationResult()
      dispatch(fetchCompilationSuccess(result))
    } catch (e) {
      console.log('error getting compilation result', e)
    }
  }
}

export function setNetwork (endpoint, tesseraEndpoint) {
  return async dispatch => {
    dispatch({ type: 'SET_NETWORK_CONNECTING' })
    let accounts = [], status = 'Disconnected', editing = true, error = ''
    try {
      if (endpoint !== '') {
        await updateWeb3Url(endpoint, tesseraEndpoint)
        status = 'Connected'
        editing = false
        accounts = await getAccounts()
      }

    } catch (e) {
      console.log('Error fetching network data', e.message)
      error = e.message
    }

    dispatch(setError(error))

    dispatch({
      type: 'SET_NETWORK',
      payload: {
        endpoint,
        tesseraEndpoint,
        accounts,
        status,
        editing
      }
    })
  }
}

export function saveNetwork (endpoint = '', tesseraEndpoint = '') {
  return async dispatch => {
    try {
      if (tesseraEndpoint.endsWith('/')) {
        tesseraEndpoint = tesseraEndpoint.substring(0,
          tesseraEndpoint.length - 1)
      }

      await testUrls(endpoint, tesseraEndpoint)
      dispatch(setNetwork(endpoint, tesseraEndpoint))

    } catch (e) {
      console.log('Error fetching network data', e.message)
      dispatch(setError(e.message))
    }
  }
}

export function deployContract (params, contract, txMetadata) {
  return async dispatch => {
    const response = await deploy(contract, params, txMetadata)

    dispatch(addContract(contract, response.options.address, txMetadata))
  }
}

export function doMethodCall (contract, method, params, txMetadata, privateFor,
  selectedPrivateFor) {
  return async dispatch => {
    const __ret = await contractMethod(txMetadata, params, method, privateFor,
      selectedPrivateFor, contract)
    const res = __ret.res
    dispatch(methodCallSuccess(contract.address, method, res))
  }
}
