import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'

type RouterContext = {
  hasCreatedWallet: boolean
  isLogin: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
})
