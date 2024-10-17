import {MessageType, isValidMessage} from '@wingriders/wallet-common'
import {useEffect} from 'react'
import {useMessagesStore} from '../store/messages'

type MessageListenerProps = {
  children?: React.ReactNode
}

export const MessageListener = ({children}: MessageListenerProps) => {
  const setPendingMessage = useMessagesStore((s) => s.setPendingMessage)

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

  return <>{children}</>
}
