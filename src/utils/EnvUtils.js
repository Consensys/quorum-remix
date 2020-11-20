export function isDevelopment () {
  return process.env.NODE_ENV === 'development'
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage[key] = value
  } catch (e) {
    console.warn('Could not save to local storage.')
  }
}

export function loadFromLocalStorage (key) {
  try {
    return localStorage[key]
  } catch (e) {
    console.warn('Could not load from local storage.')
  }
}


