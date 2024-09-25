import type Elysia from 'elysia'

export const registerBasicAuth = (
  app: Elysia,
  users: Record<string, string>,
) => {
  app.onBeforeHandle(({headers}) => {
    const basicAuth = headers.authorization

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (
        Object.entries(users).some(
          ([username, password]) => user === username && pwd === password,
        )
      ) {
        return
      }
    }

    return new Response(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Restricted Area"',
      },
    })
  })
}
