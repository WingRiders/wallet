import {ApolloClient, InMemoryCache} from '@apollo/client'

const cache = new InMemoryCache()

export const client = new ApolloClient({
  uri: 'https://api.preprod.staging.wingriders.com/graphql',
  cache,
})
