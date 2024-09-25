import type {CborHexString, HexString} from '@wingriders/cab/dappConnector'
import type {
  Address as BechAddress,
  NetworkName,
  UTxO,
} from '@wingriders/cab/types'
import {CabBackendExplorer} from '@wingriders/wallet-common'
import type {IDataApi} from './types'

type DataApiOptions = {
  cabBackendUrl: string
  network: NetworkName
}

export class DataApi implements IDataApi {
  private cabBackendExplorer: CabBackendExplorer

  constructor({cabBackendUrl, network}: DataApiOptions) {
    this.cabBackendExplorer = new CabBackendExplorer({
      url: cabBackendUrl,
      network,
    })
  }

  async getUtxos(addresses: BechAddress[]): Promise<UTxO[]> {
    return this.cabBackendExplorer.fetchUnspentTxOutputs(addresses)
  }

  async submitTx(tx: CborHexString): Promise<HexString> {
    const res = await this.cabBackendExplorer.submitTxRaw('', tx) // first argument is txHash which is ignored in submitTxRaw
    return res.txHash as HexString
  }
}
