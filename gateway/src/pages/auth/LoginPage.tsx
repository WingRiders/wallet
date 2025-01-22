import LoginIcon from '@mui/icons-material/Login'
import {Alert, Stack} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {TextButton} from '../../components/Buttons/TextButton'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {decryptData} from '../../helpers/encryption'
import {getErrorMessage} from '../../helpers/forms'
import {getWalletData, initWallet} from '../../helpers/wallet'
import {useCreatedWalletStore} from '../../store/createdWallet'
import {useWalletDataStore} from '../../store/walletData'

type Inputs = {
  password: string
}

export const LoginPage = () => {
  const navigate = useNavigate()

  const {createdWallet, setCreatedWallet, network} = useCreatedWalletStore(
    useShallow(({createdWallet, setCreatedWallet, network}) => ({
      createdWallet,
      setCreatedWallet,
      network,
    })),
  )
  const {setWalletData, clear: clearWalletData} = useWalletDataStore(
    useShallow(({setWalletData, clear}) => ({setWalletData, clear})),
  )

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
        network,
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
    <Page showHeader headerProps={{showNetwork: true}}>
      <Paper title="Login">
        <FormField label="Password" error={getErrorMessage(errors.password)}>
          <InputField
            {...register('password', {
              required: true,
            })}
            type="password"
            colorVariant="paper"
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
        </FormField>

        <Stack mt={4} alignItems="center" spacing={3}>
          <Button
            color="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting && 'centered'}
            disabled={isSubmitting}
            icon={<LoginIcon fontSize="small" />}
            sx={{width: '20%', maxWidth: '300px'}}
          >
            Login
          </Button>

          <TextButton
            onClick={() => {
              setCreatedWallet(null)
              clearWalletData()
              return navigate({to: '/auth/create-wallet'})
            }}
            disabled={isSubmitting}
          >
            Create new wallet
          </TextButton>
        </Stack>

        {errors.root && (
          <Alert severity="error" sx={{mt: 2}}>
            {errors.root.message || 'Login failed'}
          </Alert>
        )}
      </Paper>
    </Page>
  )
}
