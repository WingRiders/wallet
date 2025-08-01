import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  Stack,
  type SxProps,
  type Theme,
} from '@mui/material'
import type {AllSystemCSSProperties} from '@mui/system'
import type {ReactNode} from 'react'

import {useIsMobile} from '../../helpers/resolution'
import {combineSx} from '../../theme'
import {IconButton} from '../Buttons/IconButton'
import {Heading} from '../Typography/Heading'
import {Label} from '../Typography/Label'
import {useModalProps} from './util'

export type ModalProps = Pick<
  AllSystemCSSProperties,
  'width' | 'height' | 'minHeight' | 'maxHeight'
> & {
  id?: string
  title?: string | ReactNode
  subtitle?: ReactNode
  open: boolean
  onClose?: () => void
  children: ReactNode
  actions?: ReactNode
  scrollableContent?: boolean
  keepMounted?: boolean
  allowBackdropDismiss?: boolean
  actionsSx?: SxProps<Theme>
  scroll?: DialogProps['scroll']
  contentMaxHeight?: AllSystemCSSProperties['maxHeight']
  footer?: ReactNode
  headerSx?: SxProps<Theme>
  disableFullScreenOnMobile?: boolean
}

export const Modal = ({
  open,
  keepMounted,
  allowBackdropDismiss,
  headerSx,
  disableFullScreenOnMobile,
  ...props
}: ModalProps) => {
  const {
    id,
    title,
    subtitle,
    onClose,
    children,
    actions,
    scrollableContent = true,
    width,
    height,
    actionsSx,
    scroll = 'body',
    contentMaxHeight,
    footer,
    maxHeight,
  } = useModalProps(open, props)

  const handleClose = (
    _event: Event,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick' && !allowBackdropDismiss) {
      return
    }
    onClose?.()
  }

  const px = useIsMobile() ? 4 : 6

  return (
    <Dialog
      scroll={scroll}
      id={id}
      open={open}
      onClose={handleClose}
      keepMounted={keepMounted}
      fullScreen={useIsMobile() && !disableFullScreenOnMobile}
      sx={(theme) => ({
        '& .MuiDialog-paper': {
          borderRadius: 0,
          pt: 6,
          pb: actions ? 10 : 6,
          border: `1px solid ${theme.palette.border.container}`,
          background: theme.palette.background.modal,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          transition: 'all 0.30s linear',
          [theme.breakpoints.up('md')]: {
            minWidth: '426px',
            minHeight: 0,
            width,
            maxWidth: width,
            height,
            maxHeight,
          },
          ...(disableFullScreenOnMobile
            ? {
                width,
              }
            : {}),
        },
      })}
    >
      {/* top border gradient */}
      <Box
        sx={({palette}) => ({
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '1px',
          background: palette.gradient.success,
        })}
      />
      <Stack
        flexDirection="row"
        justifyContent={title ? 'space-between' : 'flex-end'}
        alignItems="flex-start"
        sx={combineSx(
          {
            px,
            mb: subtitle ? 0 : 6,
          },
          headerSx,
        )}
      >
        {title && typeof title === 'string' ? (
          <Heading variant="h2">{title}</Heading>
        ) : (
          title
        )}
        {onClose && (
          <IconButton
            icon={<CloseIcon />}
            hasFontIcon
            onClick={onClose}
            sx={{mr: -2, mt: -2}}
          />
        )}
      </Stack>
      {subtitle && (
        <Box mt={2} mb={6} mx={6}>
          {typeof subtitle === 'string' ? (
            <Label
              variant="large"
              sx={({palette}) => ({color: palette.text.secondary})}
            >
              {subtitle}
            </Label>
          ) : (
            subtitle
          )}
        </Box>
      )}
      <DialogContent
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          py: 0,
          px,
          overflow: scrollableContent
            ? scroll === 'body'
              ? 'visible'
              : 'auto'
            : 'hidden',
          [theme.breakpoints.up('md')]: {
            maxHeight: contentMaxHeight,
          },
        })}
      >
        {children}
      </DialogContent>
      {actions && (
        <DialogActions
          sx={combineSx(
            {
              px,
              mt: 10,
            },
            actionsSx,
          )}
        >
          {actions}
        </DialogActions>
      )}
      {footer && <Box px={px}>{footer}</Box>}
    </Dialog>
  )
}
