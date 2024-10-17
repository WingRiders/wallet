import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {MessageHandler} from '../messages/MessageHandler'
import {useMessagesStore} from '../store/messages'

type RouterContext = {
  hasCreatedWallet: boolean
  isLogin: boolean
}

const Root = () => {
  const hasPendingMessage = useMessagesStore((s) => s.pendingMessage != null)

  return hasPendingMessage ? <MessageHandler /> : <Outlet />
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
})
