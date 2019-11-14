import { normalizeCompilationOutput } from '../utils/ContractUtils'

const initialState = {
  contracts: {},
  deploying: false
}

export function compilationReducer (compilation = initialState,
  action) {
  switch (action.type) {
    case 'FETCH_COMPILATION':
      const contracts = normalizeCompilationOutput(action.payload)
      return {
        ...compilation,
        contracts
      }

    case 'SELECT_CONTRACT':
      return {
        ...compilation,
        selectedContract: action.payload
      }

    case 'SET_CONTRACT_DEPLOYING':
      return {
        ...compilation,
        deploying: action.payload
      }

    default:
      return compilation
  }
}
