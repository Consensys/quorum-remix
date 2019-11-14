export function setError (message = '') {
  return { type: 'SET_ERROR', payload: message }
}
