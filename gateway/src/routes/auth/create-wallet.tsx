import {createFileRoute} from '@tanstack/react-router'
import {CreateWalletPage} from '../../pages/auth/createWallet/CreateWalletPage'

export const Route = createFileRoute('/auth/create-wallet')({
  component: CreateWalletPage,
})
