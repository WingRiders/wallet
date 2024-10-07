import SendIcon from '@mui/icons-material/Send'
import {Alert, Box, Stack, TextField, Typography} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {FlowNavigation} from '../../../components/FlowNavigation'
import {encryptData} from '../../../helpers/encryption'
import {getTextFieldErrorFields} from '../../../helpers/forms'
import {validatePassword} from '../../../helpers/validation'
import {getWalletData, initWallet} from '../../../helpers/wallet'
import {
  CreateWalletStage,
  useCreateWalletStore,
} from '../../../store/createWallet'
import {useCreatedWalletStore} from '../../../store/createdWallet'
import {useWalletDataStore} from '../../../store/walletData'

type Inputs = {
  password: string
  passwordConfirmation: string
}

export const EnterPassword = () => {
  const navigate = useNavigate()
  const {
    setCurrentStage,
    reset: resetCreateWalletStore,
    mnemonic: mnemonicInStore,
  } = useCreateWalletStore(
    useShallow(({setCurrentStage, reset, mnemonic}) => ({
      setCurrentStage,
      reset,
      mnemonic,
    })),
  )
  const {setCreatedWallet, network} = useCreatedWalletStore(
    useShallow(({setCreatedWallet, network}) => ({setCreatedWallet, network})),
  )
  const setWalletData = useWalletDataStore((s) => s.setWalletData)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setError,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // This should never happen because the mnemonic is set in the previous step
    if (!mnemonicInStore) throw new Error('Mnemonic is not set')

    try {
      const {account} = await initWallet({
        mnemonic: mnemonicInStore,
        network,
      })

      const {
        encryptedData: encryptedMnemonic,
        iv,
        salt,
      } = await encryptData(Buffer.from(mnemonicInStore), data.password)

      setCreatedWallet({
        encryptedMnemonic: encryptedMnemonic.toString('hex'),
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
      })
      setWalletData(getWalletData(account))

      resetCreateWalletStore()
      navigate({to: '/', replace: true})
    } catch (e: any) {
      const message = e.message
      setError('root', {
        message:
          message && typeof message === 'string'
            ? `Creating wallet failed: ${e.message}`
            : 'Creating wallet failed',
      })
    }
  }

  return (
    <Box>
      <Typography mb={3} variant="h5">
        Create a secure password
      </Typography>

      <Stack spacing={2}>
        <TextField
          {...register('password', {
            required: true,
            validate: validatePassword,
          })}
          label="Password"
          type="password"
          fullWidth
          variant="filled"
          disabled={isSubmitting}
          {...getTextFieldErrorFields(errors.password)}
        />
        <TextField
          {...register('passwordConfirmation', {
            required: true,
            validate: (value, inputs) => {
              if (value !== inputs.password) return 'Passwords do not match'
            },
          })}
          label="Confirm password"
          type="password"
          fullWidth
          variant="filled"
          disabled={isSubmitting}
          {...getTextFieldErrorFields(errors.passwordConfirmation)}
        />
      </Stack>

      <FlowNavigation
        backButtonOptions={{
          label: 'Back',
          onClick: () => setCurrentStage(CreateWalletStage.MNEMONIC),
          disabled: isSubmitting,
        }}
        nextButtonOptions={{
          label: 'Create wallet',
          onClick: handleSubmit(onSubmit),
          isLoading: isSubmitting,
          icon: <SendIcon />,
        }}
      />

      {errors.root && (
        <Alert severity="error" sx={{mt: 2}}>
          {errors.root.message || 'Creating wallet failed'}
        </Alert>
      )}
    </Box>
  )
}
