import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import {validateMnemonic as isMnemonicValid} from '@wingriders/cab/crypto'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {getTextFieldErrorFields} from '../../../helpers/forms'
import {
  CreateWalletStage,
  useCreateWalletStore,
} from '../../../store/createWallet'

type Inputs = {
  mnemonic: string
}

export const EnterMnemonic = () => {
  const {
    mnemonic: mnemonicInStore,
    setMnemonic: setMnemonicInStore,
    setCurrentStage,
  } = useCreateWalletStore(
    useShallow(({mnemonic, setMnemonic, setCurrentStage}) => ({
      mnemonic,
      setMnemonic,
      setCurrentStage,
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
    setMnemonicInStore(data.mnemonic)
    setCurrentStage(CreateWalletStage.PASSWORD)
  }

  return (
    <Box>
      <Typography mb={3} variant="h5">
        Enter your mnemonic
      </Typography>

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

      <Stack direction="row" justifyContent="flex-end" mt={4}>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Continue
        </Button>
      </Stack>
    </Box>
  )
}
