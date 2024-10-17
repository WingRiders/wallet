import type {NetworkName} from '@wingriders/cab/types'
import {DataApi} from '../dataApi/DataApi'
import {WalletGateway} from '../gateway/WalletGateway'
import {injectCborApi} from './inject'
import {WalletInitMode} from './types'

export type InitDappPluginOptions = {
  /**
   * URL to the wallet gateway application.
   */
  gatewayUrl: string
} & (
  | {
      mode: WalletInitMode.SINGLE_NETWORK
      network: NetworkName
      /**
       * URL to the CAB backend server for the selected network.
       */
      cabServerUrl: string
    }
  | {
      mode: WalletInitMode.MULTI_NETWORK
      /**
       * URL to the CAB backend server for each network.
       */
      cabServerUrlByNetwork: Record<NetworkName, string>
    }
)

export const initDappPlugin = (options: InitDappPluginOptions) => {
  injectCborApi({
    name: 'WingRiders',
    apiVersion: '0.0.1',
    icon: 'TODO',
    gateway: new WalletGateway({url: options.gatewayUrl}),
    ...(options.mode === WalletInitMode.SINGLE_NETWORK
      ? {
          mode: WalletInitMode.SINGLE_NETWORK,
          network: options.network,
          dataApi: new DataApi({
            cabServerUrl: options.cabServerUrl,
            network: options.network,
          }),
        }
      : {
          mode: WalletInitMode.MULTI_NETWORK,
          getDataApi: (network) =>
            new DataApi({
              cabServerUrl: options.cabServerUrlByNetwork[network],
              network,
            }),
        }),
  })
}
