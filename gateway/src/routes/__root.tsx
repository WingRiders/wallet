import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {MessageHandler} from '../messages/MessageHandler'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useMessagesStore} from '../store/messages'

type RouterContext = {
  hasCreatedWallet: boolean
  isLogin: boolean
}

const Root = () => {
  const hasCreatedWallet = useCreatedWalletStore((s) => s.createdWallet != null)
  const hasPendingMessage = useMessagesStore((s) => s.pendingMessage != null)

  return hasPendingMessage && hasCreatedWallet ? <MessageHandler /> : <Outlet />
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
})
