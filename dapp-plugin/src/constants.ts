import {NetworkId} from '@wingriders/cab/dappConnector'
import {NetworkName} from '@wingriders/cab/types'

export const NETWORK_NAME_TO_API_NETWORK_ID = {
  [NetworkName.PREPROD]: NetworkId.Testnet,
  [NetworkName.MAINNET]: NetworkId.Mainnet,
}
