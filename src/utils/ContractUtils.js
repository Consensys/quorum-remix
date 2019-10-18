export function getMethodSignature (method) {
  return `${method.name}(${method.inputs.map(
    (input) => `${input.type} ${input.name}`).join(', ')})`
}
