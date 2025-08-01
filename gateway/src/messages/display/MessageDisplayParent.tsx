import {Link, Stack, Typography} from '@mui/material'
import {Button} from '../../components/Buttons/Button'
import {TextButton} from '../../components/Buttons/TextButton'
import type {MessageDisplayProps} from './types'

type MessageDisplayParentProps = Pick<
  MessageDisplayProps,
  'onAllow' | 'onReject' | 'isLoading'
> & {
  title: string
  origin: string
  requestText: string
  allowText?: string
  disabled?: boolean
  children?: React.ReactNode
}

export const MessageDisplayParent = ({
  onAllow,
  onReject,
  isLoading,
  title,
  origin,
  requestText,
  allowText,
  disabled,
  children,
}: MessageDisplayParentProps) => {
  return (
    <Stack>
      <Typography variant="h4">{title}</Typography>

      <Typography
        sx={({palette}) => ({
          bgcolor: palette.background.default,
          borderTop: `1px solid ${palette.border.container}`,
          p: 2,
          my: 2,
        })}
      >
        <Link href={origin} target="_blank">
          {origin}
        </Link>{' '}
        {requestText}
      </Typography>

      {children}

      <Stack direction="row" justifyContent="space-between" mt={10} spacing={2}>
        <TextButton onClick={onReject} disabled={isLoading || disabled}>
          Reject
        </TextButton>

        <Button
          onClick={onAllow}
          sx={{mt: 2}}
          loading={isLoading && 'centered'}
          disabled={disabled || isLoading}
        >
          {allowText ?? 'Allow'}
        </Button>
      </Stack>
    </Stack>
  )
}
