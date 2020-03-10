const initialState = {
  endpoint: '',
  tesseraEndpoint: '',
  accounts: [],
  editing: true,
  status: 'Disconnected',
}

export function networkReducer (network = initialState, action) {
  switch (action.type) {
    case 'SET_NETWORK':
      localStorage.network = JSON.stringify(action.payload)
      return action.payload

    case 'EDIT_NETWORK':
      return {
        ...network,
        editing: action.payload,
      }

    case 'SET_NETWORK_CONNECTING':
      return {
        ...network,
        status: 'Connecting...',
      }

    default:
      return network
  }
}
