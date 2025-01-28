import {ApolloProvider as DefaultApolloProvider} from '@apollo/client'

import {type ReactNode, useMemo} from 'react'
import {useCreatedWalletStore} from '../store/createdWallet'
import {createClient} from './client'

type ApolloProviderProps = {
  children?: ReactNode
}

export const ApolloProvider = ({children}: ApolloProviderProps) => {
  const network = useCreatedWalletStore((s) => s.network)

  const client = useMemo(() => createClient(network), [network])

  return (
    <DefaultApolloProvider client={client}>{children}</DefaultApolloProvider>
  )
}
