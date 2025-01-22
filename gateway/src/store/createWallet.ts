import {create} from 'zustand'

export enum CreateWalletOption {
  CREATE = 'CREATE',
  IMPORT = 'IMPORT',
}

export enum CreateWalletStage {
  CHOOSE_OPTION = 'CHOOSE_OPTION',
  MNEMONIC = 'MNEMONIC',
  CONFIRM_GENERATED_MNEMONIC = 'CONFIRM_GENERATED_MNEMONIC',
  PASSWORD = 'PASSWORD',
}

export type CreateWalletState = {
  currentStage: CreateWalletStage
  setCurrentStage: (stage: CreateWalletStage) => void

  option?: CreateWalletOption
  startFlow: (option: CreateWalletOption) => void

  mnemonic?: string
  submitMnemonic: (mnemonic: string, needsConfirm: boolean) => void
  confirmMnemonic: () => void

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
  submitMnemonic: (mnemonic, needsConfirm) =>
    set({
      mnemonic,
      currentStage: needsConfirm
        ? CreateWalletStage.CONFIRM_GENERATED_MNEMONIC
        : CreateWalletStage.PASSWORD,
    }),
  confirmMnemonic: () => set({currentStage: CreateWalletStage.PASSWORD}),

  reset: () =>
    set({
      currentStage: CreateWalletStage.CHOOSE_OPTION,
      option: undefined,
      mnemonic: undefined,
    }),
}))
