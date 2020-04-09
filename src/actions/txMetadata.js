export function showTxMetadata (show) {
  return {
    type: 'SHOW_TX_METADATA',
    payload: show
  }
}

export function updatePrivateTransaction (isPrivate) {
  return {
    type: 'UPDATE_PRIVATE_TRANSACTION',
    payload: isPrivate
  }
}

export function updatePrivateFor (selection) {
  return {
    type: 'UPDATE_PRIVATE_FOR',
    payload: selection && selection.map((option) => option.value)
  }
}

export function updatePrivateFrom (selection) {
  return {
    type: 'UPDATE_PRIVATE_FROM',
    payload: selection && selection.value
  }
}

export function selectAccount (account) {
  return { type: 'SELECT_ACCOUNT', payload: account }
}

export function changeGasPrice (value) {
  return {
    type: 'CHANGE_GAS_PRICE',
    payload: value
  }
}

export function changeGasLimit (value) {
  return {
    type: 'CHANGE_GAS_LIMIT',
    payload: value
  }
}

export function changeValue (value) {
  return { type: 'CHANGE_VALUE', payload: value }
}

export function changeValueDenomination (value) {
  return {
    type: 'CHANGE_VALUE_DENOMINATION',
    payload: value
  }
}
