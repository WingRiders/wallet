import type {NetworkName} from '@wingriders/cab/types'
import {DataApi} from '../dataApi/DataApi'
import {WalletGateway} from '../gateway/WalletGateway'
import {injectCborApi} from './inject'
import {WrWalletInitMode} from './types'

export type InitWrWalletDappPluginOptions = {
  /**
   * URL to the wallet gateway application.
   */
  gatewayUrl: string
} & (
  | {
      mode: WrWalletInitMode.SINGLE_NETWORK
      network: NetworkName
      /**
       * URL to the CAB backend server for the selected network.
       */
      cabServerUrl: string
    }
  | {
      mode: WrWalletInitMode.MULTI_NETWORK
      /**
       * URL to the CAB backend server for each network.
       */
      cabServerUrlByNetwork: Record<NetworkName, string>
    }
)

export const initWrWalletDappPlugin = (
  options: InitWrWalletDappPluginOptions,
) => {
  injectCborApi({
    name: 'WingRiders',
    apiVersion: '0.0.1',
    icon: 'TODO',
    gateway: new WalletGateway({url: options.gatewayUrl}),
    ...(options.mode === WrWalletInitMode.SINGLE_NETWORK
      ? {
          mode: WrWalletInitMode.SINGLE_NETWORK,
          network: options.network,
          dataApi: new DataApi({
            cabServerUrl: options.cabServerUrl,
            network: options.network,
          }),
        }
      : {
          mode: WrWalletInitMode.MULTI_NETWORK,
          getDataApi: (network) =>
            new DataApi({
              cabServerUrl: options.cabServerUrlByNetwork[network],
              network,
            }),
        }),
  })
}
