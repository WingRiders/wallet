import type {JsCryptoProvider} from '@wingriders/cab/crypto'
import {APIErrorCode} from '@wingriders/cab/dappConnector'
import {
  networkIdToNetworkName,
  networkNameToNetworkId,
} from '@wingriders/cab/helpers'
import type {Wallet} from '@wingriders/cab/wallet'
import {
  type ConcreteMessage,
  MessageType,
  isMessageWithType,
} from '@wingriders/wallet-common'
import {useState} from 'react'
import {match} from 'ts-pattern'
import {useShallow} from 'zustand/shallow'
import {EnterPasswordModal} from '../components/EnterPasswordModal'
import {Page} from '../components/Page'
import {Paper} from '../components/Paper'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useMessagesStore} from '../store/messages'
import {useWalletDataStore} from '../store/walletData'
import {MessageDisplay} from './display/MessageDisplay'
import {
  getDeclinedErrorCode,
  getInitResponseMessage,
  getResponseMessageType,
  getSignDataResponseMessage,
  getSignTxResponseMessage,
} from './response'

export const MessageHandler = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pendingRequestMessage = useMessagesStore((s) => s.pendingMessage)
  const collateralUtxoRef = useWalletDataStore((s) => s.collateral)
  const {network, addAllowedOrigin} = useCreatedWalletStore(
    useShallow(({network, addAllowedOrigin}) => ({network, addAllowedOrigin})),
  )

  if (!pendingRequestMessage) return null

  const responseMessageType = getResponseMessageType(
    pendingRequestMessage.message.type,
  )

  const handleLogin = async (
    wallet: Wallet,
    cryptoProvider: JsCryptoProvider,
  ) => {
    try {
      setIsLoading(true)
      const account = wallet.getAccount(0)
      const responseMessage = await match(pendingRequestMessage.message)
        .when(
          (message) => isMessageWithType(message, MessageType.INIT_REQUEST),
          (message) =>
            getInitResponseMessage(
              message,
              account,
              networkIdToNetworkName[wallet.getNetworkId()],
              collateralUtxoRef,
            ),
        )
        .when(
          (message) => isMessageWithType(message, MessageType.SIGN_TX_REQUEST),
          (message) =>
            getSignTxResponseMessage(
              message,
              account,
              networkNameToNetworkId[network],
            ),
        )
        .when(
          (message) =>
            isMessageWithType(message, MessageType.SIGN_DATA_REQUEST),
          (message) =>
            getSignDataResponseMessage(message, account, cryptoProvider),
        )
        .otherwise(() => null)

      if (!responseMessage) throw new Error('Unhandled message type')

      if (pendingRequestMessage.message.type === MessageType.INIT_REQUEST) {
        addAllowedOrigin(pendingRequestMessage.origin)
      }
      pendingRequestMessage.eventSource.postMessage(responseMessage, {
        targetOrigin: pendingRequestMessage.origin,
      })
    } catch (e: any) {
      const message = e.message
      handleMessageFail({
        code: APIErrorCode.InternalError,
        info:
          message && typeof message === 'string'
            ? `Request failed: ${e.message}`
            : 'Request failed',
      })
    }
    setIsLoading(false)
    window.close()
  }

  const handleMessageFail = (error?: {code?: number; info?: string}) => {
    const responseMessage: ConcreteMessage<typeof responseMessageType> = {
      type: responseMessageType,
      initId: pendingRequestMessage.message.initId,
      result: {isSuccess: false, error},
    }

    pendingRequestMessage.eventSource.postMessage(responseMessage, {
      targetOrigin: pendingRequestMessage.origin,
    })
  }

  return (
    <Page headerProps={{showNetwork: true}}>
      <Paper>
        <MessageDisplay
          item={pendingRequestMessage}
          isLoading={isLoading}
          onAllow={() => setShowPasswordModal(true)}
          onReject={() => {
            handleMessageFail({
              code: getDeclinedErrorCode(pendingRequestMessage.message.type),
              info: 'User rejected the request',
            })
            window.close()
          }}
        />

        <EnterPasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onLogin={handleLogin}
        />
      </Paper>
    </Page>
  )
}
