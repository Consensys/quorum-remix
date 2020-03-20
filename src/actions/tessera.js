export function addPublicParty (option) {
  return {
    type: 'ADD_PUBLIC_PARTY',
    payload: option,
  }
}

export function removePublicParty (key) {
  return {
    type: 'REMOVE_PUBLIC_PARTY',
    payload: key,
  }
}

export function setTesseraParties (parties) {
  return {
    type: 'SET_TESSERA_PARTIES',
    payload: parties,
  }
}

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

export function setTesseraKeys (keys) {
  return {
    type: 'SET_TESSERA_KEYS',
    payload: keys,
  }
}
