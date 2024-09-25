import {makeVar, useReactiveVar} from '@apollo/client'
import type {RegisteredTokenMetadata} from '@wingriders/cab/types'

export const tokensMetadataVar = makeVar<
  Record<string, RegisteredTokenMetadata>
>({})

export const useTokensMetadataVar = () => useReactiveVar(tokensMetadataVar)

export const updateTokensMetadataVar = (
  newMetadata: RegisteredTokenMetadata[],
) => {
  tokensMetadataVar({
    ...tokensMetadataVar(),
    ...Object.fromEntries(newMetadata.map((meta) => [meta.subject, meta])),
  })
}
