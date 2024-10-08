import type {ConcreteMessage, MessageType} from '@wingriders/wallet-common'
import type {MessageItem} from '../../store/messages'

export type MessageDisplayProps = {
  item: MessageItem
  isLoading?: boolean
  onAllow?: () => void
  onReject?: () => void
}

export type ConcreteMessageDisplayProps<TMessageType extends MessageType> = {
  item: MessageItem & {message: ConcreteMessage<TMessageType>}
} & Pick<MessageDisplayProps, 'onAllow' | 'onReject' | 'isLoading'>
