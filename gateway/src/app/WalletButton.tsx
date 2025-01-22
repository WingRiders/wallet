import {useState} from 'react'
import {Button} from '../components/Buttons/Button'
import {shortLabel} from '../helpers/shortLabel'
import {useWalletDataStore} from '../store/walletData'
import {AccountModal} from './AccountModal'

export const WalletButton = () => {
  const [showAccountModal, setShowAccountModal] = useState(false)

  const addresses = useWalletDataStore(({addresses}) => addresses)
  const address = addresses?.usedAddresses[0] ?? addresses?.unusedAddresses[0]

  return (
    <>
      <Button
        onClick={() => setShowAccountModal(true)}
        color="secondary"
        sx={{textTransform: 'none'}}
      >
        {address ? shortLabel(address, 13, 5) : 'unknown'}
      </Button>

      <AccountModal
        open={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </>
  )
}
