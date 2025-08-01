import {} from '@mui/material'
import {MessageDisplayParent} from './MessageDisplayParent'
import type {ConcreteMessageDisplayProps} from './types'

export const InitMessageDisplay = ({
  item,
  isLoading,
  onAllow,
  onReject,
}: ConcreteMessageDisplayProps<'INIT_REQUEST'>) => {
  return (
    <MessageDisplayParent
      onAllow={onAllow}
      onReject={onReject}
      isLoading={isLoading}
      title="Connection request"
      origin={item.origin}
      requestText="is requesting to connect to your wallet."
      allowText="Connect"
    />
  )
}
