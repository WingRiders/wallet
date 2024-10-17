import {createTokenRegistrySubject} from '@wingriders/cab/blockchainExplorer'
import {decodeAssetName, isAda} from '@wingriders/cab/helpers'
import type {Asset} from '@wingriders/cab/types'
import {useCallback} from 'react'
import {ADA_METADATA, EMPTY_METADATA} from './constants'
import {useTokensMetadataVar} from './reactiveVars'
import type {TokenMetadata} from './types'

export const getDefaultMetadata = (asset: Asset): TokenMetadata => ({
  description: '',
  name: decodeAssetName(asset),
  ticker: decodeAssetName(asset).slice(0, 8),
  subject: createTokenRegistrySubject(asset.policyId, asset.assetName),
})

export const useAssetMetadataGetter = () => {
  const metadata = useTokensMetadataVar()

  return useCallback(
    (asset: Asset) =>
      isAda(asset)
        ? ADA_METADATA
        : metadata[
            createTokenRegistrySubject(asset.policyId, asset.assetName)
          ] || getDefaultMetadata(asset),
    [metadata],
  )
}

export const useAssetMetadata = (asset?: Asset | null): TokenMetadata => {
  const getMetadataForAsset = useAssetMetadataGetter()

  return asset != null ? getMetadataForAsset(asset) : EMPTY_METADATA
}
