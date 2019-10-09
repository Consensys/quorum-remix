import Web3 from 'web3'

export function toAscii (value) {
  return Array.isArray(value)
    ? value.map((v) => toAscii(v))
    : Web3.utils.toAscii(value)
}

export function fromAscii (value) {
  return Array.isArray(value)
    ? value.map((v) => fromAscii(v))
    : Web3.utils.fromAscii(value)
}


