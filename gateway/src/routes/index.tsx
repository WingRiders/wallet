import {createFileRoute, redirect} from '@tanstack/react-router'
import {HomePage} from '../pages/home/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
  beforeLoad: ({context}) => {
    if (!context.hasCreatedWallet) {
      throw redirect({
        to: '/auth/create-wallet',
      })
    }
    if (!context.isLogin) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
})
