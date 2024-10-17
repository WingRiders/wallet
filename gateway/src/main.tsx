import {RouterProvider, createRouter} from '@tanstack/react-router'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {routeTree} from './routeTree.gen'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import {ApolloProvider} from '@apollo/client'
import {CssBaseline, ThemeProvider} from '@mui/material'
import {client} from './graphql/client'
import {useCreatedWalletStore} from './store/createdWallet'
import {useWalletDataStore} from './store/walletData'
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
  const hasCreatedWallet = useCreatedWalletStore((s) => s.createdWallet != null)
  const isLogin = useWalletDataStore((s) => s.walletData != null)

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
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <RouterWithContext />
        </ApolloProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}
