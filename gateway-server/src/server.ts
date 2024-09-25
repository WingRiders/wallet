import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import cors from '@elysiajs/cors'
import {Elysia} from 'elysia'
import {registerBasicAuth} from './basicAuth'
import {appConfig, config, isProd} from './config'
import {getCorsOptions} from './cors'
import {csp} from './csp'
import {registerStaticFilesRoutes} from './staticFiles'

const app = new Elysia()

// server static files from the built frontend
registerStaticFilesRoutes(app)

if (config.BASIC_AUTH_USERS) registerBasicAuth(app, config.BASIC_AUTH_USERS)

app.use(cors(getCorsOptions(config.CORS_ENABLED_FOR, isProd)))

app.onAfterHandle(({set}) => {
  set.headers['Content-Security-Policy'] = csp
  set.headers['Strict-Transport-Security'] =
    'max-age=63072000; includeSubDomains; preload'
})

app.get('/healthcheck', () => {
  return {
    healthy: true,
  }
})

app.get('*', () => {
  const indexPath = join(__dirname, '../../gateway/dist/index.html')
  let indexContent = readFileSync(indexPath, 'utf-8')

  indexContent = indexContent.replace(
    '"__DATA_CONFIG__"',
    `'${JSON.stringify(appConfig)}'`,
  )

  return new Response(indexContent, {
    headers: {
      'Content-Type': 'text/html',
      'Surrogate-Control': 'no-store',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
})

app.listen(config.PORT, () => {
  // biome-ignore lint/suspicious/noConsole: console.log is used to print the server URL
  console.log(`Server is running on http://localhost:${config.PORT}`)
})
