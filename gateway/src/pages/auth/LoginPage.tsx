import LoginIcon from '@mui/icons-material/Login'
import {LoadingButton} from '@mui/lab'
import {Alert, Button, Stack, TextField, Typography} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {NetworkName} from '@wingriders/cab/types'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {Page} from '../../components/Page'
import {decryptData} from '../../helpers/encryption'
import {getTextFieldErrorFields} from '../../helpers/forms'
import {getWalletData, initWallet} from '../../helpers/wallet'
import {useCreatedWalletStore} from '../../store/createdWallet'
import {useWalletDataStore} from '../../store/walletData'

type Inputs = {
  password: string
}

export const LoginPage = () => {
  const navigate = useNavigate()

  const createdWallet = useCreatedWalletStore((s) => s.createdWallet)
  const setWalletData = useWalletDataStore((s) => s.setWalletData)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setError,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!createdWallet) throw new Error('Wallet is not created')

    let mnemonic: string
    try {
      const mnemonicBuffer = await decryptData(
        Buffer.from(createdWallet.encryptedMnemonic, 'hex'),
        data.password,
        Buffer.from(createdWallet.salt, 'hex'),
        Buffer.from(createdWallet.iv, 'hex'),
      )
      mnemonic = mnemonicBuffer.toString()
    } catch {
      setError('password', {
        message: 'Invalid password',
      })
      return
    }

    try {
      const {account} = await initWallet({
        mnemonic,
        network: NetworkName.PREPROD,
      })

      setWalletData(getWalletData(account))
      navigate({to: '/', replace: true})
    } catch (e: any) {
      const message = e.message
      setError('root', {
        message:
          message && typeof message === 'string'
            ? `Login failed: ${e.message}`
            : 'Login failed',
      })
    }
  }

  return (
    <Page showHeader headerProps={{showWalletActions: false}}>
      <Typography variant="h3">Login</Typography>

      <Typography mt={4} mb={3} variant="h5">
        Enter your password
      </Typography>

      <TextField
        {...register('password', {
          required: true,
        })}
        label="Password"
        type="password"
        variant="filled"
        fullWidth
        disabled={isSubmitting}
        {...getTextFieldErrorFields(errors.password)}
      />

      <Stack mt={4} alignItems="center" spacing={3}>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
          endIcon={<LoginIcon />}
          loadingPosition="end"
          sx={{width: '20%', maxWidth: '300px'}}
        >
          Login
        </LoadingButton>

        <Button
          variant="text"
          onClick={() => navigate({to: '/auth/create-wallet'})}
        >
          Create new wallet
        </Button>
      </Stack>

      {errors.root && (
        <Alert severity="error" sx={{mt: 2}}>
          {errors.root.message || 'Login failed'}
        </Alert>
      )}
    </Page>
  )
}
