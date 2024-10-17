import {
  type ConcreteMessage,
  MessageType,
  isValidMessage,
} from '@wingriders/wallet-common'
import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import {useMessagesStore} from '../store/messages'
import {getResponseMessageType} from './response'

type MessageListenerProps = {
  children?: React.ReactNode
}

export const MessageListener = ({children}: MessageListenerProps) => {
  const {pendingMessage, setPendingMessage} = useMessagesStore(
    useShallow(({pendingMessage, setPendingMessage}) => ({
      pendingMessage,
      setPendingMessage,
    })),
  )

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      if (!event.source) return

      const message = event.data
      if (
        !isValidMessage(message) ||
        message.type === MessageType.GATEWAY_READY // ignore this message in the gateway
      )
        return

      setPendingMessage({
        message,
        eventSource: event.source,
        origin: event.origin,
      })
    }
    window.addEventListener('message', handleEvent)

    // notify the parent window that the gateway is ready
    window.opener?.postMessage({type: MessageType.GATEWAY_READY}, '*')

    return () => {
      window.removeEventListener('message', handleEvent)
    }
  }, [setPendingMessage])

  // resolve pending message when user closes the window
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingMessage) {
        const responseMessageType = getResponseMessageType(
          pendingMessage.message.type,
        )

        const responseMessage: ConcreteMessage<typeof responseMessageType> = {
          type: responseMessageType,
          initId: pendingMessage.message.initId,
          result: {isSuccess: false, errorMessage: 'User closed the window'},
        }

        pendingMessage.eventSource.postMessage(responseMessage, {
          targetOrigin: pendingMessage.origin,
        })
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pendingMessage])

  return <>{children}</>
}
