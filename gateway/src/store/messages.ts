import type {Message} from '@wingriders/wallet-common'
import {create} from 'zustand'

export type MessageItem = {
  message: Exclude<Message, {type: 'GATEWAY_READY'}>
  eventSource: MessageEventSource
  origin: string
}

export type MessagesState = {
  pendingMessage: MessageItem | null
  setPendingMessage: (item: MessageItem | null) => void
}

export const useMessagesStore = create<MessagesState>((set) => ({
  pendingMessage: null,
  setPendingMessage: (pendingMessage) => set({pendingMessage}),
}))
