import type {HexString} from '@wingriders/cab/types'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type CreatedWallet = {
  encryptedMnemonic: HexString
  salt: HexString
  iv: HexString
}

export type CreatedWalletState = {
  createdWallet: CreatedWallet | null
  setCreatedWallet: (createdWallet: CreatedWallet | null) => void
}

export const useCreatedWalletStore = create<CreatedWalletState>()(
  persist(
    (set) => ({
      createdWallet: null,
      setCreatedWallet: (createdWallet) => set({createdWallet}),
    }),
    {
      name: 'created-wallet',
    },
  ),
)
