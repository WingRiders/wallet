import {Button} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {useShallow} from 'zustand/shallow'
import {useCreatedWalletStore} from '../../store/createdWallet'
import {useWalletDataStore} from '../../store/walletData'

export const HomePage = () => {
  const navigate = useNavigate()
  const setCreatedWallet = useCreatedWalletStore((s) => s.setCreatedWallet)
  const [walletData, setWalletData] = useWalletDataStore(
    useShallow((s) => [s.walletData, s.setWalletData]),
  )

  return (
    <div>
      <h1>Home</h1>
      <div>
        <pre>{JSON.stringify(walletData, null, 2)}</pre>
      </div>
      <Button
        onClick={() => {
          setWalletData(null)
          navigate({to: '/auth/login', replace: true})
        }}
      >
        Login out
      </Button>
      <Button
        onClick={() => {
          setCreatedWallet(null)
          navigate({to: '/auth/create-wallet', replace: true})
        }}
      >
        Discard wallet
      </Button>
    </div>
  )
}
