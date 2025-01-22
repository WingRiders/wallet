import {type ReactNode, useNavigate} from '@tanstack/react-router'
import {NetworkName} from '@wingriders/cab/types'
import {useShallow} from 'zustand/shallow'
import {config} from '../config'
import {useCreatedWalletStore} from '../store/createdWallet'
import {useWalletDataStore} from '../store/walletData'
import {Dropdown, type DropdownProps} from './Dropdown/Dropdown'
import {DropdownItem} from './Dropdown/DropdownItem'
import {Label} from './Typography/Label'

type NetworkSwitchProps = {
  renderSingleNetwork?: (network: NetworkName) => ReactNode
  size?: DropdownProps<NetworkName>['size']
}

export const NetworkSwitch = ({
  renderSingleNetwork,
  size,
}: NetworkSwitchProps) => {
  const navigate = useNavigate()
  const {network, setNetwork} = useCreatedWalletStore(
    useShallow(({network, setNetwork}) => ({
      network,
      setNetwork,
    })),
  )
  const clearWalletData = useWalletDataStore(useShallow(({clear}) => clear))

  return config.NETWORK ? (
    (renderSingleNetwork?.(config.NETWORK) ?? (
      <Label>Network: {config.NETWORK}</Label>
    ))
  ) : (
    <Dropdown
      value={network}
      onChange={(e) => {
        setNetwork(e as NetworkName)
        clearWalletData()
        navigate({to: '/auth/login', replace: true})
      }}
      colorVariant="paper"
      size={size}
    >
      <DropdownItem value={NetworkName.PREPROD} label="Preprod" />
      <DropdownItem value={NetworkName.MAINNET} label="Mainnet" />
    </Dropdown>
  )
}
