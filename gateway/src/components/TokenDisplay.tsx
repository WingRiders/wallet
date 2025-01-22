import type {Token} from '@wingriders/cab/types'

import {useFormatAssetQuantity} from '../helpers/formatQuantity'
import {useAssetMetadata} from '../metadata/helpers'
import {AssetDisplay} from './AssetDisplay'

export type TokenDisplayProps = {
  token: Token
  useSymbol?: boolean
}

export const TokenDisplay = ({token, useSymbol}: TokenDisplayProps) => {
  const {ticker, name, logoBase64, logoUrl, symbol} = useAssetMetadata(token)
  const formatTokenQuantity = useFormatAssetQuantity(token)
  const formattedQuantity = formatTokenQuantity(token.quantity, {
    showTicker: false,
  })
  const label = (useSymbol && symbol) || ticker || name

  return (
    <AssetDisplay
      label={label}
      description={formattedQuantity}
      logoBase64={logoBase64}
      logoUrl={logoUrl}
    />
  )
}
