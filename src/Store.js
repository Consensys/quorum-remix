import React from 'react'
import Web3 from 'web3'

export const Store = React.createContext()

const initialState = {
  network: {
    provider: 'none',
    details: {},
    endpoint: '',
    accounts: [],
    tesseraEndpoint: '',
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

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_NETWORK':
      console.log(action.payload)
      const network = action.payload
      let web3
      if (network.endpoint) {
        if(network.endpoint.startsWith('http://localhost:22000')) {
          console.log('setting 7 nodes tessera url')
          network.tesseraEndpoint = 'http://localhost:9001'
        }
        web3 = new Web3(network.endpoint)
      }
      return { ...state, network: network, web3 }

    case 'SELECT_ACCOUNT':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          account: action.payload
        }
      }

    case 'CHANGE_TESSERA_ENDPOINT':
      return {
        ...state,
        network: {
          ...state.network,
          tesseraEndpoint: action.payload,
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
      console.log('comp', contracts)
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
      console.log('add contract', contract)
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
      console.log('remove contract', addressToDelete)
      const newDeployedContracts = { ...state.deployedContracts }
      delete newDeployedContracts[addressToDelete]
      return {
        ...state,
        deployedAddresses: state.deployedAddresses.filter(
          (a) => a !== addressToDelete),
        deployedContracts: newDeployedContracts
      }

    case 'UPDATE_PRIVATE_FOR':
      return {
        ...state,
        txMetadata: {
          ...state.txMetadata,
          privateFor: action.payload
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

    default:
      return state;
  }
}

export function StoreProvider (props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const store = { state, dispatch };

  return <Store.Provider
    value={store}>{props.children}</Store.Provider>
}
