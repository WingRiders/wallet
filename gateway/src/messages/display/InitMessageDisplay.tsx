import {Link, Typography} from '@mui/material'
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
      allowText="Connect"
    >
      <Typography>
        <Link href={item.origin} target="_blank">
          {item.origin}
        </Link>{' '}
        is requesting to connect to your wallet.
      </Typography>
    </MessageDisplayParent>
  )
}
