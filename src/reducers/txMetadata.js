const initialState = {
  gasLimit: '3000000',
  gasPrice: '0',
  value: '0',
  valueDenomination: 'wei',
}

export function txMetadataReducer (txMetadata = initialState, action) {
  switch (action.type) {
    case 'SELECT_ACCOUNT':
      return {
        ...txMetadata,
        account: action.payload
      }

    case 'CHANGE_GAS_PRICE':
      return {
        ...txMetadata,
        gasPrice: action.payload
      }

    case 'CHANGE_GAS_LIMIT':
      return {
        ...txMetadata,
        gasLimit: action.payload
      }

    case 'CHANGE_VALUE':
      return {
        ...txMetadata,
        value: action.payload
      }

    case 'CHANGE_VALUE_DENOMINATION':
      return {
        ...txMetadata,
        valueDenomination: action.payload
      }

    case 'UPDATE_PRIVATE_FOR':
      // empty [] privateFor is different than undefined. Disallow [] for now
      const privateFor = action.payload && action.payload.length > 0
        ? action.payload : undefined
      return {
        ...txMetadata,
        privateFor,
      }

    default:
      return txMetadata
  }
}
