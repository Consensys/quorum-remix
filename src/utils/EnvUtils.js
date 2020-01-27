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
        'http://remix-staging.goquorum.com',
        'https://remix-staging.goquorum.com',
      ],
    }
  }
}



