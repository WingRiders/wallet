import {RouterProvider, createRouter} from '@tanstack/react-router'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {routeTree} from './routeTree.gen'

import './index.css'
import {CssBaseline, ThemeProvider} from '@mui/material'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {AppBackground} from './components/AppBackground'
import {ApolloProvider} from './graphql/ApolloProvider'
import {useSyncConfigAndStoreNetwork} from './helpers/network'
import {MessageListener} from './messages/MessageListener'
import {useCreatedWalletStore} from './store/createdWallet'
import {selectIsLogin, useWalletDataStore} from './store/walletData'
import {theme} from './theme'

const router = createRouter({
  routeTree,
  context: {hasCreatedWallet: false, isLogin: false},
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const RouterWithContext = () => {
  useSyncConfigAndStoreNetwork()
  const hasCreatedWallet = useCreatedWalletStore((s) => s.createdWallet != null)
  const isLogin = useWalletDataStore(selectIsLogin)

  return (
    <RouterProvider
      router={router}
      context={{
        hasCreatedWallet,
        isLogin,
      }}
    />
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
    },
  },
})

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <ApolloProvider>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <MessageListener>
              <AppBackground />
              <RouterWithContext />
            </MessageListener>
          </QueryClientProvider>
        </ApolloProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}
