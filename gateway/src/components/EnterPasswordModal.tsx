import LoginIcon from '@mui/icons-material/Login'
import {LoadingButton} from '@mui/lab'
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import {NetworkName} from '@wingriders/cab/types'
import type {Wallet} from '@wingriders/cab/wallet'
import {useEffect} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {decryptData} from '../helpers/encryption'
import {getTextFieldErrorFields} from '../helpers/forms'
import {initWallet} from '../helpers/wallet'
import {useCreatedWalletStore} from '../store/createdWallet'

type EnterPasswordModalProps = {
  open: boolean
  onClose: () => void
  onLogin: (wallet: Wallet) => void
}

type Inputs = {
  password: string
}

export const EnterPasswordModal = ({
  open,
  onClose,
  onLogin,
}: EnterPasswordModalProps) => {
  const createdWallet = useCreatedWalletStore((s) => s.createdWallet)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setError,
    reset,
  } = useForm<Inputs>()

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

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
      const {wallet} = await initWallet({
        mnemonic,
        network: NetworkName.PREPROD,
      })
      onLogin(wallet)
      onClose()
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter your password</DialogTitle>
      <DialogContent sx={{minWidth: '500px'}}>
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

        {errors.root && (
          <Alert severity="error" sx={{mt: 2}}>
            {errors.root.message || 'Login failed'}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  )
}
