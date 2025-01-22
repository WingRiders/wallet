import SendIcon from '@mui/icons-material/Send'
import {Alert, Box, Stack} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {FlowNavigation} from '../../../components/FlowNavigation'
import {FormField} from '../../../components/FormField'
import {InputField} from '../../../components/InputField'
import {Paragraph} from '../../../components/Typography/Paragraph'
import {encryptData} from '../../../helpers/encryption'
import {getErrorMessage} from '../../../helpers/forms'
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
      <Paragraph variant="large" mb={5}>
        Create a new password for your wallet. This password will be required
        for every interaction with your wallet.
      </Paragraph>

      <Stack spacing={2}>
        <FormField label="Password" error={getErrorMessage(errors.password)}>
          <InputField
            {...register('password', {
              required: true,
              validate: validatePassword,
            })}
            type="password"
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
        </FormField>
        <FormField
          label="Confirm password"
          error={getErrorMessage(errors.passwordConfirmation)}
        >
          <InputField
            {...register('passwordConfirmation', {
              required: true,
              validate: (value, inputs) => {
                if (value !== inputs.password) return 'Passwords do not match'
              },
            })}
            type="password"
            placeholder="Confirm your password"
            disabled={isSubmitting}
          />
        </FormField>
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
          icon: <SendIcon fontSize="small" />,
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
