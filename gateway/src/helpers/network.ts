import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import {config} from '../config'
import {useCreatedWalletStore} from '../store/createdWallet'

/**
 * Syncs the network from the config with the store.
 */
export const useSyncConfigAndStoreNetwork = () => {
  const {network: storeNetwork, setNetwork: setStoreNetwork} =
    useCreatedWalletStore(
      useShallow(({network, setNetwork}) => ({network, setNetwork})),
    )
  const configNetwork = config.NETWORK

  useEffect(() => {
    if (configNetwork && storeNetwork !== configNetwork) {
      setStoreNetwork(configNetwork)
    }
  }, [configNetwork, setStoreNetwork, storeNetwork])
}
