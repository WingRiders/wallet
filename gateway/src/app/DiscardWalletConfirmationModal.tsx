import {Stack} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {Button} from '../components/Buttons/Button'
import {TextButton} from '../components/Buttons/TextButton'
import {Modal, type ModalProps} from '../components/Modals/Modal'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useWalletDataStore} from '../store/walletData'

type DiscardWalletConfirmationModalProps = Pick<ModalProps, 'open' | 'onClose'>

export const DiscardWalletConfirmationModal = ({
  open,
  onClose,
}: DiscardWalletConfirmationModalProps) => {
  const navigate = useNavigate()
  const clearWalletData = useWalletDataStore(({clear}) => clear)
  const clearCreatedWallet = useCreatedWalletStore(
    ({clearCreatedWallet}) => clearCreatedWallet,
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Discard wallet"
      subtitle="Are you sure you want to discard this wallet? This action cannot be undone."
      allowBackdropDismiss
      width={200}
    >
      <Stack>
        <Stack spacing={2}>
          <Button
            onClick={() => {
              clearCreatedWallet()
              clearWalletData()
              navigate({to: '/auth/create-wallet', replace: true})
            }}
            color="error"
          >
            Discard wallet
          </Button>
          <TextButton onClick={onClose} sx={{width: '100%'}}>
            Cancel
          </TextButton>
        </Stack>
      </Stack>
    </Modal>
  )
}
