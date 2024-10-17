import {Box, Typography} from '@mui/material'
import {useShallow} from 'zustand/shallow'
import {Page} from '../../../components/Page'
import {
  CreateWalletOption,
  CreateWalletStage,
  useCreateWalletStore,
} from '../../../store/createWallet'
import {ChooseOption} from './ChooseOption'
import {EnterMnemonic} from './EnterMnemonic'
import {EnterPassword} from './EnterPassword'
import {GenerateMnemonic} from './GenerateMnemonic'

export const CreateWalletPage = () => {
  const {currentStage, option} = useCreateWalletStore(
    useShallow(({currentStage, option}) => ({currentStage, option})),
  )

  return (
    <Page showHeader headerProps={{showWalletActions: false}}>
      <Typography variant="h3">
        {option === CreateWalletOption.CREATE
          ? 'Create a new wallet'
          : option === CreateWalletOption.IMPORT
            ? 'Import existing wallet'
            : 'Create wallet'}
      </Typography>

      <Box mt={4}>
        {
          {
            [CreateWalletStage.CHOOSE_OPTION]: <ChooseOption />,
            [CreateWalletStage.MNEMONIC]:
              option === CreateWalletOption.CREATE ? (
                <GenerateMnemonic />
              ) : option === CreateWalletOption.IMPORT ? (
                <EnterMnemonic />
              ) : null,
            [CreateWalletStage.PASSWORD]: <EnterPassword />,
          }[currentStage]
        }
      </Box>
    </Page>
  )
}
