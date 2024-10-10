import {LoadingButton} from '@mui/lab'
import {Button, Stack, Typography} from '@mui/material'
import type {MessageDisplayProps} from './types'

type MessageDisplayParentProps = Pick<
  MessageDisplayProps,
  'onAllow' | 'onReject' | 'isLoading'
> & {
  title: string
  allowText?: string
  disabled?: boolean
  children?: React.ReactNode
}

export const MessageDisplayParent = ({
  onAllow,
  onReject,
  isLoading,
  title,
  allowText,
  disabled,
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
          disabled={disabled}
          fullWidth
        >
          {allowText ?? 'Allow'}
        </LoadingButton>
        <Button onClick={onReject} disabled={isLoading || disabled} fullWidth>
          Reject
        </Button>
      </Stack>
    </Stack>
  )
}
