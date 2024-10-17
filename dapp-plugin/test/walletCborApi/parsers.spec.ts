import {describe, expect, test} from 'bun:test'
import type {Lovelace, TokenBundle, UTxO} from '@wingriders/cab/types'
import {encode} from 'borc'
import {
  utxoToDecodedUtxo,
  valueToDecodedValue,
} from '../../src/walletCborApi/parsers'
import {MOCKED_UTXOS} from '../mocks/values'

describe('walletCborApi parsers', () => {
  describe('utxoToDecodedUtxo', () => {
    const testCases: {utxo: UTxO; expectedEncodedCborHex: string}[] = [
      {
        utxo: MOCKED_UTXOS[0],
        expectedEncodedCborHex:
          '828258207fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a00a200583900b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f99606656925101c243989680',
      },
      {
        utxo: MOCKED_UTXOS[1],
        expectedEncodedCborHex:
          '828258207fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a00a200583900b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f9960665692510182c24405f5e100a1581cef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbea14954657374546f6b656ec2410a',
      },
      {
        utxo: MOCKED_UTXOS[2],
        expectedEncodedCborHex:
          '828258207fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a00a300583900b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f9960665692510182c24405f5e100a1581cef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbea14954657374546f6b656ec2410a0282005820d76459d562d179ed8432cbe42de394be9a816302a714a7ffa1778ff4ef393363',
      },
      {
        utxo: MOCKED_UTXOS[3],
        expectedEncodedCborHex:
          '828258207fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a00a300583900b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f9960665692510182c24405f5e100a1581cef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbea14954657374546f6b656ec2410a028201d81859021ca361690064646174618d1a001e8480a3616900646461746182a3616900646461746181581c9e02c456da51542f6d56d7903af9c06731262c9429e33790c63aa7f86c5f5f74797065436f6e737472f5a3616900646461746181a3616900646461746181a3616900646461746181581c8dc6894c71cffad508266f8170faa690610455bd12797aa4c9d22ecd6c5f5f74797065436f6e737472f56c5f5f74797065436f6e737472f56c5f5f74797065436f6e737472f56c5f5f74797065436f6e737472f5a3616900646461746182a3616900646461746181581c9e02c456da51542f6d56d7903af9c06731262c9429e33790c63aa7f86c5f5f74797065436f6e737472f5a3616900646461746181a3616900646461746181a3616900646461746181581c8dc6894c71cffad508266f8170faa690610455bd12797aa4c9d22ecd6c5f5f74797065436f6e737472f56c5f5f74797065436f6e737472f56c5f5f74797065436f6e737472f56c5f5f74797065436f6e737472f5a36169006464617461806c5f5f74797065436f6e737472f5a36169006464617461806c5f5f74797065436f6e737472f51b000001a2fbe592d14040581c659ab0b5658687c2e74cd10dba8244015b713bf503b90557769d77a74a57696e67526964657273a3616900646461746182a36169006464617461806c5f5f74797065436f6e737472f5016c5f5f74797065436f6e737472f501016c5f5f74797065436f6e737472f5',
      },
      {
        utxo: MOCKED_UTXOS[4],
        expectedEncodedCborHex:
          '828258207fe4542778158ad7a9a3ca9824461a30324a22160b63aaa578ec8754fa18cb5a00a300583900b47c7c0ca235a188003fde3e6a583141a89125f346572bb87e81a8702966ddf1dacf046d52483389174713c212a3b549370f9960665692510182c24405f5e100a1581cef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbea14954657374546f6b656ec2410a03d81853820250000102030405060708090a0b0c0d0e0f',
      },
    ]

    test.each(testCases)(
      'should parse UTxO to decoded UTxO #%#',
      async ({utxo, expectedEncodedCborHex}) => {
        expect(encode(utxoToDecodedUtxo(utxo)).toString('hex')).toEqual(
          expectedEncodedCborHex,
        )
      },
    )
  })

  describe('valueToDecodedValue', () => {
    const testCases: {
      utxo: {coins: Lovelace; tokenBundle: TokenBundle}
      expectedEncodedCborHex: string
    }[] = [
      {
        utxo: MOCKED_UTXOS[0],
        expectedEncodedCborHex: 'c243989680',
      },
      {
        utxo: MOCKED_UTXOS[1],
        expectedEncodedCborHex:
          '82c24405f5e100a1581cef7a1cebb2dc7de884ddf82f8fcbc91fe9750dcd8c12ec7643a99bbea14954657374546f6b656ec2410a',
      },
    ]

    test.each(testCases)(
      'should parse value to decoded value #%#',
      async ({utxo: {coins, tokenBundle}, expectedEncodedCborHex}) => {
        expect(
          encode(valueToDecodedValue(coins, tokenBundle)).toString('hex'),
        ).toEqual(expectedEncodedCborHex)
      },
    )
  })
})
