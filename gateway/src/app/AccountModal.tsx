import {Box, Stack} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {useState} from 'react'
import {useShallow} from 'zustand/shallow'
import {CollateralPanel} from '../collateral/CollateralPanel'
import {Button} from '../components/Buttons/Button'
import {TextButton} from '../components/Buttons/TextButton'
import {FormField} from '../components/FormField'
import {Modal, type ModalProps} from '../components/Modals/Modal'
import {NetworkSwitch} from '../components/NetworkSwitch'
import {Label} from '../components/Typography/Label'
import {WithClipboard} from '../components/WithClipboard'
import {CardanoscanLinks} from '../helpers/explorerLinks'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useWalletDataStore} from '../store/walletData'
import {AllowedOrigins} from './AllowedOrigins'
import {DiscardWalletConfirmationModal} from './DiscardWalletConfirmationModal'

type AccountModalProps = Pick<ModalProps, 'open' | 'onClose'>

export const AccountModal = ({open, onClose}: AccountModalProps) => {
  const [showDiscardWalletModal, setShowDiscardWalletModal] = useState(false)

  const navigate = useNavigate()
  const network = useCreatedWalletStore((s) => s.network)
  const {addresses, logOut} = useWalletDataStore(
    useShallow(({addresses, logOut}) => ({addresses, logOut})),
  )

  const address = addresses?.usedAddresses[0] ?? addresses?.unusedAddresses[0]
  const explorerLinks = new CardanoscanLinks(network)

  return (
    <>
      <Modal open={open} onClose={onClose} title="Account" allowBackdropDismiss>
        <Stack spacing={5}>
          <FormField label="Your address">
            <Stack
              bgcolor={({palette}) => palette.background.paper}
              p={4}
              spacing={4}
            >
              <Label sx={{wordWrap: 'break-word'}}>
                {address || 'unknown'}
              </Label>

              {address && (
                <Stack
                  direction="row"
                  spacing={4}
                  pt={2}
                  sx={({palette}) => ({
                    borderTop: `1px solid ${palette.divider}`,
                  })}
                >
                  <TextButton
                    color="secondary"
                    p={0}
                    uppercase={false}
                    anchor
                    href={explorerLinks.address(address)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on explorer
                  </TextButton>

                  <WithClipboard text={address}>
                    {({copy, isCopied}) => (
                      <TextButton
                        onClick={copy}
                        color="secondary"
                        p={0}
                        uppercase={false}
                      >
                        {isCopied ? 'Copied' : 'Copy address'}
                      </TextButton>
                    )}
                  </WithClipboard>
                </Stack>
              )}
            </Stack>
          </FormField>

          <FormField label="Collateral">
            <Box bgcolor={({palette}) => palette.background.paper} p={4}>
              <CollateralPanel />
            </Box>
          </FormField>

          <FormField label="Network">
            <NetworkSwitch
              renderSingleNetwork={(network) => (
                <Box p={5} bgcolor={({palette}) => palette.background.paper}>
                  <Label>{network}</Label>
                </Box>
              )}
            />
          </FormField>

          <FormField label="Connected dApps">
            <Box bgcolor={({palette}) => palette.background.paper} p={4}>
              <AllowedOrigins />
            </Box>
          </FormField>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TextButton
              onClick={() => setShowDiscardWalletModal(true)}
              sx={({palette}) => ({color: palette.error.main})}
            >
              Discard wallet
            </TextButton>
            <Button
              onClick={() => {
                logOut()
                navigate({to: '/auth/login', replace: true})
              }}
              sx={{minWidth: 150}}
            >
              Log out
            </Button>
          </Stack>
        </Stack>
      </Modal>

      <DiscardWalletConfirmationModal
        open={showDiscardWalletModal}
        onClose={() => setShowDiscardWalletModal(false)}
      />
    </>
  )
}
