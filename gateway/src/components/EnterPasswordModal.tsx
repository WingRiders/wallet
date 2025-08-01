import LoginIcon from '@mui/icons-material/Login'
import {Alert} from '@mui/material'
import type {JsCryptoProvider} from '@wingriders/cab/crypto'
import type {Wallet} from '@wingriders/cab/wallet'
import {useEffect} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {decryptData} from '../helpers/encryption'
import {getErrorMessage} from '../helpers/forms'
import {initWallet} from '../helpers/wallet'
import {useCreatedWalletStore} from '../store/createdWallet'
import {Button} from './Buttons/Button'
import {FormField} from './FormField'
import {InputField} from './InputField'
import {Modal} from './Modals/Modal'

type EnterPasswordModalProps = {
  open: boolean
  onClose: () => void
  onLogin: (wallet: Wallet, cryptoProvider: JsCryptoProvider) => void
}

type Inputs = {
  password: string
}

export const EnterPasswordModal = ({
  open,
  onClose,
  onLogin,
}: EnterPasswordModalProps) => {
  const {createdWallet, network} = useCreatedWalletStore(
    useShallow(({createdWallet, network}) => ({createdWallet, network})),
  )

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
      const {wallet, cryptoProvider} = await initWallet({
        mnemonic,
        network,
      })
      onLogin(wallet, cryptoProvider)
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
    <Modal
      open={open}
      onClose={onClose}
      title="Enter your password"
      actions={
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting && 'centered'}
          disabled={isSubmitting}
          icon={<LoginIcon fontSize="inherit" />}
          sx={{minWidth: 150}}
        >
          Login
        </Button>
      }
      actionsSx={{my: 2}}
      width={500}
      disableFullScreenOnMobile
    >
      <FormField label="Password" error={getErrorMessage(errors.password)}>
        <InputField
          {...register('password', {
            required: true,
          })}
          type="password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
      </FormField>

      {errors.root && (
        <Alert severity="error" sx={{mt: 2}}>
          {errors.root.message || 'Login failed'}
        </Alert>
      )}
    </Modal>
  )
}
