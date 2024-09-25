import type {Account} from '@wingriders/cab/account'
import type {CborHexString} from '@wingriders/cab/dappConnector'
import {cborizeTxWitnesses} from '@wingriders/cab/ledger/transaction'
import type {NetworkName, TxInputRef} from '@wingriders/cab/types'
import {normalizeAddress, reverseTx} from '@wingriders/cab/wallet/connector'
import {
  type ConcreteMessage,
  type Message,
  MessageType,
} from '@wingriders/wallet-common'
import {encode} from 'borc'
import {getWalletData} from '../helpers/wallet'
import {parseTransactionCbor} from '../transaction/parseCbor'

export const getResponseMessageType = (requestType: MessageType) => {
  switch (requestType) {
    case MessageType.INIT_REQUEST:
      return MessageType.INIT_RESPONSE
    case MessageType.SIGN_TX_REQUEST:
      return MessageType.SIGN_TX_RESPONSE
    case MessageType.SIGN_DATA_REQUEST:
      return MessageType.SIGN_DATA_RESPONSE
    default:
      throw new Error(
        `Request type ${requestType} does not have a response type`,
      )
  }
}

export const getInitResponseMessage = (
  initRequestMessage: ConcreteMessage<'INIT_REQUEST'>,
  account: Account,
  network: NetworkName,
  collateralUtxoRef: TxInputRef | null,
) => {
  const walletData = getWalletData(account)

  const responseMessage: ConcreteMessage<'INIT_RESPONSE'> = {
    type: MessageType.INIT_RESPONSE,
    initId: initRequestMessage.initId,
    result: {
      isSuccess: true,
      data: {
        network,
        usedAddresses: walletData.usedAddresses.map(normalizeAddress),
        unusedAddresses: walletData.unusedAddresses.map(normalizeAddress),
        changeAddress: normalizeAddress(walletData.changeAddress),
        rewardAddresses: walletData.rewardAddresses.map(normalizeAddress),
        collateralUtxoRef,
      },
    },
  }

  return responseMessage
}

export const getSignTxResponseMessage = async (
  signTxRequestMessage: ConcreteMessage<'SIGN_TX_REQUEST'>,
  account: Account,
) => {
  const txCbor = signTxRequestMessage.payload.tx

  const parsedTx = parseTransactionCbor(txCbor)
  const txAux = reverseTx(parsedTx, account.getUtxos())
  const witnessSet = await account.witnessTxAux(txAux)

  const cborizedWitnessSet = cborizeTxWitnesses({
    shelleyWitnesses: witnessSet.vKeyWitnesses || [],
    byronWitnesses: [], // not supported
    scripts: witnessSet.plutusScripts,
    datums: witnessSet.plutusDatums,
    redeemers: witnessSet.redeemers,
    inputs: txAux.inputs,
    mint: txAux.mint,
  })

  const responseMessage: Extract<Message, {type: 'SIGN_TX_RESPONSE'}> = {
    type: MessageType.SIGN_TX_RESPONSE,
    initId: signTxRequestMessage.initId,
    result: {
      isSuccess: true,
      data: encode(cborizedWitnessSet).toString('hex') as CborHexString,
    },
  }

  return responseMessage
}
