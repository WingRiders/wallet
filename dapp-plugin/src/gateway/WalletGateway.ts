import type {CborHexString, DataSignature} from '@wingriders/cab/dappConnector'
import {MessageType} from '@wingriders/wallet-common'
import {nanoid} from 'nanoid'
import {sendGatewayMessageAndWaitForResponse} from '../messages/send'
import type {IWalletGateway} from './types'

type WalletGatewayOptions = {
  url: string
}

export class WalletGateway implements IWalletGateway {
  private url: string

  constructor({url}: WalletGatewayOptions) {
    this.url = url
  }

  async init() {
    const initResponse = await sendGatewayMessageAndWaitForResponse(
      this.url,
      {
        type: MessageType.INIT_REQUEST,
        initId: nanoid(),
      },
      MessageType.INIT_RESPONSE,
    )
    if (!initResponse.result.isSuccess) throw initResponse.result.error

    const {
      network,
      usedAddresses,
      unusedAddresses,
      changeAddress,
      rewardAddresses,
      collateralUtxoRef,
    } = initResponse.result.data
    return {
      network,
      usedAddresses,
      unusedAddresses,
      changeAddress,
      rewardAddresses,
      collateralUtxoRef,
    }
  }

  async signTx(
    tx: CborHexString,
    partialSign?: boolean,
  ): Promise<CborHexString> {
    const signTxResponse = await sendGatewayMessageAndWaitForResponse(
      this.url,
      {
        type: MessageType.SIGN_TX_REQUEST,
        initId: nanoid(),
        payload: {
          tx,
          partialSign,
        },
      },
      MessageType.SIGN_TX_RESPONSE,
    )
    if (!signTxResponse.result.isSuccess) throw signTxResponse.result.error

    return signTxResponse.result.data
  }

  async signData(
    address: CborHexString,
    payload: CborHexString,
  ): Promise<DataSignature> {
    const signDataResponse = await sendGatewayMessageAndWaitForResponse(
      this.url,
      {
        type: MessageType.SIGN_DATA_REQUEST,
        initId: nanoid(),
        payload: {
          address,
          payload,
        },
      },
      MessageType.SIGN_DATA_RESPONSE,
    )
    if (!signDataResponse.result.isSuccess) throw signDataResponse.result.error

    return signDataResponse.result.data
  }
}
