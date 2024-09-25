import type {Utxo as OgmiosUTxO} from '@cardano-ogmios/schema'
import type {CborHexString, HexString} from '@wingriders/cab/dappConnector'
import {
  type Address,
  type Address as BechAddress,
  BigNumber,
  Language,
  Lovelace,
  type UTxO,
} from '@wingriders/cab/types'
import type {Convert} from '../types'
import type {IDataApi} from './types'

type UTxOResponse = Convert<bigint, number | BigNumber, OgmiosUTxO[number]>

const parseUTxOResponse = (utxo: UTxOResponse): UTxO => ({
  txHash: utxo.transaction.id,
  outputIndex: utxo.index,
  address: utxo.address as Address,
  coins: new Lovelace(utxo.value.ada.lovelace) as Lovelace,
  tokenBundle: Object.entries(utxo.value)
    .filter(([key]) => key !== 'ada')
    .flatMap(([policyId, tokens]) =>
      Object.entries(tokens).map(([assetName, quantity]) => ({
        policyId,
        assetName,
        quantity: new BigNumber(quantity),
      })),
    ),
  ...(utxo.datumHash ? {datumHash: utxo.datumHash} : {}),
  ...(utxo.datum != null ? {inlineDatum: true} : {}),
  ...(utxo.datum != null ? {datum: utxo.datum} : {}),
  ...(utxo.script != null ? {hasInlineScript: true} : {}),
  ...(utxo.script && utxo.script.language !== 'native'
    ? {
        inlineScript: {
          language: {
            'plutus:v1': Language.PLUTUSV1,
            'plutus:v2': Language.PLUTUSV2,
            'plutus:v3': 2, // TODO: add support for PLUTUSV3 to the Language enum in CAB
          }[utxo.script.language],
          bytes: Buffer.from(utxo.script.cbor, 'hex'),
        },
      }
    : {}),
})

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

    const utxos: UTxOResponse[] = await fetch(
      `${this.cabBackendUrl}/utxos?addresses=${addresses.join(',')}`,
    ).then((res) => res.json())
    return utxos.map(parseUTxOResponse)
  }

  async submitTx(tx: CborHexString): Promise<HexString> {
    const res: string = await fetch(`${this.cabBackendUrl}/submitTx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({transactionCbor: tx}),
    }).then((res) => res.text())

    return res as HexString
  }
}
