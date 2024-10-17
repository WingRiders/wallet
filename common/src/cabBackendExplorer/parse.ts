import type {Utxo as OgmiosUTxO} from '@cardano-ogmios/schema'
import {
  type Address,
  BigNumber,
  Language,
  Lovelace,
  type UTxO,
} from '@wingriders/cab/types'
import type {Convert} from '../types'

export type UTxOResponse = Convert<
  bigint,
  number | BigNumber,
  OgmiosUTxO[number]
>

export const parseUTxOResponse = (utxo: UTxOResponse): UTxO => ({
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
