import {describe, expect, test} from 'bun:test'
import {NETWORKS} from '@wingriders/cab/constants'
import {
  JsCryptoProvider,
  mnemonicToWalletSecretDef,
} from '@wingriders/cab/crypto'
import type {
  HexString as ApiHexString,
  Address as HexAddress,
} from '@wingriders/cab/dappConnector'
import {HARDENED_THRESHOLD} from '@wingriders/cab/ledger/address'
import {
  type BIP32Path,
  type HexString,
  NetworkName,
} from '@wingriders/cab/types'
import {signData} from '../../src/helpers/signData'

describe('sign data', () => {
  test('should correctly sign data', async () => {
    const mnemonic =
      'name upgrade digital resemble vocal swear salute lawn rail give taxi edge quality syrup salon'
    const address =
      '00a1519d8fe8fbd4cf7fae9c7c0dc532b253fc4c64cb0099b6d05e05be1a191e9f6fcdfa88fda4c398abb6811b10148b260321b6d7a7ee8f18' as HexAddress
    const addressPath: BIP32Path = [
      HARDENED_THRESHOLD + 1852,
      HARDENED_THRESHOLD + 1815,
      HARDENED_THRESHOLD + 0,
      0,
      0,
    ]
    const payload = Buffer.from('WingRiders', 'utf-8').toString(
      'hex',
    ) as HexString // 57696e67526964657273

    const cryptoProvider = new JsCryptoProvider({
      walletSecretDef: await mnemonicToWalletSecretDef(mnemonic),
      network: NETWORKS[NetworkName.PREPROD],
      config: {
        shouldExportPubKeyBulk: true,
      },
    })

    const signature = await signData(
      cryptoProvider,
      address,
      addressPath,
      payload,
    )

    expect(signature).toEqual({
      signature:
        '845846a201276761646472657373583900a1519d8fe8fbd4cf7fae9c7c0dc532b253fc4c64cb0099b6d05e05be1a191e9f6fcdfa88fda4c398abb6811b10148b260321b6d7a7ee8f18a166686173686564f44a57696e675269646572735840e55a0a9f0b84507e4b0295b80840cb19125a847063cf0359dd8992be427c45a4fbe7af3330220fffac0408bd7ef83a25e19f7a0b1fdc39bd4fb60a5a71bda90c' as ApiHexString,
      key: 'a4010103272006215820ea65844adbd0a02b60d51f86b286dad87b1dc5340769394749079094babfe281' as ApiHexString,
    })
  })
})
