import type {Account} from '@wingriders/cab/account'
import {BlockchainExplorer} from '@wingriders/cab/blockchainExplorer'
import {NETWORKS} from '@wingriders/cab/constants'
import {
  JsCryptoProvider,
  mnemonicToWalletSecretDef,
} from '@wingriders/cab/crypto'
import type {NetworkName} from '@wingriders/cab/types'
import {Wallet} from '@wingriders/cab/wallet'
import type {WalletData} from '../store/walletData'

type InitWalletProps = {
  mnemonic: string
  network: NetworkName
}

export const initWallet = async ({mnemonic, network}: InitWalletProps) => {
  const wallet = new Wallet({
    blockchainExplorer: new BlockchainExplorer({
      baseUrl: 'https://explorer.preprod.staging.wingriders.com',
    }),
    cryptoProvider: new JsCryptoProvider({
      walletSecretDef: await mnemonicToWalletSecretDef(mnemonic),
      network: NETWORKS[network],
      config: {
        shouldExportPubKeyBulk: true,
      },
    }),
    config: {
      shouldExportPubKeyBulk: true,
      gapLimit: 10,
    },
  })
  await wallet.getAccountManager().addAccounts([0])
  const account = wallet.getAccount(0)

  return {wallet, account}
}

export const getWalletData = (account: Account): WalletData => {
  const accountInfo = account.getAccountInfo()
  const usedAddresses = accountInfo.usedAddresses.map((a) => a.address)
  const unusedAddresses = accountInfo.unusedAddresses.map((a) => a.address)
  const changeAddress = account.getChangeAddress()
  const rewardAddresses = [account.getStakingAddress()]
  const utxos = account.getUtxos()

  return {
    usedAddresses,
    unusedAddresses,
    changeAddress,
    rewardAddresses,
    utxos,
  }
}