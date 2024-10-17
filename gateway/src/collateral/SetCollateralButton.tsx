import {LoadingButton} from '@mui/lab'
import {NETWORKS} from '@wingriders/cab/constants'
import {adaToLovelace} from '@wingriders/cab/helpers'
import {
  BigNumber,
  type Lovelace,
  NetworkName,
  type TxPlanArgs,
} from '@wingriders/cab/types'
import type {Wallet} from '@wingriders/cab/wallet'
import {WalletConnector, reverseAddress} from '@wingriders/cab/wallet/connector'
import {useState} from 'react'
import {EnterPasswordModal} from '../components/EnterPasswordModal'
import {buildTx, signTx, submitTx} from '../helpers/actions'
import {getWalletOwner} from '../helpers/wallet'
import {useWalletDataStore} from '../store/walletData'
import type {ResultType} from '../types'

const COLLATERAL_QUANTITY = new BigNumber(adaToLovelace(5))

type SetCollateralButtonProps = {
  onCreate: (result: ResultType) => void
}

export const SetCollateralButton = ({onCreate}: SetCollateralButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const setCollateral = useWalletDataStore((s) => s.setCollateral)

  const handleCreate = async (wallet: Wallet) => {
    try {
      setIsLoading(true)
      const walletConnector = new WalletConnector(wallet, 'Wallet', 'icon')
      const jsApi = await walletConnector.enableJs()
      const protocolParameters = await wallet.getProtocolParameters()

      const ownerHexAddress = await getWalletOwner(jsApi)
      const ownerBechAddress = reverseAddress(ownerHexAddress)

      const planArgs: TxPlanArgs = {
        planId: 'createCollateral',
        outputs: [
          {
            address: ownerBechAddress,
            coins: COLLATERAL_QUANTITY as Lovelace,
            tokenBundle: [],
          },
        ],
        protocolParameters,
      }

      const {tx, txAux, txWitnessSet} = await buildTx({
        jsApi,
        planArgs,
        network: NETWORKS[NetworkName.PREPROD],
      })
      const {cborizedTx, txHash} = await signTx({
        jsApi,
        tx,
        txAux,
        txWitnessSet,
      })
      await submitTx(cborizedTx.txBody)
      setCollateral({txHash, outputIndex: 0})
      onCreate({isSuccess: true})
    } catch (e: any) {
      const message = e.message
      onCreate({
        isSuccess: false,
        errorMessage:
          message && typeof message === 'string' ? e.message : undefined,
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      <LoadingButton
        onClick={() => setIsPasswordModalOpen(true)}
        loading={isLoading}
      >
        Set collateral
      </LoadingButton>
      <EnterPasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onLogin={handleCreate}
      />
    </>
  )
}