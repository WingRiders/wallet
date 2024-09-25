import type {
  Asset,
  BigNumber,
  RegisteredTokenMetadata,
} from '@wingriders/cab/types'

import {useAssetMetadata} from '../metadata/helpers'
import {formatBigNumber} from './formatNumber'

export type FormatQuantityOptions = {
  showTicker?: boolean
  showSymbol?: boolean // show symbol if available
  extraDecimals?: number // additional decimals to show while formatting
  fixedDecimals?: true
  maxDecimals?: number
  useNonBreakingSpace?: boolean
}

export const getAssetQuantityFormatter = (
  metadata: RegisteredTokenMetadata,
) => {
  const ticker = metadata.ticker ?? metadata.name
  const symbol = metadata.symbol ?? ticker
  const decimals = metadata.decimals ?? 0

  return (
    quantity: BigNumber,
    {
      showTicker = true,
      showSymbol,
      extraDecimals = 0,
      useNonBreakingSpace,
      fixedDecimals,
      maxDecimals,
    }: FormatQuantityOptions = {},
  ) => {
    const realQuantity = quantity
      .shiftedBy(-decimals)
      .decimalPlaces(decimals + extraDecimals)
    const space = useNonBreakingSpace ? '\xa0' : ' '

    return `${formatBigNumber(realQuantity, {
      maxDecimals: maxDecimals ?? decimals + extraDecimals,
      fixedDecimals,
    })}${showTicker && ticker ? `${space}${ticker}` : ''}${
      showSymbol && symbol ? `${space}${symbol}` : ''
    }`
  }
}

export const useFormatAssetQuantity = (asset?: Asset | null) => {
  const metadata = useAssetMetadata(asset)

  return getAssetQuantityFormatter(metadata)
}
