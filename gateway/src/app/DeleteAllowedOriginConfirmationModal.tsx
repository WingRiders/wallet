import {Stack} from '@mui/material'
import {Button} from '../components/Buttons/Button'
import {TextButton} from '../components/Buttons/TextButton'
import {Modal, type ModalProps} from '../components/Modals/Modal'
import {useCreatedWalletStore} from '../store/createdWallet'

type DeleteAllowedOriginConfirmationModalProps = Pick<
  ModalProps,
  'open' | 'onClose'
> & {
  origin: string
}

export const DeleteAllowedOriginConfirmationModal = ({
  origin,
  open,
  onClose,
}: DeleteAllowedOriginConfirmationModalProps) => {
  const removeAllowedOrigin = useCreatedWalletStore(
    (s) => s.removeAllowedOrigin,
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remove connected dApp"
      subtitle={`Are you sure you want to remove ${origin} from the connected dApps?`}
      allowBackdropDismiss
      width={200}
    >
      <Stack>
        <Stack spacing={2}>
          <Button
            onClick={() => {
              removeAllowedOrigin(origin)
              onClose?.()
            }}
            color="error"
          >
            Remove
          </Button>
          <TextButton onClick={onClose} sx={{width: '100%'}}>
            Cancel
          </TextButton>
        </Stack>
      </Stack>
    </Modal>
  )
}
