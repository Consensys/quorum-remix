import React from 'react'

export const Store = React.createContext()

const initialState = {
  network: {
    provider: 'none',
    details: {},
    endpoint: 'n/a',
    accounts: [],
  },
  txMetadata: {}
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
