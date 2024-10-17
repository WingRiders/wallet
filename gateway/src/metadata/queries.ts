import {graphql} from '../graphql/generated'

export const tokenMetadataFieldsFragment = graphql(/* GraphQL */ `
  fragment TokenMetadataFields on TokenMetadata {
    asset {
      assetName
      policyId
    }
    name
    description
    logoUrl
    decimals
    ticker
  }
`)

export const assetsMetadataQuery = graphql(/* GraphQL */ `
  query AssetsMetadata($assets: [AssetInput!]!) {
    tokensMetadata(assets: $assets) {
      ...TokenMetadataFields
    }
  }
`)
