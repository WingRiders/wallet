import {Box} from '@mui/material'
import {validateMnemonic as isMnemonicValid} from '@wingriders/cab/crypto'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {FlowNavigation} from '../../../components/FlowNavigation'
import {FormField} from '../../../components/FormField'
import {InputField} from '../../../components/InputField'
import {Paragraph} from '../../../components/Typography/Paragraph'
import {getErrorMessage} from '../../../helpers/forms'
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
    submitMnemonic(data.mnemonic, false)
  }

  return (
    <Box>
      <Paragraph variant="large" mb={5}>
        Paste your existing 15-word or 24-word mnemonic phrase to restore your
        wallet.
      </Paragraph>

      <FormField label="Mnemonic" error={getErrorMessage(errors.mnemonic)}>
        <InputField
          {...register('mnemonic', {
            required: true,
            validate: (value) => {
              const words = value.split(' ')
              if (words.length !== 15 && words.length !== 24) {
                return 'Invalid mnemonic length, only 15 or 24 words are supported'
              }
              if (!isMnemonicValid(value)) return 'Invalid mnemonic'
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
