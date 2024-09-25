import type {CborHexString, HexString} from '@wingriders/cab/dappConnector'
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
    if (!initResponse.result.isSuccess)
      throw new Error(initResponse.result.errorMessage)

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
    if (!signTxResponse.result.isSuccess)
      throw new Error(signTxResponse.result.errorMessage)

    return signTxResponse.result.data
  }

  async signData(
    addr: CborHexString,
    sigStructure: CborHexString,
  ): Promise<HexString> {
    const signDataResponse = await sendGatewayMessageAndWaitForResponse(
      this.url,
      {
        type: MessageType.SIGN_DATA_REQUEST,
        initId: nanoid(),
        payload: {
          addr,
          sigStructure,
        },
      },
      MessageType.SIGN_DATA_RESPONSE,
    )
    if (!signDataResponse.result.isSuccess)
      throw new Error(signDataResponse.result.errorMessage)

    return signDataResponse.result.data
  }
}
