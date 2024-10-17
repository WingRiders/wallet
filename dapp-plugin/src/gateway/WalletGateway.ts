import type {
  CborHexString,
  Address as HexAddress,
  HexString,
} from '@wingriders/cab/dappConnector'
import {NetworkName} from '@wingriders/cab/types'
import type {IWalletGateway} from './types'

type WalletGatewayOptions = {
  url: string
}

export class WalletGateway implements IWalletGateway {
  private url: string

  constructor({url}: WalletGatewayOptions) {
    this.url = url
  }

  async init() {
    return {
      network: NetworkName.PREPROD,
      usedAddresses: [
        '00b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f996066569251',
      ] as HexAddress[],
      unusedAddresses: [],
      changeAddress: '' as HexAddress,
      rewardAddresses: [],
      collateralUtxos: [],
    }
  }

  async signTx(
    tx: CborHexString,
    _partialSign?: boolean,
  ): Promise<CborHexString> {
    console.log('Transaction signed')
    return tx
  }

  async signData(
    _addr: CborHexString,
    _sigStructure: CborHexString,
  ): Promise<HexString> {
    console.log('Data signed')
    return '' as HexString
  }
}
