const initialState = {
  keysFromUser: [],
  keysFromServer: [],
}

export function tesseraReducer (tessera = initialState, action) {
  switch (action.type) {
    case 'ADD_PUBLIC_KEY':
      const keysFromUser = [...tessera.keysFromUser, action.payload]
      localStorage.keysFromUser = JSON.stringify(keysFromUser)
      return {
        ...tessera,
        keysFromUser,
      }

    case 'REMOVE_PUBLIC_KEY':
      const newKeys = tessera.keysFromUser.filter(
        (option) => option.value !== action.payload)
      localStorage.keysFromUser = JSON.stringify(newKeys)
      return {
        ...tessera,
        keysFromUser: newKeys,
      }

    case 'SET_TESSERA_OPTIONS':
      return {
        ...tessera,
        keysFromServer: action.payload,
      }

    default:
      return tessera
  }
}
