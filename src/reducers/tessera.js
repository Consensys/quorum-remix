const initialState = {
  partiesFromUser: [],
  partiesFromServer: [],
  keysFromServer: [],
  keysFromUser: [],
}

export function tesseraReducer (tessera = initialState, action) {
  switch (action.type) {
    case 'ADD_PUBLIC_PARTY':
      const partiesFromUser = [...tessera.partiesFromUser, action.payload]
      localStorage.partiesFromUser = JSON.stringify(partiesFromUser)
      return {
        ...tessera,
        partiesFromUser,
      }

    case 'REMOVE_PUBLIC_PARTY':
      const newParties = tessera.partiesFromUser.filter(
        (option) => option.value !== action.payload)
      localStorage.partiesFromUser = JSON.stringify(newParties)
      return {
        ...tessera,
        partiesFromUser: newParties,
      }

    case 'SET_TESSERA_PARTIES':
      return {
        ...tessera,
        partiesFromServer: action.payload,
      }

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

    case 'SET_TESSERA_KEYS':
      return {
        ...tessera,
        keysFromServer: action.payload,
      }

    default:
      return tessera
  }
}
