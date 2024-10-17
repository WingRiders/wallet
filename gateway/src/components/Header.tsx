import {AppBar, Button, Stack, Typography} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useWalletDataStore} from '../store/walletData'

export type HeaderProps = {
  showWalletActions?: boolean
}

export const Header = ({showWalletActions = true}: HeaderProps) => {
  const navigate = useNavigate()
  const setCreatedWallet = useCreatedWalletStore((s) => s.setCreatedWallet)
  const setWalletData = useWalletDataStore((s) => s.setWalletData)

  return (
    <AppBar position="sticky" sx={{px: 4, py: 2}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">WingRiders Wallet</Typography>

        {showWalletActions && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              onClick={() => {
                setCreatedWallet(null)
                navigate({to: '/auth/create-wallet', replace: true})
              }}
              variant="text"
              size="small"
            >
              Discard wallet
            </Button>
            <Button
              onClick={() => {
                setWalletData(null)
                navigate({to: '/auth/login', replace: true})
              }}
              variant="outlined"
            >
              Login out
            </Button>
          </Stack>
        )}
      </Stack>
    </AppBar>
  )
}
