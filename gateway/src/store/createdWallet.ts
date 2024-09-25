import {type HexString, NetworkName} from '@wingriders/cab/types'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type CreatedWallet = {
  encryptedMnemonic: HexString
  salt: HexString
  iv: HexString
}

export type CreatedWalletState = {
  createdWallet: CreatedWallet | null
  network: NetworkName
  setCreatedWallet: (createdWallet: CreatedWallet | null) => void
  setNetwork: (network: NetworkName) => void
}

export const useCreatedWalletStore = create<CreatedWalletState>()(
  persist(
    (set) => ({
      createdWallet: null,
      network: NetworkName.MAINNET,
      setCreatedWallet: (createdWallet) => set({createdWallet}),
      setNetwork: (network) => set({network}),
    }),
    {
      name: 'created-wallet',
    },
  ),
)
