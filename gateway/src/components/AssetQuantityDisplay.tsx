import type {Token} from '@wingriders/cab/types'
import {
  type FormatQuantityOptions,
  useFormatAssetQuantity,
} from '../helpers/formatQuantity'

type AssetQuantityDisplayProps = {
  token: Token
  options?: FormatQuantityOptions
  prefix?: string
}

export const AssetQuantityDisplay = ({
  token,
  options,
  prefix,
}: AssetQuantityDisplayProps) => {
  const formatQuantity = useFormatAssetQuantity(token)

  return (
    <span>
      {prefix}
      {formatQuantity(token.quantity, options)}
    </span>
  )
}
