const initialState = ''

export function errorReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_ERROR':
      return action.payload

    default:
      return state
  }
}
