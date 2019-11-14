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

export function normalizeCompilationOutput (data) {
  if (data === null) {
    return {}
  }
  const contracts = {}
  Object.entries(data.contracts).forEach(([filename, fileContents]) => {
    Object.entries(fileContents).forEach(([contractName, contractData]) => {
      let name = `${contractName} - ${filename}`
      contracts[name] = { ...contractData, contractName, filename }
    })
  })
  return contracts
}
