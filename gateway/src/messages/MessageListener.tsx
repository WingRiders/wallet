import {
  type ConcreteMessage,
  MessageType,
  isValidMessage,
} from '@wingriders/wallet-common'
import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useMessagesStore} from '../store/messages'
import {getDeclinedErrorCode, getResponseMessageType} from './response'

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
  const allowedOrigins = useCreatedWalletStore((s) => s.allowedOrigins)

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      if (!event.source) return

      const message = event.data
      if (
        !isValidMessage(message) ||
        message.type === MessageType.GATEWAY_READY // ignore this message in the gateway
      )
        return

      // if it's not an init request, check if the origin is allowed
      if (
        message.type !== MessageType.INIT_REQUEST &&
        !allowedOrigins.includes(event.origin)
      ) {
        const responseMessageType = getResponseMessageType(message.type)

        const responseMessage: ConcreteMessage<typeof responseMessageType> = {
          type: responseMessageType,
          initId: message.initId,
          result: {isSuccess: false, error: {info: 'Origin not allowed'}},
        }

        event.source.postMessage(responseMessage, {
          targetOrigin: event.origin,
        })
        window.close()
        return
      }
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
  }, [setPendingMessage, allowedOrigins])

  // resolve pending message when user closes the window
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (pendingMessage) {
        event.preventDefault()
        const responseMessageType = getResponseMessageType(
          pendingMessage.message.type,
        )

        const responseMessage: ConcreteMessage<typeof responseMessageType> = {
          type: responseMessageType,
          initId: pendingMessage.message.initId,
          result: {
            isSuccess: false,
            error: {
              code: getDeclinedErrorCode(pendingMessage.message.type),
              info: 'User closed the window',
            },
          },
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
