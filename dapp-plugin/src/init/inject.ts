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
import {WrWalletInitMode} from './types'

declare const window: typeof globalThis.window & {
  cardano?: {
    wrWallet?: StandardWalletApi
    [key: string]: unknown
  }
}

let cachedCborApi: CborAPI | null = null

type InjectCborApiOptions = {
  gateway: IWalletGateway
  name: string
  apiVersion: string
  icon: string
} & (
  | {
      mode: WrWalletInitMode.SINGLE_NETWORK
      network: NetworkName
      dataApi: IDataApi
    }
  | {
      mode: WrWalletInitMode.MULTI_NETWORK
      getDataApi: (network: NetworkName) => IDataApi
    }
)

export const injectCborApi = (args: InjectCborApiOptions) => {
  if (!window) throw new Error('No window object found')
  if (!window.cardano) window.cardano = {}

  const {name, apiVersion, icon} = args

  window.cardano.wrWallet = {
    name,
    apiVersion,
    icon,
    isEnabled: async () => cachedCborApi != null,
    enable: async () => {
      cachedCborApi ??= await createCborApi(args)
      return cachedCborApi
    },
  }
}

type CreateCborApiOptions = {
  gateway: IWalletGateway
} & (
  | {
      mode: WrWalletInitMode.SINGLE_NETWORK
      network: NetworkName
      dataApi: IDataApi
    }
  | {
      mode: WrWalletInitMode.MULTI_NETWORK
      getDataApi: (network: NetworkName) => IDataApi
    }
)

const createCborApi = async (args: CreateCborApiOptions): Promise<CborAPI> => {
  const {gateway} = args

  const {
    network,
    usedAddresses,
    unusedAddresses,
    changeAddress,
    rewardAddresses,
    collateralUtxoRef,
  } = await gateway.init()

  const dataApi = (() => {
    if (args.mode === WrWalletInitMode.SINGLE_NETWORK) {
      if (args.network !== network)
        throw new Error(
          `Network mismatch: wallet is on ${network} but expected ${args.network}`,
        )
      return args.dataApi
    }
    return args.getDataApi(network)
  })()
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
    async signData(address, payload) {
      return gateway.signData(address, payload)
    },
    async submitTx(tx) {
      return dataApi.submitTx(tx)
    },
    async getCollateral(_params) {
      if (!collateralUtxoRef) return null
      const utxos = await getUtxos()
      return utxos
        .filter(
          (utxo) =>
            utxo.txHash === collateralUtxoRef.txHash &&
            utxo.outputIndex === collateralUtxoRef.outputIndex,
        )
        .map(utxoToWalletCbor)
    },
  }
  return cborApi
}
