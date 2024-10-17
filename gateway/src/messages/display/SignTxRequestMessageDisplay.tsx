import {LoadingButton} from '@mui/lab'
import {Button, Stack, Typography} from '@mui/material'
import type {ConcreteMessageDisplayProps} from './types'

export const SignTxRequestMessageDisplay = ({
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
