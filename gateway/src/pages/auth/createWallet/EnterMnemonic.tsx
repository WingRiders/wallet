import {Box, TextField} from '@mui/material'
import {validateMnemonic as isMnemonicValid} from '@wingriders/cab/crypto'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {FlowNavigation} from '../../../components/FlowNavigation'
import {getTextFieldErrorFields} from '../../../helpers/forms'
import {useCreateWalletStore} from '../../../store/createWallet'

type Inputs = {
  mnemonic: string
}

export const EnterMnemonic = () => {
  const {
    mnemonic: mnemonicInStore,
    submitMnemonic,
    reset: resetCreateWalletStore,
  } = useCreateWalletStore(
    useShallow(({mnemonic, submitMnemonic, reset}) => ({
      mnemonic,
      submitMnemonic,
      reset,
    })),
  )

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({
    defaultValues: {
      mnemonic: mnemonicInStore,
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    submitMnemonic(data.mnemonic)
  }

  return (
    <Box>
      <TextField
        {...register('mnemonic', {
          required: true,
          validate: (value) => {
            if (!isMnemonicValid(value)) return 'Invalid mnemonic'
            return undefined
          },
        })}
        label="Mnemonic"
        fullWidth
        variant="filled"
        multiline
        {...getTextFieldErrorFields(errors.mnemonic)}
      />

      <FlowNavigation
        backButtonOptions={{
          label: 'Back',
          onClick: resetCreateWalletStore,
        }}
        nextButtonOptions={{
          label: 'Continue',
          onClick: handleSubmit(onSubmit),
        }}
      />
    </Box>
  )
}
