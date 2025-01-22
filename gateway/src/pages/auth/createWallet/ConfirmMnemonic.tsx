import {Box} from '@mui/material'
import {validateMnemonic as isMnemonicValid} from '@wingriders/cab/crypto'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {FlowNavigation} from '../../../components/FlowNavigation'
import {FormField} from '../../../components/FormField'
import {InputField} from '../../../components/InputField'
import {Paragraph} from '../../../components/Typography/Paragraph'
import {getErrorMessage} from '../../../helpers/forms'
import {
  CreateWalletStage,
  useCreateWalletStore,
} from '../../../store/createWallet'

type Inputs = {
  mnemonic: string
}

export const ConfirmMnemonic = () => {
  const {
    mnemonic: mnemonicInStore,
    confirmMnemonic,
    setCurrentStage,
  } = useCreateWalletStore(
    useShallow(({mnemonic, confirmMnemonic, setCurrentStage}) => ({
      mnemonic,
      confirmMnemonic,
      setCurrentStage,
    })),
  )

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = () => {
    confirmMnemonic()
  }

  return (
    <Box>
      <Paragraph variant="large" mb={5}>
        Confirm your new mnemonic by paste it below.
      </Paragraph>

      <FormField label="Mnemonic" error={getErrorMessage(errors.mnemonic)}>
        <InputField
          {...register('mnemonic', {
            required: true,
            validate: (value) => {
              if (!isMnemonicValid(value)) return 'Invalid mnemonic'
              if (value !== mnemonicInStore) return 'Mnemonic does not match'
              return undefined
            },
          })}
          placeholder="Enter your mnemonic phrase"
          multiline
        />
      </FormField>

      <FlowNavigation
        backButtonOptions={{
          label: 'Back',
          onClick: () => setCurrentStage(CreateWalletStage.MNEMONIC),
        }}
        nextButtonOptions={{
          label: 'Continue',
          onClick: handleSubmit(onSubmit),
        }}
      />
    </Box>
  )
}
