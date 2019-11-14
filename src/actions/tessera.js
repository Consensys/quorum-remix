export function addPublicKey (option) {
  return {
    type: 'ADD_PUBLIC_KEY',
    payload: option,
  }
}

export function removePublicKey (key) {
  return {
    type: 'REMOVE_PUBLIC_KEY',
    payload: key,
  }
}

export function setTesseraOptions (options) {
  return {
    type: 'SET_TESSERA_OPTIONS',
    payload: options,
  }
}
