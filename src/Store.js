import React from 'react'
import Web3 from 'web3'

export const Store = React.createContext()

const initialState = {
  network: {
    provider: 'none',
    details: {},
    endpoint: 'n/a',
    accounts: [],
  },
  txMetadata: {
    gasLimit: 3000000,
    gasPrice: 0,
    value: 0,
    valueDenomination: 'wei',
  },
  compilation: {
    contracts: {}
  },
  contracts: []
}

function normalizeCompilationOutput (data) {
  if(data === null) {
    return {};
  }
  const contracts = {}
  Object.entries(data.contracts).forEach(([filename, fileContents]) => {
    Object.entries(fileContents).forEach(([contractName, contractData]) => {
      let name = `${contractName} - ${filename}`;
      contracts[name] = contractData
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
      return {
        ...state,
        contracts: [...state.contracts, action.payload]
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
