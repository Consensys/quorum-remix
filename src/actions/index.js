import { getMethodSignature } from '../utils/ContractUtils'
import {
  contractMethod,
  deploy,
  getAccounts,
  getTesseraParties,
  testUrls,
  updateWeb3Url,
  verifyContract
} from '../api'

export function setContractDeploying (isDeploying) {
  return {
    type: 'SET_CONTRACT_DEPLOYING',
    payload: isDeploying,
  }
}

export function startMethodCall (address, method) {
  return {
    type: 'START_METHOD_CALL',
    payload: {
      address,
      methodSignature: getMethodSignature(method),
    }
  }
}

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

export function addPublicKey (option) {
  return {
    type: 'ADD_PUBLIC_KEY',
    payload: option,
  }
}

export function removePublicKey (key) {
  return {
    type: 'REMOVE_PUBLIC_KEY',
    payload: key,
  }
}

export function setTesseraOptions (options) {
  return {
    type: 'SET_TESSERA_OPTIONS',
    payload: options,
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
      if (endpoint) {
        await updateWeb3Url(endpoint, tesseraEndpoint)
        status = 'Connected'
        editing = false
        accounts = await getAccounts()
        const options = await getTesseraParties()
        dispatch(setTesseraOptions(options))
      } else {
        error = "Please connect to a quorum node"
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

    dispatch({
      type: 'RESET_TX_RESULTS',
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

export function addExistingContract (contract, address, txMetadata) {
  return async dispatch => {
    dispatch(setContractDeploying(true))
    try {
      await verifyContract(address)
      dispatch(addContract(contract, address, txMetadata))
      dispatch(setError())
    } catch (e) {
      console.error("Error attaching to existing contract", e)
      dispatch(setError(e.message))
    }
    dispatch(setContractDeploying(false))
  }
}

export function deployContract (params, contract, txMetadata) {
  return async dispatch => {
    dispatch(setContractDeploying(true))
    try {
      const response = await deploy(contract, params, txMetadata)
      dispatch(addContract(contract, response.options.address, txMetadata))
      dispatch(setError())
    } catch (e) {
      console.error("Error deploying contract", e)
      dispatch(setError(e.message))
    }
    dispatch(setContractDeploying(false))
  }
}

export function doMethodCall (contract, method, params, txMetadata, privateFor,
  selectedPrivateFor) {
  return async dispatch => {
    dispatch(startMethodCall(contract.address, method))
    try {
      const __ret = await contractMethod(txMetadata, params, method, privateFor,
        selectedPrivateFor, contract)
      const res = __ret.res
      dispatch(methodCallSuccess(contract.address, method, res))
      dispatch(setError())
    } catch (e) {
      console.error("Error calling contract method", e)
      dispatch(setError(e.message))
    }
  }
}
