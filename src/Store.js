import React from 'react'

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
  }
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
      return { ...state, network: action.payload };

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
