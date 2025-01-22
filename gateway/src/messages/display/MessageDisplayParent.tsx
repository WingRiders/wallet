import {Stack, Typography} from '@mui/material'
import {Button} from '../../components/Buttons/Button'
import {TextButton} from '../../components/Buttons/TextButton'
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
        <Button
          onClick={onAllow}
          sx={{mt: 2}}
          loading={isLoading && 'centered'}
          disabled={disabled || isLoading}
          fullWidth
        >
          {allowText ?? 'Allow'}
        </Button>
        <TextButton
          onClick={onReject}
          disabled={isLoading || disabled}
          fullWidth
        >
          Reject
        </TextButton>
      </Stack>
    </Stack>
  )
}
