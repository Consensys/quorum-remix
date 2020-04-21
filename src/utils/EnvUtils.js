export function isDevelopment () {
  return process.env.NODE_ENV === 'development'
}

export function getPluginDevMode () {
  if (isDevelopment()) {
    return {
      port: 8080,
      origins: [
        'http://localhost',
        'http://remix-dev.goquorum.com',
        'https://remix-dev.goquorum.com',
      ],
    }
  } else {
    return {
      origins: [
        'http://remix-dev.goquorum.com',
        'https://remix-dev.goquorum.com',
        'http://remix-staging.goquorum.com',
        'https://remix-staging.goquorum.com',
      ],
    }
  }
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


