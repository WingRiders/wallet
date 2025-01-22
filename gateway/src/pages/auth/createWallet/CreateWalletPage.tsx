import {Box} from '@mui/material'
import {useShallow} from 'zustand/shallow'
import {Page} from '../../../components/Page'
import {Paper} from '../../../components/Paper'
import {
  CreateWalletOption,
  CreateWalletStage,
  useCreateWalletStore,
} from '../../../store/createWallet'
import {ChooseOption} from './ChooseOption'
import {ConfirmMnemonic} from './ConfirmMnemonic'
import {EnterMnemonic} from './EnterMnemonic'
import {EnterPassword} from './EnterPassword'
import {GenerateMnemonic} from './GenerateMnemonic'

export const CreateWalletPage = () => {
  const {currentStage, option} = useCreateWalletStore(
    useShallow(({currentStage, option}) => ({currentStage, option})),
  )

  return (
    <Page showHeader headerProps={{showNetwork: true}}>
      <Paper
        title={
          option === CreateWalletOption.CREATE
            ? 'Create a new wallet'
            : option === CreateWalletOption.IMPORT
              ? 'Restore existing wallet'
              : 'Create wallet'
        }
      >
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
              [CreateWalletStage.CONFIRM_GENERATED_MNEMONIC]: (
                <ConfirmMnemonic />
              ),
              [CreateWalletStage.PASSWORD]: <EnterPassword />,
            }[currentStage]
          }
        </Box>
      </Paper>
    </Page>
  )
}
