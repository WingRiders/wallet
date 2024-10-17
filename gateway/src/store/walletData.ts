import type {Address, TxInputRef, UTxO} from '@wingriders/cab/types'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type WalletData = {
  usedAddresses: Address[]
  unusedAddresses: Address[]
  changeAddress: Address
  rewardAddresses: Address[]
  utxos: UTxO[]
}

export type WalletDataState = {
  walletData: WalletData | null
  collateral: TxInputRef | null
  setWalletData: (walletData: WalletData | null) => void
  setCollateral: (collateral: TxInputRef | null) => void
  clear: () => void
}

export const useWalletDataStore = create<WalletDataState>()(
  persist(
    (set) => ({
      walletData: null,
      collateral: null,
      setWalletData: (walletData) => set({walletData}),
      setCollateral: (collateral) => set({collateral}),
      clear: () => set({walletData: null, collateral: null}),
    }),
    {
      name: 'wallet-data',
      partialize: (state) => ({
        collateral: state.collateral,
      }),
    },
  ),
)
