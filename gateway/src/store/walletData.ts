import type {Address, UTxO} from '@wingriders/cab/types'
import {create} from 'zustand'

export type WalletData = {
  usedAddresses: Address[]
  unusedAddresses: Address[]
  changeAddress: Address
  rewardAddresses: Address[]
  utxos: UTxO[]
}

export type WalletDataState = {
  walletData: WalletData | null
  setWalletData: (walletData: WalletData | null) => void
}

export const useWalletDataStore = create<WalletDataState>((set) => ({
  walletData: null,
  setWalletData: (walletData) => set({walletData}),
}))
