import type {Address, TxInputRef, UTxO} from '@wingriders/cab/types'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type WalletAddresses = {
  usedAddresses: Address[]
  unusedAddresses: Address[]
  changeAddress: Address
  rewardAddresses: Address[]
}

export type WalletDataState = {
  addresses: WalletAddresses | null
  utxos: UTxO[] | null
  collateral: TxInputRef | null
  setWalletData: (
    walletData: Partial<
      Pick<WalletDataState, 'addresses' | 'utxos' | 'collateral'>
    >,
  ) => void
  logOut: () => void
  clear: () => void
}

export const useWalletDataStore = create<WalletDataState>()(
  persist(
    (set) => ({
      addresses: null,
      utxos: null,
      collateral: null,
      setWalletData: (walletData) => set(walletData),
      logOut: () => set({utxos: null}),
      clear: () => set({addresses: null, utxos: null, collateral: null}),
    }),
    {
      name: 'wallet-data',
      partialize: (state) => ({
        collateral: state.collateral,
        addresses: state.addresses,
      }),
    },
  ),
)

export const selectIsLogin = (state: WalletDataState) => state.utxos != null
