import {aggregateTokenBundles} from '@wingriders/cab/ledger/assets'
import {BigNumber, type UTxO} from '@wingriders/cab/types'
import {useMemo} from 'react'

export const useWalletValue = (utxos: UTxO[] | null) => {
  const value = useMemo(() => {
    if (!utxos) return undefined

    const tokenBundle = aggregateTokenBundles(
      utxos.map((utxo) => utxo.tokenBundle),
    )
    const coins =
      utxos.length > 0
        ? BigNumber.sum(...utxos.map((utxo) => utxo.coins))
        : new BigNumber(0)
    return {tokenBundle, coins}
  }, [utxos])

  return value
}
