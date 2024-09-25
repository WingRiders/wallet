import type {CborHexString, HexString} from '@wingriders/cab/dappConnector'
import {
  type Address as BechAddress,
  BigNumber,
  Lovelace,
  type UTxO,
} from '@wingriders/cab/types'
import type {IDataApi} from './types'

type DataApiOptions = {
  cabBackendUrl: string
}

export class DataApi implements IDataApi {
  private cabBackendUrl: string

  constructor({cabBackendUrl}: DataApiOptions) {
    this.cabBackendUrl = cabBackendUrl
  }

  async getUtxos(addresses: BechAddress[]): Promise<UTxO[]> {
    if (addresses.length === 0) return []
    const address = addresses[0]!

    return [
      {
        address,
        coins: new Lovelace(10_000_000) as Lovelace,
        tokenBundle: [],
        outputIndex: 0,
        txHash:
          '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
      },
      {
        address,
        coins: new Lovelace(100_000_000) as Lovelace,
        tokenBundle: [
          {
            policyId:
              'ef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbe',
            assetName: '54657374546f6b656e',
            quantity: new BigNumber(10),
          },
        ],
        outputIndex: 0,
        txHash:
          '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
      },
    ]
  }

  async submitTx(tx: CborHexString): Promise<HexString> {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('Transaction submitted', tx)
    return '' as HexString
  }
}
