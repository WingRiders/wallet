import {TxOutputDatumType} from '@wingriders/cab/dappConnector'
import {bechAddressToHex} from '@wingriders/cab/ledger/address'
import {tokenBundleToValue} from '@wingriders/cab/ledger/assets'
import {
  LANGUAGE_TO_TX_SCRIPT_TYPE,
  type Lovelace,
  type TokenBundle,
  type UTxO,
} from '@wingriders/cab/types'
import type {DecodedValue, Numerical} from '@wingriders/cab/wallet/connector'
import {Tagged, encode} from 'borc'
import {
  type Bytes,
  type DecodedScript,
  type DecodedUtxo,
  DecodedUtxoOutputTag,
} from './types'

export const utxoToDecodeUtxo = (utxo: UTxO): DecodedUtxo => {
  const decodedValue = valueToDecodedValue(utxo.coins, utxo.tokenBundle)

  const output: DecodedUtxo[1] = new Map()
  output.set(
    DecodedUtxoOutputTag.ADDRESS,
    Buffer.from(bechAddressToHex(utxo.address), 'hex').valueOf(),
  )
  output.set(DecodedUtxoOutputTag.VALUE, decodedValue)

  // datum hash
  if (utxo.datumHash)
    output.set(DecodedUtxoOutputTag.DATUM, [
      TxOutputDatumType.HASH,
      Buffer.from(utxo.datumHash, 'hex').valueOf(),
    ])
  // inline datum
  if (utxo.datum)
    output.set(DecodedUtxoOutputTag.DATUM, [
      TxOutputDatumType.INLINED_DATUM,
      new Tagged(24, encode(utxo.datum).valueOf(), null),
    ])

  // script reference
  if (utxo.inlineScript) {
    const decodedScript: DecodedScript = [
      LANGUAGE_TO_TX_SCRIPT_TYPE[utxo.inlineScript.language],
      utxo.inlineScript.bytes.valueOf(),
    ]

    output.set(
      DecodedUtxoOutputTag.SCRIPT,
      new Tagged(24, encode(decodedScript).valueOf(), null),
    )
  }

  return [[Buffer.from(utxo.txHash, 'hex').valueOf(), utxo.outputIndex], output]
}

export const valueToDecodedValue = (
  coins: Lovelace,
  tokenBundle: TokenBundle = [],
): DecodedValue => {
  if (tokenBundle.length === 0) return coins

  const value = tokenBundleToValue(tokenBundle)
  const bytesValue: Map<Bytes, Map<Bytes, Numerical>> = new Map(
    Object.entries(value).map(([policyId, assets]) => [
      Buffer.from(policyId, 'hex') as Bytes,
      new Map(
        Object.entries(assets).map(([assetName, quantity]) => [
          Buffer.from(assetName, 'hex'),
          quantity,
        ]),
      ),
    ]),
  )
  return [coins, bytesValue]
}
