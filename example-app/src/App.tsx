import {LoadingButton} from '@mui/lab'
import {Alert, Stack} from '@mui/material'
import {NETWORKS} from '@wingriders/cab/constants'
import type {
  HexString,
  JsAPI,
  StandardWallet as StandardWalletApi,
  TxHash,
} from '@wingriders/cab/dappConnector'
import {
  BigNumber,
  type Lovelace,
  NetworkName,
  type TxPlanArgs,
} from '@wingriders/cab/types'
import {
  CborToJsApiBridge,
  reverseAddress,
} from '@wingriders/cab/wallet/connector'
import {initDappPlugin} from '@wingriders/wallet-dapp-plugin'
import {useState} from 'react'
import {buildTx, signTx} from './helpers/actions'
import {getWalletOwner} from './helpers/wallet'
import {getCachedProtocolParameters} from './protocolParameters/protocolParameters'

declare const window: typeof globalThis.window & {
  cardano?: {
    wrWallet?: StandardWalletApi
    [key: string]: unknown
  }
}

export const App = () => {
  const [jsApi, setJsApi] = useState<JsAPI | null>(null)
  const [exampleTxResult, setExampleTxResult] = useState<{
    isSuccess: boolean
    message: string
  } | null>(null)
  const [isLoadingConnect, setIsLoadingConnect] = useState(false)
  const [isLoadingExampleTx, setIsLoadingExampleTx] = useState(false)

  const handleConnectWallet = async () => {
    try {
      setIsLoadingConnect(true)
      initDappPlugin({
        gatewayUrl: 'http://localhost:5173',
        cabBackendUrlByNetwork: {
          preprod: 'http://127.0.0.1:3000',
          mainnet: 'http://127.0.0.1:3000',
        },
      })
      const wrWallet = window.cardano?.wrWallet
      if (!wrWallet) {
        setIsLoadingConnect(false)
        return
      }

      const cborApi = await wrWallet.enable()
      const jsApi = new CborToJsApiBridge(cborApi)
      setJsApi(jsApi)
      setIsLoadingConnect(false)
    } catch (e) {
      setIsLoadingConnect(false)
      throw e
    }
  }

  const handleDisconnectWallet = () => {
    setJsApi(null)
  }

  const handleCreateExampleTransaction = async () => {
    if (!jsApi) return

    try {
      setIsLoadingExampleTx(true)
      const ownerHexAddress = await getWalletOwner(jsApi)
      const ownerBechAddress = reverseAddress(ownerHexAddress)
      const protocolParameters = await getCachedProtocolParameters()

      const planArgs: TxPlanArgs = {
        planId: 'example',
        outputs: [
          {
            address: ownerBechAddress,
            coins: new BigNumber(2_000_000) as Lovelace,
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
      const {cborizedTx} = await signTx({
        jsApi,
        tx,
        txAux,
        txWitnessSet,
      })
      const txHash = await jsApi.submitRawTx(
        cborizedTx.txBody as HexString,
        cborizedTx.txHash as TxHash,
      )
      setExampleTxResult({
        isSuccess: true,
        message: `Example transaction created: ${txHash}`,
      })
    } catch (e: any) {
      const message = e.message
      setExampleTxResult({
        isSuccess: false,
        message:
          message && typeof message === 'string'
            ? `Transaction failed: ${e.message}`
            : 'Transaction failed',
      })
    }
    setIsLoadingExampleTx(false)
  }

  return (
    <Stack alignItems="flex-start" spacing={4} p={3}>
      <LoadingButton
        variant={jsApi ? 'outlined' : 'contained'}
        onClick={jsApi ? handleDisconnectWallet : handleConnectWallet}
        loading={isLoadingConnect}
      >
        {jsApi ? 'Disconnect wallet' : 'Connect WingRiders wallet'}
      </LoadingButton>

      {jsApi && (
        <Stack alignItems="flex-start" spacing={1}>
          <LoadingButton
            onClick={handleCreateExampleTransaction}
            variant="contained"
            loading={isLoadingExampleTx}
          >
            Create example transaction example
          </LoadingButton>

          {exampleTxResult && (
            <Alert
              onClose={() => setExampleTxResult(null)}
              severity={exampleTxResult.isSuccess ? 'success' : 'error'}
            >
              {exampleTxResult.message}
            </Alert>
          )}
        </Stack>
      )}
    </Stack>
  )
}
