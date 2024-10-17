import {aggregateTokenBundles} from '@wingriders/cab/ledger/assets'
import {BigNumber} from '@wingriders/cab/types'
import {useMemo} from 'react'
import type {WalletData} from '../../store/walletData'

export const useWalletValue = (walletData: WalletData | null) => {
  const value = useMemo(() => {
    if (!walletData) return undefined

    const {utxos} = walletData
    const tokenBundle = aggregateTokenBundles(
      utxos.map((utxo) => utxo.tokenBundle),
    )
    const coins =
      utxos.length > 0
        ? BigNumber.sum(...utxos.map((utxo) => utxo.coins))
        : new BigNumber(0)
    return {tokenBundle, coins}
  }, [walletData])

  return value
}
