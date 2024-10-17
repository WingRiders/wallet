import {create} from 'zustand'

export enum CreateWalletOption {
  CREATE = 'CREATE',
  IMPORT = 'IMPORT',
}

export enum CreateWalletStage {
  CHOOSE_OPTION = 'CHOOSE_OPTION',
  MNEMONIC = 'MNEMONIC',
  PASSWORD = 'PASSWORD',
}

export type CreateWalletState = {
  currentStage: CreateWalletStage
  setCurrentStage: (stage: CreateWalletStage) => void

  option?: CreateWalletOption
  startFlow: (option: CreateWalletOption) => void

  mnemonic?: string
  submitMnemonic: (mnemonic: string) => void

  reset: () => void
}

export const useCreateWalletStore = create<CreateWalletState>((set) => ({
  currentStage: CreateWalletStage.CHOOSE_OPTION,
  setCurrentStage: (currentStage) => set({currentStage}),

  option: undefined,
  startFlow: (option) =>
    set({
      option,
      mnemonic: undefined,
      currentStage: CreateWalletStage.MNEMONIC,
    }),

  mnemonic: undefined,
  submitMnemonic: (mnemonic) =>
    set({mnemonic, currentStage: CreateWalletStage.PASSWORD}),

  reset: () =>
    set({
      currentStage: CreateWalletStage.CHOOSE_OPTION,
      option: undefined,
      mnemonic: undefined,
    }),
}))
