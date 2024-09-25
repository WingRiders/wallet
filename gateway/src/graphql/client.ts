import {ApolloClient, InMemoryCache} from '@apollo/client'
import {config} from '../config'
import {parseGqlTokenMetadata} from '../metadata/parse'
import {updateTokensMetadataVar} from '../metadata/reactiveVars'
import type {TokenMetadata} from './generated/graphql'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        tokensMetadata: {
          merge: (_, incoming: any[], {readField}) => {
            // If cache keys become problematically large, set keyArgs to false and always merge incoming
            // with existing to keep it all in one cache entry.
            const incomingMetadata = incoming.map(
              (ref): TokenMetadata => ({
                asset: readField('asset', ref)!,
                name: readField('name', ref)!,
                description: readField('description', ref)!,
                logoUrl: readField('logoUrl', ref),
                decimals: readField('decimals', ref),
                ticker: readField('ticker', ref),
                url: readField('url', ref),
              }),
            )
            updateTokensMetadataVar(parseGqlTokenMetadata(incomingMetadata))
            return incoming
          },
        },
      },
    },
  },
})

export const client = new ApolloClient({
  uri: `${config.API_SERVER_URL_PREPROD}/graphql`,
  cache,
})
