import type {Address as HexAddress, UInt} from '@wingriders/cab/dappConnector'
import {normalizeValue} from '@wingriders/cab/wallet/connector'
import {
  type Address,
  BigNumber,
  Language,
  Lovelace,
  NetworkName,
  type UTxO,
} from '@wingriders/cab/types'
import {
  aggregateTokenBundles,
  tokenBundleToValue,
} from '@wingriders/cab/ledger/assets'
import {CborizedTxDatum} from '@wingriders/cab/ledger/transaction'

export const MOCKED_WALLET_NAME = 'WingRiders'
export const MOCKED_WALLET_VERSION = '0.0.1'
export const MOCKED_WALLET_ICON = 'icon'

export const MOCKED_NETWORK = NetworkName.PREPROD
export const MOCKED_USED_ADDRESSES: HexAddress[] = [
  '00b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f996066569251',
] as HexAddress[]
export const MOCKED_UNUSED_ADDRESSES: HexAddress[] = []
export const MOCKED_CHANGE_ADDRESS =
  '00b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f996066569251' as HexAddress
export const MOCKED_REWARD_ADDRESSES: HexAddress[] = [
  '00b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f996066569251',
] as HexAddress[]

export const MOCKED_UTXOS: UTxO[] = [
  // ADA only UTxO
  {
    address:
      'addr_test1qz68clqv5g66rzqq8l0ru6jcx9q63yf97dr9w2ac06q6supfvmwlrkk0q3k4yjpn3yt5wy7zz23m2jfhp7vkqejkjfgsg0pq9r' as Address,
    coins: new Lovelace(10_000_000) as Lovelace,
    tokenBundle: [],
    outputIndex: 0,
    txHash: '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
    inlineDatum: false,
  },
  // UTxO with ADA and tokens
  {
    address:
      'addr_test1qz68clqv5g66rzqq8l0ru6jcx9q63yf97dr9w2ac06q6supfvmwlrkk0q3k4yjpn3yt5wy7zz23m2jfhp7vkqejkjfgsg0pq9r' as Address,
    coins: new Lovelace(100_000_000) as Lovelace,
    tokenBundle: [
      {
        policyId: 'ef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbe',
        assetName: '54657374546f6b656e',
        quantity: new BigNumber(10),
      },
    ],
    outputIndex: 0,
    txHash: '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
    inlineDatum: false,
  },
  // UTxO with datum hash
  {
    address:
      'addr_test1qz68clqv5g66rzqq8l0ru6jcx9q63yf97dr9w2ac06q6supfvmwlrkk0q3k4yjpn3yt5wy7zz23m2jfhp7vkqejkjfgsg0pq9r' as Address,
    coins: new Lovelace(100_000_000) as Lovelace,
    tokenBundle: [
      {
        policyId: 'ef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbe',
        assetName: '54657374546f6b656e',
        quantity: new BigNumber(10),
      },
    ],
    outputIndex: 0,
    txHash: '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
    datumHash:
      'd76459d562d179ed8432cbe42de394be9a816302a714a7ffa1778ff4ef393363',
    inlineDatum: false,
  },
  // UTxO with inline datum
  {
    address:
      'addr_test1qz68clqv5g66rzqq8l0ru6jcx9q63yf97dr9w2ac06q6supfvmwlrkk0q3k4yjpn3yt5wy7zz23m2jfhp7vkqejkjfgsg0pq9r' as Address,
    coins: new Lovelace(100_000_000) as Lovelace,
    tokenBundle: [
      {
        policyId: 'ef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbe',
        assetName: '54657374546f6b656e',
        quantity: new BigNumber(10),
      },
    ],
    outputIndex: 0,
    txHash: '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
    datum: CborizedTxDatum.decode(
      'd8799f1a001e8480d8799fd8799f581c9e02c456da51542f6d56d7903af9c06731262c9429e33790c63aa7f8ffd8799fd8799fd8799f581c8dc6894c71cffad508266f8170faa690610455bd12797aa4c9d22ecdffffffffd8799fd8799f581c9e02c456da51542f6d56d7903af9c06731262c9429e33790c63aa7f8ffd8799fd8799fd8799f581c8dc6894c71cffad508266f8170faa690610455bd12797aa4c9d22ecdffffffffd87980d879801b000001a2fbe592d14040581c659ab0b5658687c2e74cd10dba8244015b713bf503b90557769d77a74a57696e67526964657273d8799fd8798001ff0101ff',
    ),
    inlineDatum: true,
  },
  // UTxO with script reference
  {
    address:
      'addr_test1qz68clqv5g66rzqq8l0ru6jcx9q63yf97dr9w2ac06q6supfvmwlrkk0q3k4yjpn3yt5wy7zz23m2jfhp7vkqejkjfgsg0pq9r' as Address,
    coins: new Lovelace(100_000_000) as Lovelace,
    tokenBundle: [
      {
        policyId: 'ef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbe',
        assetName: '54657374546f6b656e',
        quantity: new BigNumber(10),
      },
    ],
    outputIndex: 0,
    txHash: '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
    inlineScript: {
      bytes: Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'),
      language: Language.PLUTUSV2,
    },
    inlineDatum: false,
  },
]
export const MOCKED_VALUE = normalizeValue<UInt>(
  tokenBundleToValue(
    aggregateTokenBundles(MOCKED_UTXOS.map((utxo) => utxo.tokenBundle)),
    BigNumber.sum(...MOCKED_UTXOS.map((utxo) => utxo.coins)) as Lovelace,
  ),
)
export const MOCKED_COLLATERAL_UTXOS: UTxO[] = [
  {
    address:
      'addr_test1qz68clqv5g66rzqq8l0ru6jcx9q63yf97dr9w2ac06q6supfvmwlrkk0q3k4yjpn3yt5wy7zz23m2jfhp7vkqejkjfgsg0pq9r' as Address,
    coins: new Lovelace(5_000_000) as Lovelace,
    tokenBundle: [],
    outputIndex: 1,
    txHash: '7fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a',
    inlineDatum: false,
  },
]
