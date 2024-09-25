const directives = {
  'default-src': ["'self'"],
  'frame-src': ["'self'"],
  'font-src': ["'self'", 'https://*.wingriders.com', 'data:'],
  'connect-src': ['*'],
  'img-src': ["'self'", 'data:', 'blob:'],
  'script-src': ["'self' 'unsafe-eval'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'object-src': ["'none'"],
}

export const csp = Object.entries(directives)
  .map(([key, value]) => `${key} ${value.join(' ')};`)
  .join(' ')
