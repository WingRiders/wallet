import type {
  CborHexString,
  Address as HexAddress,
} from '@wingriders/cab/dappConnector'
import {networkNameToNetworkId} from '@wingriders/cab/helpers'
import {Address, addressToBechAddress} from '@wingriders/cab/ledger/plutus'
import type {
  Address as BechAddress,
  Lovelace,
  NetworkName,
  TokenBundle,
  UTxO,
} from '@wingriders/cab/types'
import {encode} from 'borc'
import {utxoToDecodeUtxo, valueToDecodedValue} from '../walletCborApi/parsers'

export const utxoToWalletCbor = (utxo: UTxO): CborHexString =>
  encode(utxoToDecodeUtxo(utxo)).toString('hex') as CborHexString

export const hexAddressToWalletCbor = (addresses: HexAddress): CborHexString =>
  addresses as string as CborHexString

export const txValueToWalletCbor = (
  coins: Lovelace,
  tokenBundle?: TokenBundle,
): CborHexString =>
  encode(valueToDecodedValue(coins as Lovelace, tokenBundle)).toString(
    'hex',
  ) as CborHexString

export const hexAddressToBechAddress =
  (network: NetworkName) =>
  (address: HexAddress): BechAddress =>
    addressToBechAddress(
      Address.fromAddressHex(address),
      networkNameToNetworkId[network],
    )
