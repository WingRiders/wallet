import {LoadingButton} from '@mui/lab'
import {Button, Stack, Typography} from '@mui/material'
import {type ConcreteMessage, MessageType} from '@wingriders/wallet-common'
import {match} from 'ts-pattern'
import type {MessageItem} from '../store/messages'

type MessageDisplayProps = {
  item: MessageItem
  isLoading?: boolean
  onAllow?: () => void
  onReject?: () => void
}
export const MessageDisplay = ({item, ...otherProps}: MessageDisplayProps) => {
  return match(item)
    .with({message: {type: MessageType.INIT_REQUEST}}, (item) => (
      <InitMessageDisplay item={item} {...otherProps} />
    ))
    .with({message: {type: MessageType.SIGN_TX_REQUEST}}, (item) => (
      <SignTxRequestMessageDisplay item={item} {...otherProps} />
    ))
    .otherwise(() => null)
}

type ConcreteMessageDisplayProps<TMessageType extends MessageType> = {
  item: MessageItem & {message: ConcreteMessage<TMessageType>}
} & Pick<MessageDisplayProps, 'onAllow' | 'onReject' | 'isLoading'>

const InitMessageDisplay = ({
  item,
  isLoading,
  onAllow,
  onReject,
}: ConcreteMessageDisplayProps<'INIT_REQUEST'>) => {
  return (
    <Stack>
      <Typography variant="h4">Connection request</Typography>
      <Typography>
        {item.origin} is requesting to connect to your wallet
      </Typography>
      <LoadingButton
        onClick={onAllow}
        variant="contained"
        sx={{mt: 2}}
        loading={isLoading}
      >
        Connect
      </LoadingButton>
      <Button onClick={onReject} disabled={isLoading}>
        Reject
      </Button>
    </Stack>
  )
}

const SignTxRequestMessageDisplay = ({
  item,
  isLoading,
  onAllow,
  onReject,
}: ConcreteMessageDisplayProps<'SIGN_TX_REQUEST'>) => {
  return (
    <Stack>
      <Typography variant="h4">Sign transaction request</Typography>
      <Typography>{item.origin} is requesting to sign a transaction</Typography>
      <Typography variant="body2" sx={{overflowWrap: 'break-word'}}>
        {item.message.payload.tx}
      </Typography>
      <LoadingButton
        onClick={onAllow}
        variant="contained"
        sx={{mt: 2}}
        loading={isLoading}
      >
        Sign
      </LoadingButton>
      <Button onClick={onReject} disabled={isLoading}>
        Reject
      </Button>
    </Stack>
  )
}
