import {LoadingButton} from '@mui/lab'
import {Button, Stack, Typography} from '@mui/material'
import type {ConcreteMessageDisplayProps} from './types'

export const SignDataRequestMessageDisplay = ({
  item,
  isLoading,
  onAllow,
  onReject,
}: ConcreteMessageDisplayProps<'SIGN_DATA_REQUEST'>) => {
  return (
    <Stack>
      <Typography variant="h4">Sign data request</Typography>
      <Typography>{item.origin} is requesting to sign data</Typography>
      <Typography variant="body2" sx={{overflowWrap: 'break-word'}}>
        {Buffer.from(item.message.payload.payload, 'hex').toString('utf8')}
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
