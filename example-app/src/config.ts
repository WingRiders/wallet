import {NetworkName} from '@wingriders/cab/types'
import {z} from 'zod'

const configSchema = z.object({
  GATEWAY_URL: z.string(),
  CAB_SERVER_URL_PREPROD: z.string(),
  CAB_SERVER_URL_MAINNET: z.string(),
})

const loadConfig = () =>
  configSchema.parse({
    GATEWAY_URL: import.meta.env.VITE_GATEWAY_URL,
    CAB_SERVER_URL_PREPROD: import.meta.env.VITE_CAB_SERVER_URL_PREPROD,
    CAB_SERVER_URL_MAINNET: import.meta.env.VITE_CAB_SERVER_URL_MAINNET,
  })

export const config = loadConfig()

export const cabServerUrlByNetwork: Record<NetworkName, string> = {
  [NetworkName.PREPROD]: config.CAB_SERVER_URL_PREPROD,
  [NetworkName.MAINNET]: config.CAB_SERVER_URL_MAINNET,
}
