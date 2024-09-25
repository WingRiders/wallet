import type {NetworkName} from '@wingriders/cab/types'
import {DataApi} from '../dataApi/DataApi'
import {WalletGateway} from '../gateway/WalletGateway'
import {injectCborApi} from './inject'

export type InitDappPluginOptions = {
  /**
   * URL to the wallet gateway application.
   */
  gatewayUrl: string
  /**
   * URL to the CAB backend server for each network.
   */
  cabBackendUrlByNetwork: Record<NetworkName, string>
}

export const initDappPlugin = (options: InitDappPluginOptions) => {
  injectCborApi({
    gateway: new WalletGateway({url: options.gatewayUrl}),
    getDataApi: (network) =>
      new DataApi({
        cabBackendUrl: options.cabBackendUrlByNetwork[network],
      }),
    name: 'WingRiders',
    apiVersion: '0.0.1',
    icon: 'TODO',
  })
}
