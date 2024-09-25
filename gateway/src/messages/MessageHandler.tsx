import type {Wallet} from '@wingriders/cab/wallet'
import {
  type ConcreteMessage,
  MessageType,
  isMessageWithType,
} from '@wingriders/wallet-common'
import {useState} from 'react'
import {match} from 'ts-pattern'
import {EnterPasswordModal} from '../components/EnterPasswordModal'
import {Page} from '../components/Page'
import {useMessagesStore} from '../store/messages'
import {useWalletDataStore} from '../store/walletData'
import {MessageDisplay} from './MessageDisplay'
import {
  getInitResponseMessage,
  getResponseMessageType,
  getSignTxResponseMessage,
} from './response'

export const MessageHandler = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pendingRequestMessage = useMessagesStore((s) => s.pendingMessage)
  const collateralUtxoRef = useWalletDataStore((s) => s.collateral)

  if (!pendingRequestMessage) return null

  const responseMessageType = getResponseMessageType(
    pendingRequestMessage.message.type,
  )

  const handleLogin = async (wallet: Wallet) => {
    try {
      setIsLoading(true)
      const account = wallet.getAccount(0)
      const responseMessage = await match(pendingRequestMessage.message)
        .when(
          (message) => isMessageWithType(message, MessageType.INIT_REQUEST),
          (message) =>
            getInitResponseMessage(message, account, collateralUtxoRef),
        )
        .when(
          (message) => isMessageWithType(message, MessageType.SIGN_TX_REQUEST),
          (message) => getSignTxResponseMessage(message, account),
        )
        .otherwise(() => null)

      if (!responseMessage) throw new Error('Unhandled message type')

      pendingRequestMessage.eventSource.postMessage(responseMessage, {
        targetOrigin: pendingRequestMessage.origin,
      })
    } catch (e: any) {
      const message = e.message
      handleMessageFail(
        message && typeof message === 'string'
          ? `Request failed: ${e.message}`
          : 'Request failed',
      )
    }
    setIsLoading(false)
    window.close()
  }

  const handleMessageFail = (errorMessage?: string) => {
    const responseMessage: ConcreteMessage<typeof responseMessageType> = {
      type: responseMessageType,
      initId: pendingRequestMessage.message.initId,
      result: {isSuccess: false, errorMessage},
    }

    pendingRequestMessage.eventSource.postMessage(responseMessage, {
      targetOrigin: pendingRequestMessage.origin,
    })
  }

  return (
    <Page>
      <MessageDisplay
        item={pendingRequestMessage}
        isLoading={isLoading}
        onAllow={() => setShowPasswordModal(true)}
        onReject={() => {
          handleMessageFail('User rejected the request')
          window.close()
        }}
      />

      <EnterPasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onLogin={handleLogin}
      />
    </Page>
  )
}
