import {LoadingButton} from '@mui/lab'
import {Button, Stack, Typography} from '@mui/material'
import type {ConcreteMessageDisplayProps} from './types'

export const InitMessageDisplay = ({
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
