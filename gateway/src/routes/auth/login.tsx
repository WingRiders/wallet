import {createFileRoute, redirect} from '@tanstack/react-router'
import {LoginPage} from '../../pages/auth/LoginPage'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  beforeLoad: ({context}) => {
    if (!context.hasCreatedWallet) {
      throw redirect({
        to: '/auth/create-wallet',
      })
    }
  },
})
