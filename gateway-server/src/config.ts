import {z} from 'zod'

const configSchema = z.object({
  PORT: z.string(),
  BASIC_AUTH_USERS: z.string().optional(), // JSON string
  CORS_ENABLED_FOR: z.string(),
  API_SERVER_PUBLIC_URL_PREPROD: z.string(),
  API_SERVER_PUBLIC_URL_MAINNET: z.string(),
  CAB_SERVER_PUBLIC_URL_PREPROD: z.string(),
  CAB_SERVER_PUBLIC_URL_MAINNET: z.string(),
})

type ConfigType = {
  PORT: number
  BASIC_AUTH_USERS?: Record<string, string>
  CORS_ENABLED_FOR: string
  API_SERVER_PUBLIC_URL_PREPROD: string
  API_SERVER_PUBLIC_URL_MAINNET: string
  CAB_SERVER_PUBLIC_URL_PREPROD: string
  CAB_SERVER_PUBLIC_URL_MAINNET: string
}

const loadConfig = () => {
  const env = configSchema.parse(process.env)
  const config: ConfigType = {
    PORT: Number.parseInt(env.PORT),
    BASIC_AUTH_USERS: env.BASIC_AUTH_USERS
      ? JSON.parse(env.BASIC_AUTH_USERS)
      : undefined,
    CORS_ENABLED_FOR: env.CORS_ENABLED_FOR,
    API_SERVER_PUBLIC_URL_PREPROD: env.API_SERVER_PUBLIC_URL_PREPROD,
    API_SERVER_PUBLIC_URL_MAINNET: env.API_SERVER_PUBLIC_URL_MAINNET,
    CAB_SERVER_PUBLIC_URL_PREPROD: env.CAB_SERVER_PUBLIC_URL_PREPROD,
    CAB_SERVER_PUBLIC_URL_MAINNET: env.CAB_SERVER_PUBLIC_URL_MAINNET,
  }
  return config
}

export const config = loadConfig()

export const appConfig = {
  API_SERVER_URL_PREPROD: config.API_SERVER_PUBLIC_URL_PREPROD,
  API_SERVER_URL_MAINNET: config.API_SERVER_PUBLIC_URL_MAINNET,
  CAB_SERVER_URL_PREPROD: config.CAB_SERVER_PUBLIC_URL_PREPROD,
  CAB_SERVER_URL_MAINNET: config.CAB_SERVER_PUBLIC_URL_MAINNET,
}

export const isProd = process.env.NODE_ENV === 'production'
