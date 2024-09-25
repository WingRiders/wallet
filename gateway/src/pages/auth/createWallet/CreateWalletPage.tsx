import {Box, Typography} from '@mui/material'
import {Page} from '../../../components/Page'
import {
  CreateWalletStage,
  useCreateWalletStore,
} from '../../../store/createWallet'
import {EnterMnemonic} from './EnterMnemonic'
import {EnterPassword} from './EnterPassword'

export const CreateWalletPage = () => {
  const currentStage = useCreateWalletStore((s) => s.currentStage)

  return (
    <Page>
      <Typography variant="h3">Create wallet</Typography>

      <Box mt={4}>
        {
          {
            [CreateWalletStage.MNEMONIC]: <EnterMnemonic />,
            [CreateWalletStage.PASSWORD]: <EnterPassword />,
          }[currentStage]
        }
      </Box>
    </Page>
  )
}
