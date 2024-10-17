import {
  type ConcreteMessage,
  type Message,
  MessageType,
  isMessageWithType,
  isValidMessage,
} from '@wingriders/wallet-common'

export const sendGatewayMessageAndWaitForResponse = <
  TResponseMessageType extends MessageType,
>(
  gatewayUrl: string,
  message: Exclude<Message, {type: 'GATEWAY_READY'}>,
  responseMessageType: TResponseMessageType,
): Promise<ConcreteMessage<TResponseMessageType>> => {
  return new Promise((resolve, reject) => {
    const gatewayWindow = window.open(gatewayUrl)
    if (!gatewayWindow) {
      reject(new Error('Failed to open the gateway window'))
      return
    }

    let messageSent = false
    const handleResponseFromGateway = (event: MessageEvent) => {
      if (event.origin !== gatewayUrl) return

      const responseMessage = event.data
      if (!isValidMessage(responseMessage)) return

      if (responseMessage.type === MessageType.GATEWAY_READY) {
        if (!messageSent) {
          // send the message when the gateway is ready
          gatewayWindow.postMessage(message, gatewayUrl)
          messageSent = true
        }
        return
      }

      // ignore messages that are not responses to the message we sent
      if (
        !isMessageWithType(responseMessage, responseMessageType) ||
        responseMessage.initId !== message.initId
      )
        return

      window.removeEventListener('message', handleResponseFromGateway)
      resolve(responseMessage)
    }

    window.addEventListener('message', handleResponseFromGateway)
  })
}
