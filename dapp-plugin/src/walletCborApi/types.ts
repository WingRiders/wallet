import type {
  TxOutputDatumType,
  TxScriptType,
} from '@wingriders/cab/dappConnector'
import type {DecodedValue, Numerical} from '@wingriders/cab/wallet/connector'
import type {Tagged} from 'borc'

/* either hash or inline */
export type DatumOption =
  | [type: TxOutputDatumType.HASH, hash: Uint8Array]
  | [type: TxOutputDatumType.INLINED_DATUM, datum: Tagged<Uint8Array>]

export type ScriptRef = Tagged<Uint8Array> // encoded DecodedScript

export type DecodedScript = [type: TxScriptType, bytes: Uint8Array]

export type Bytes = Buffer | Uint8Array

export enum DecodedUtxoOutputTag {
  ADDRESS = 0,
  VALUE = 1,
  DATUM = 2,
  SCRIPT = 3,
}

export type DecodedUtxo = [
  input: [txHash: Uint8Array, index: Numerical],
  output:
    | [address: Uint8Array, value: DecodedValue, datumHash?: Uint8Array]
    | Map<
        DecodedUtxoOutputTag,
        Uint8Array | DecodedValue | DatumOption | ScriptRef
      >,
]
