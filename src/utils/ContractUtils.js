export function getMethodSignature (method) {
  return `${method.name}(${method.inputs.map(
    (input) => `${input.type} ${input.name}`).join(', ')})`
}

export function getConstructor (abi) {
  const constructorMethods = abi.filter(
    (method) => method.type === 'constructor')
  if (constructorMethods.length > 0) {
    return constructorMethods[0]
  }
  return {
    type: 'constructor',
    inputs: [],
    payable: false,
    constant: false,
    name: '',
  }
}
