import {createTokenRegistrySubject} from '@wingriders/cab/blockchainExplorer'
import type {RegisteredTokenMetadata} from '@wingriders/cab/types'
import type {TokenMetadataFieldsFragment} from '../graphql/generated/graphql'

export const parseGqlTokenMetadata = (
  fragments: readonly TokenMetadataFieldsFragment[],
): RegisteredTokenMetadata[] =>
  fragments.map(({asset, ...metadata}) => {
    const subject = createTokenRegistrySubject(asset.policyId, asset.assetName)
    return {
      ...metadata,
      subject,
      ticker: metadata.ticker ?? undefined,
      logoUrl: metadata.logoUrl ?? undefined,
      decimals: metadata.decimals ?? undefined,
    }
  })
