import {Box, Link, Typography} from '@mui/material'
import {MessageDisplayParent} from './MessageDisplayParent'
import type {ConcreteMessageDisplayProps} from './types'

export const SignDataRequestMessageDisplay = ({
  item,
  isLoading,
  onAllow,
  onReject,
}: ConcreteMessageDisplayProps<'SIGN_DATA_REQUEST'>) => {
  return (
    <MessageDisplayParent
      onAllow={onAllow}
      onReject={onReject}
      isLoading={isLoading}
      title="Sign data request"
      allowText="Sign"
    >
      <Typography>
        <Link href={item.origin} target="_blank">
          {item.origin}
        </Link>{' '}
        is requesting to sign data.
      </Typography>

      <Box bgcolor={({palette}) => palette.background.paper} p={2} mt={2}>
        <Typography variant="body2" sx={{overflowWrap: 'break-word'}}>
          {Buffer.from(item.message.payload.payload, 'hex').toString('utf8')}
        </Typography>
      </Box>
    </MessageDisplayParent>
  )
}
