import { contractMethod, deploy, verifyContract } from '../api'
import { getMethodSignature } from '../utils/ContractUtils'
import { setError } from './error'

export function setContractDeploying (isDeploying) {
  return {
    type: 'SET_CONTRACT_DEPLOYING',
    payload: isDeploying,
  }
}

export function fetchCompilationSuccess (result) {
  return {
    type: 'FETCH_COMPILATION',
    payload: result.data,
  }
}

export function setContractLoading (address, loading) {
  return {
    type: 'SET_CONTRACT_LOADING',
    payload: {
      address,
      loading: loading
    }
  }
}

export function methodCallSuccess (address, method, res) {
  return {
    type: 'METHOD_CALL_SUCCESS',
    payload: {
      address,
      methodSignature: getMethodSignature(method),
      result: res,
    }
  }
}

export function resetTransactionResults () {
  return {
    type: 'RESET_TX_RESULTS',
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

export function doMethodCall (contract, method, params, txMetadata, privateFor,
  selectedPrivateFor) {
  return async dispatch => {
    dispatch(setContractLoading(contract.address, true))
    try {
      const __ret = await contractMethod(txMetadata, params, method, privateFor,
        selectedPrivateFor, contract)
      const res = __ret.res
      dispatch(methodCallSuccess(contract.address, method, res))
      dispatch(setError())
    } catch (e) {
      console.error('Error calling contract method', e)
      dispatch(setError(e.message))
    }
    dispatch(setContractLoading(contract.address, false))
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
      console.error('Error attaching to existing contract', e)
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
      console.error('Error deploying contract', e)
      dispatch(setError(e.message))
    }
    dispatch(setContractDeploying(false))
  }
}
