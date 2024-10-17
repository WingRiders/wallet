import {create} from 'zustand'

export enum CreateWalletStage {
  MNEMONIC = 'MNEMONIC',
  PASSWORD = 'PASSWORD',
}

export type CreateWalletState = {
  currentStage: CreateWalletStage
  mnemonic?: string
  setCurrentStage: (stage: CreateWalletStage) => void
  setMnemonic: (mnemonic: string) => void
  reset: () => void
}

export const useCreateWalletStore = create<CreateWalletState>((set) => ({
  currentStage: CreateWalletStage.MNEMONIC,
  mnemonic: undefined,
  password: undefined,
  setCurrentStage: (currentStage) => set({currentStage}),
  setMnemonic: (mnemonic) => set({mnemonic}),
  reset: () =>
    set({
      currentStage: CreateWalletStage.MNEMONIC,
      mnemonic: undefined,
    }),
}))
