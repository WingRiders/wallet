import {
  AppBar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import {useNavigate} from '@tanstack/react-router'
import {NetworkName} from '@wingriders/cab/types'
import {useShallow} from 'zustand/shallow'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useWalletDataStore} from '../store/walletData'

export type HeaderProps = {
  showWalletActions?: boolean
}

export const Header = ({showWalletActions = true}: HeaderProps) => {
  const navigate = useNavigate()
  const {setCreatedWallet, network, setNetwork} = useCreatedWalletStore(
    useShallow(({setCreatedWallet, network, setNetwork}) => ({
      setCreatedWallet,
      network,
      setNetwork,
    })),
  )
  const {setWalletData, clear: clearWalletData} = useWalletDataStore(
    useShallow(({setWalletData, clear}) => ({setWalletData, clear})),
  )

  return (
    <AppBar position="sticky" sx={{px: 4, py: 2}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">WingRiders Wallet</Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <FormControl sx={{minWidth: '120px'}}>
            <InputLabel id="network-select-label">Network</InputLabel>
            <Select
              labelId="network-select-label"
              value={network}
              label="Network"
              size="small"
              onChange={(e) => {
                setNetwork(e.target.value as NetworkName)
                clearWalletData()
                navigate({to: '/auth/login', replace: true})
              }}
            >
              <MenuItem value={NetworkName.PREPROD}>Preprod</MenuItem>
              <MenuItem value={NetworkName.MAINNET}>Mainnet</MenuItem>
            </Select>
          </FormControl>

          {showWalletActions && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                onClick={() => {
                  setCreatedWallet(null)
                  clearWalletData()
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
      </Stack>
    </AppBar>
  )
}
