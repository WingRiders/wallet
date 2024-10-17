import {describe, expect, jest, mock, spyOn, test} from 'bun:test'
import type {CborHexString} from '@wingriders/cab/dappConnector'
import {
  type Message,
  MessageType,
  isValidMessage,
} from '@wingriders/wallet-common'
import {sendGatewayMessageAndWaitForResponse} from '../../src/messages/send'

describe('messages', () => {
  test('sendGatewayMessageAndWaitForResponse returns response', async () => {
    let messageEventListener: ((e: MessageEvent) => void) | undefined

    const responseMessage: Message = {
      type: MessageType.SIGN_TX_RESPONSE,
      initId: '0',
      result: {
        isSuccess: true,
        data: 'cafe' as CborHexString,
      },
    }

    spyOn(window, 'open').mockImplementation(
      () =>
        ({
          ...window,
          postMessage: jest.fn((message) => {
            // as soon as we send the request message, we trigger the response
            if (
              isValidMessage(message) &&
              message.type === MessageType.SIGN_TX_REQUEST
            )
              return messageEventListener?.({
                origin: 'url',
                data: responseMessage,
              } as MessageEvent)
          }),
        }) as any as Window,
    )
    spyOn(window, 'addEventListener').mockImplementation((_type, listener) => {
      messageEventListener = listener
    })

    const sendMessagePromise = sendGatewayMessageAndWaitForResponse(
      'url',
      {
        type: MessageType.SIGN_TX_REQUEST,
        initId: '0',
        payload: {
          tx: 'cafe' as CborHexString,
        },
      },
      MessageType.SIGN_TX_RESPONSE,
    )

    const gatewayReadyMessage: Message = {
      type: MessageType.GATEWAY_READY,
    }
    // simulate the gateway ready message, this will trigger the sending of the request message
    messageEventListener?.({
      origin: 'url',
      data: gatewayReadyMessage,
    } as MessageEvent)

    const sendMessageResult = await sendMessagePromise
    expect(sendMessageResult).toEqual(responseMessage)

    mock.restore()
  })
})
