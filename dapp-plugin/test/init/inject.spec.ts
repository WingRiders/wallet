import {describe, expect, test} from 'bun:test'
import type {StandardWallet as StandardWalletApi} from '@wingriders/cab/dappConnector'
import {CborToJsApiBridge, reverseUtxos} from '@wingriders/cab/wallet/connector'

import {injectCborApi} from '../../src/init/inject'

import {NETWORK_NAME_TO_API_NETWORK_ID} from '../../src/constants'
import {MOCKED_DATA_API, MOCKED_WALLET_GATEWAY} from '../mocks/apis'
import {
  MOCKED_CHANGE_ADDRESS,
  MOCKED_COLLATERAL_UTXO_REF,
  MOCKED_NETWORK,
  MOCKED_REWARD_ADDRESSES,
  MOCKED_UNUSED_ADDRESSES,
  MOCKED_USED_ADDRESSES,
  MOCKED_UTXOS,
  MOCKED_VALUE,
  MOCKED_WALLET_ICON,
  MOCKED_WALLET_NAME,
  MOCKED_WALLET_VERSION,
} from '../mocks/values'

declare const window: typeof globalThis.window & {
  cardano?: {
    wrWallet?: StandardWalletApi
    [key: string]: unknown
  }
}

describe('inject', () => {
  test('injected CBOR API returns correct data', async () => {
    injectCborApi({
      gateway: MOCKED_WALLET_GATEWAY,
      getDataApi: () => MOCKED_DATA_API,
      name: MOCKED_WALLET_NAME,
      apiVersion: MOCKED_WALLET_VERSION,
      icon: MOCKED_WALLET_ICON,
    })

    const wrtWallet = window.cardano?.wrWallet!
    expect(wrtWallet).toBeDefined()

    const cborApi = await wrtWallet.enable()
    const jsApi = new CborToJsApiBridge(cborApi)

    const networkId = await jsApi.getNetworkId()
    const usedAddresses = await jsApi.getUsedAddresses()
    const unusedAddresses = await jsApi.getUnusedAddresses()
    const changeAddress = await jsApi.getChangeAddress()
    const rewardAddresses = await jsApi.getRewardAddresses()
    const utxos = reverseUtxos(await jsApi.getUtxos({withoutCollateral: true}))
    const balance = await jsApi.getBalance()
    const collateralUtxos = reverseUtxos(await jsApi.getCollateral())

    expect(wrtWallet.name).toEqual(MOCKED_WALLET_NAME)
    expect(wrtWallet.apiVersion).toEqual(MOCKED_WALLET_VERSION)
    expect(wrtWallet.icon).toEqual(MOCKED_WALLET_ICON)
    expect(networkId).toEqual(NETWORK_NAME_TO_API_NETWORK_ID[MOCKED_NETWORK])
    expect(usedAddresses).toEqual(MOCKED_USED_ADDRESSES)
    expect(unusedAddresses).toEqual(MOCKED_UNUSED_ADDRESSES)
    expect(changeAddress).toEqual(MOCKED_CHANGE_ADDRESS)
    expect(rewardAddresses).toEqual(MOCKED_REWARD_ADDRESSES)
    expect(utxos).toEqual(MOCKED_UTXOS)
    expect(balance).toEqual(MOCKED_VALUE)
    expect(collateralUtxos).toEqual([
      MOCKED_UTXOS.find(
        (utxo) =>
          utxo.txHash === MOCKED_COLLATERAL_UTXO_REF.txHash &&
          utxo.outputIndex === MOCKED_COLLATERAL_UTXO_REF.outputIndex,
      )!,
    ])
  })
})
