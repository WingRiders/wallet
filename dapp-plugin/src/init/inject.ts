import type {
  CborAPI,
  StandardWallet as StandardWalletApi,
} from '@wingriders/cab/dappConnector'
import {aggregateTokenBundles} from '@wingriders/cab/ledger/assets'
import {BigNumber, type Lovelace, type NetworkName} from '@wingriders/cab/types'
import {NETWORK_NAME_TO_API_NETWORK_ID} from '../constants'
import type {IDataApi} from '../dataApi/types'
import type {IWalletGateway} from '../gateway/types'
import {
  hexAddressToBechAddress,
  hexAddressToWalletCbor,
  txValueToWalletCbor,
  utxoToWalletCbor,
} from '../helpers/converters'

declare const window: typeof globalThis.window & {
  cardano?: {
    wrWallet?: StandardWalletApi
    [key: string]: unknown
  }
}

const cachedCborApi: CborAPI | null = null

type InjectCborApiOptions = {
  gateway: IWalletGateway
  getDataApi: (network: NetworkName) => IDataApi
  name: string
  apiVersion: string
  icon: string
}

export const injectCborApi = ({
  gateway,
  getDataApi,
  name,
  apiVersion,
  icon,
}: InjectCborApiOptions) => {
  if (!window) throw new Error('No window object found')
  if (!window.cardano) window.cardano = {}

  window.cardano.wrWallet = {
    name,
    apiVersion,
    icon,
    isEnabled: async () => cachedCborApi != null,
    enable: async () => cachedCborApi ?? createCborApi({gateway, getDataApi}),
  }
}

type CreateCborApiOptions = {
  gateway: IWalletGateway
  getDataApi: (network: NetworkName) => IDataApi
}

const createCborApi = async ({
  gateway,
  getDataApi,
}: CreateCborApiOptions): Promise<CborAPI> => {
  const {
    network,
    usedAddresses,
    unusedAddresses,
    changeAddress,
    rewardAddresses,
    collateralUtxos,
  } = await gateway.init()

  const dataApi = getDataApi(network)
  const networkId = NETWORK_NAME_TO_API_NETWORK_ID[network]
  const usedBechAddresses = usedAddresses.map(hexAddressToBechAddress(network))
  const getUtxos = () => dataApi.getUtxos(usedBechAddresses)

  const cborApi: CborAPI = {
    async getNetworkId() {
      return networkId
    },
    async getUtxos(_amount, _paginate) {
      const utxos = await getUtxos()
      return utxos.map(utxoToWalletCbor)
    },
    async getBalance() {
      const utxos = await getUtxos()
      const tokenBundle = aggregateTokenBundles(
        utxos.map((utxo) => utxo.tokenBundle),
      )
      const coins =
        utxos.length === 0
          ? new BigNumber(0)
          : BigNumber.sum(...utxos.map((utxo) => utxo.coins))

      return txValueToWalletCbor(coins as Lovelace, tokenBundle)
    },
    async getUsedAddresses() {
      return usedAddresses.map(hexAddressToWalletCbor)
    },
    async getUnusedAddresses() {
      return unusedAddresses.map(hexAddressToWalletCbor)
    },
    async getChangeAddress() {
      return hexAddressToWalletCbor(changeAddress)
    },
    async getRewardAddresses() {
      return rewardAddresses.map(hexAddressToWalletCbor)
    },
    async signTx(tx, partialSign) {
      return gateway.signTx(tx, partialSign)
    },
    async signData(addr, sigStructure) {
      return gateway.signData(addr, sigStructure)
    },
    async submitTx(tx) {
      return dataApi.submitTx(tx)
    },
    async getCollateral(_params) {
      return collateralUtxos.map(utxoToWalletCbor)
    },
  }
  return cborApi
}
