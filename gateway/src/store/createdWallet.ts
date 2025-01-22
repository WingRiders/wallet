import {type HexString, NetworkName} from '@wingriders/cab/types'
import {uniq} from 'lodash'
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
  allowedOrigins: string[]
  setCreatedWallet: (createdWallet: CreatedWallet) => void
  clearCreatedWallet: () => void
  setNetwork: (network: NetworkName) => void
  addAllowedOrigin: (origin: string) => void
  removeAllowedOrigin: (origin: string) => void
}

export const useCreatedWalletStore = create<CreatedWalletState>()(
  persist(
    (set) => ({
      createdWallet: null,
      network: NetworkName.MAINNET,
      allowedOrigins: [],
      setCreatedWallet: (createdWallet) => set({createdWallet}),
      clearCreatedWallet: () => set({createdWallet: null, allowedOrigins: []}),
      setNetwork: (network) => set({network}),
      addAllowedOrigin: (origin) =>
        set((state) => ({
          allowedOrigins: uniq([...state.allowedOrigins, origin]),
        })),
      removeAllowedOrigin: (origin) =>
        set((state) => ({
          allowedOrigins: state.allowedOrigins.filter((o) => o !== origin),
        })),
    }),
    {
      name: 'created-wallet',
    },
  ),
)
