import {MessageType} from '@wingriders/wallet-common'
import {match} from 'ts-pattern'
import {InitMessageDisplay} from './InitMessageDisplay'
import {SignDataRequestMessageDisplay} from './SignDataRequestMessageDisplay'
import {SignTxRequestMessageDisplay} from './SignTxRequestMessageDisplay'
import type {MessageDisplayProps} from './types'

export const MessageDisplay = ({item, ...otherProps}: MessageDisplayProps) => {
  return match(item)
    .with({message: {type: MessageType.INIT_REQUEST}}, (item) => (
      <InitMessageDisplay item={item} {...otherProps} />
    ))
    .with({message: {type: MessageType.SIGN_TX_REQUEST}}, (item) => (
      <SignTxRequestMessageDisplay item={item} {...otherProps} />
    ))
    .with({message: {type: MessageType.SIGN_DATA_REQUEST}}, (item) => (
      <SignDataRequestMessageDisplay item={item} {...otherProps} />
    ))
    .otherwise(() => null)
}
