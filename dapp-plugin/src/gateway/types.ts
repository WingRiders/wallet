import type {
  Address,
  CborHexString,
  DataSignature,
} from '@wingriders/cab/dappConnector'
import type {NetworkName, TxInputRef} from '@wingriders/cab/types'

export type InitWalletGatewayResponse = {
  network: NetworkName
  usedAddresses: Address[]
  unusedAddresses: Address[]
  changeAddress: Address
  rewardAddresses: Address[]
  collateralUtxoRef: TxInputRef | null
}

/**
 * Models the API for the wallet gateway.
 */
export type IWalletGateway = {
  init(): Promise<InitWalletGatewayResponse>
  signTx(tx: CborHexString, partialSign?: boolean): Promise<CborHexString>
  signData(
    address: CborHexString,
    payload: CborHexString,
  ): Promise<DataSignature>
}
