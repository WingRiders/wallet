import {LoadingButton} from '@mui/lab'
import {Button, Stack, Typography} from '@mui/material'
import type {MessageDisplayProps} from './types'

type MessageDisplayParentProps = Pick<
  MessageDisplayProps,
  'onAllow' | 'onReject' | 'isLoading'
> & {
  title: string
  allowText?: string
  children?: React.ReactNode
}

export const MessageDisplayParent = ({
  onAllow,
  onReject,
  isLoading,
  title,
  allowText,
  children,
}: MessageDisplayParentProps) => {
  return (
    <Stack>
      <Typography variant="h4">{title}</Typography>
      {children}

      <Stack
        direction="column"
        alignItems="center"
        width="50%"
        alignSelf="center"
        spacing={1}
        mt={5}
      >
        <LoadingButton
          onClick={onAllow}
          variant="contained"
          sx={{mt: 2}}
          loading={isLoading}
          fullWidth
        >
          {allowText ?? 'Allow'}
        </LoadingButton>
        <Button onClick={onReject} disabled={isLoading} fullWidth>
          Reject
        </Button>
      </Stack>
    </Stack>
  )
}
