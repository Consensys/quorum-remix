const initialState = {
  error: '',
  network: {
    endpoint: '',
    tesseraEndpoint: '',
    accounts: [],
    editing: true,
    status: 'Disconnected',
  },
  txMetadata: {
    gasLimit: '3000000',
    gasPrice: '0',
    value: '0',
    valueDenomination: 'wei',
  },
  compilation: {
    contracts: {}
  },
  deployedAddresses: [],
  deployedContracts: {},
}

function normalizeCompilationOutput (data) {
  if(data === null) {
    return {};
  }
  const contracts = {}
  Object.entries(data.contracts).forEach(([filename, fileContents]) => {
    Object.entries(fileContents).forEach(([contractName, contractData]) => {
      let name = `${contractName} - ${filename}`;
      contracts[name] = { ...contractData, contractName, filename }
    })
  })
  return contracts
}

export default function rootReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_NETWORK':
      localStorage.network = JSON.stringify(action.payload)
      return { ...state, network: action.payload }

    case 'SELECT_ACCOUNT':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          account: action.payload
        }
      }

    case 'EDIT_NETWORK':
      return {
        ...state,
        network: {
          ...state.network,
          editing: action.payload,
        }
      }

    case 'SET_NETWORK_CONNECTING':
      return {
        ...state,
        network: {
          ...state.network,
          status: 'Connecting...',
        }
      }

    case 'CHANGE_GAS_PRICE':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          gasPrice: action.payload
        }
      }

    case 'CHANGE_GAS_LIMIT':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          gasLimit: action.payload
        }
      }

    case 'CHANGE_VALUE':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          value: action.payload
        }
      }

    case 'CHANGE_VALUE_DENOMINATION':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          valueDenomination: action.payload
        }
      }

    case 'FETCH_COMPILATION':
      const contracts = normalizeCompilationOutput(action.payload)
      return {
        ...state,
        compilation: {
          ...state.compilation,
          contracts
        },
      }

    case 'SELECT_CONTRACT':
      return {
        ...state,
        compilation: {
          ...state.compilation,
          selectedContract: action.payload
        }
      }

    case 'ADD_CONTRACT':
      const contract = action.payload
      const newAddresses = [...state.deployedAddresses]
      if(newAddresses.indexOf(contract.address) === -1) {
        newAddresses.push(contract.address)
      }
      return {
        ...state,
        deployedAddresses: newAddresses,
        deployedContracts: {
          ...state.deployedContracts,
          [contract.address]: contract
        }
      }

    case 'REMOVE_CONTRACT':
      const addressToDelete = action.payload
      const newDeployedContracts = { ...state.deployedContracts }
      delete newDeployedContracts[addressToDelete]
      return {
        ...state,
        deployedAddresses: state.deployedAddresses.filter(
          (a) => a !== addressToDelete),
        deployedContracts: newDeployedContracts
      }

    case 'UPDATE_PRIVATE_FOR':
      // empty [] privateFor is different than undefined. Disallow [] for now
      const privateFor = action.payload && action.payload.length > 0
        ? action.payload : undefined
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          privateFor,
        }
      }

    case 'METHOD_CALL':
      const { address, methodSignature, result } = action.payload
      const deployedContract = state.deployedContracts[address]
      return {
        ...state,
        deployedContracts: {
          ...state.deployedContracts,
          [address]: {
            ...deployedContract,
            results: {
              ...deployedContract.results,
              [methodSignature]: result,
            }
          }
        }
      }

    case 'EXPAND_CONTRACT':
      const expandContract = state.deployedContracts[action.payload.address]
      return {
        ...state,
        deployedContracts: {
          ...state.deployedContracts,
          [action.payload.address]: {
            ...expandContract,
            expanded: action.payload.expand,
          }
        }
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }

    default:
      return state;
  }
}

