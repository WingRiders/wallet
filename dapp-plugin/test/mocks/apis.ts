import type {CborHexString, HexString} from '@wingriders/cab/dappConnector'

import type {Address as BechAddress, UTxO} from '@wingriders/cab/types'
import type {IDataApi} from '../../src/dataApi/types'
import type {IWalletGateway} from '../../src/gateway/types'

import {
  MOCKED_CHANGE_ADDRESS,
  MOCKED_COLLATERAL_UTXOS,
  MOCKED_NETWORK,
  MOCKED_REWARD_ADDRESSES,
  MOCKED_UNUSED_ADDRESSES,
  MOCKED_USED_ADDRESSES,
  MOCKED_UTXOS,
} from './values'

export const MOCKED_DATA_API: IDataApi = {
  async getUtxos(_addresses: BechAddress[]): Promise<UTxO[]> {
    return MOCKED_UTXOS
  },
  async submitTx(tx: CborHexString): Promise<HexString> {
    console.log('Transaction submitted', tx)
    return '' as HexString
  },
}

export const MOCKED_WALLET_GATEWAY: IWalletGateway = {
  async init() {
    return {
      network: MOCKED_NETWORK,
      usedAddresses: MOCKED_USED_ADDRESSES,
      unusedAddresses: MOCKED_UNUSED_ADDRESSES,
      changeAddress: MOCKED_CHANGE_ADDRESS,
      rewardAddresses: MOCKED_REWARD_ADDRESSES,
      collateralUtxos: MOCKED_COLLATERAL_UTXOS,
    }
  },
  async signTx(
    tx: CborHexString,
    _partialSign?: boolean,
  ): Promise<CborHexString> {
    console.log('Transaction signed')
    return tx
  },
  async signData(
    _addr: CborHexString,
    _sigStructure: CborHexString,
  ): Promise<HexString> {
    console.log('Data signed')
    return '' as HexString
  },
}
