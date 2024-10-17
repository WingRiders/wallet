import {NetworkName} from '@wingriders/cab/types'
import {z} from 'zod'

const configSchema = z.object({
  API_SERVER_URL_PREPROD: z.string(),
  API_SERVER_URL_MAINNET: z.string(),
  CAB_SERVER_URL_PREPROD: z.string(),
  CAB_SERVER_URL_MAINNET: z.string(),
})

const loadConfig = () => {
  if (import.meta.env.DEV) {
    return configSchema.parse({
      API_SERVER_URL_PREPROD: import.meta.env.VITE_API_SERVER_URL_PREPROD,
      API_SERVER_URL_MAINNET: import.meta.env.VITE_API_SERVER_URL_MAINNET,
      CAB_SERVER_URL_PREPROD: import.meta.env.VITE_CAB_SERVER_URL_PREPROD,
      CAB_SERVER_URL_MAINNET: import.meta.env.VITE_CAB_SERVER_URL_MAINNET,
    })
  }

  const configData = document.body.getAttribute('data-config')
  if (!configData) throw new Error('Configuration not found.')

  return configSchema.parse(JSON.parse(configData))
}

export const config = loadConfig()

export const apiServerUrlByNetwork: Record<NetworkName, string> = {
  [NetworkName.PREPROD]: config.API_SERVER_URL_PREPROD,
  [NetworkName.MAINNET]: config.API_SERVER_URL_MAINNET,
}

export const cabServerUrlByNetwork: Record<NetworkName, string> = {
  [NetworkName.PREPROD]: config.CAB_SERVER_URL_PREPROD,
  [NetworkName.MAINNET]: config.CAB_SERVER_URL_MAINNET,
}
