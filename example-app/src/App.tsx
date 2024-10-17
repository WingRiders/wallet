import {LoadingButton} from '@mui/lab'
import {Alert, Stack, Typography} from '@mui/material'
import {ADA_DECIMALS, AdaAsset, NETWORKS} from '@wingriders/cab/constants'
import type {
  HexString,
  JsAPI,
  StandardWallet as StandardWalletApi,
  TxHash,
} from '@wingriders/cab/dappConnector'
import {networkIdToNetworkName} from '@wingriders/cab/helpers'
import {assetQuantity} from '@wingriders/cab/ledger/assets'
import {
  BigNumber,
  type Lovelace,
  type NetworkName,
  type TxPlanArgs,
  type UTxO,
} from '@wingriders/cab/types'
import {
  CborToJsApiBridge,
  reverseAddress,
  reverseUtxos,
  reverseValue,
} from '@wingriders/cab/wallet/connector'
import {initDappPlugin} from '@wingriders/wallet-dapp-plugin'
import {useState} from 'react'
import {Section} from './components/Section'
import {config} from './config'
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
  const [walletData, setWalletData] = useState<{
    jsApi: JsAPI
    networkName: NetworkName
    lovelaceBalance: BigNumber
    address: string
    utxos: UTxO[]
  } | null>(null)
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
        gatewayUrl: config.GATEWAY_URL,
        cabBackendUrlByNetwork: {
          preprod: config.CAB_SERVER_URL_PREPROD,
          mainnet: config.CAB_SERVER_URL_MAINNET,
        },
      })
      const wrWallet = window.cardano?.wrWallet
      if (!wrWallet) {
        setIsLoadingConnect(false)
        return
      }

      const cborApi = await wrWallet.enable()
      const jsApi = new CborToJsApiBridge(cborApi)
      const networkName = networkIdToNetworkName[await jsApi.getNetworkId()]
      const balanceValue = reverseValue(await jsApi.getBalance())
      const lovelaceBalance = assetQuantity(balanceValue, AdaAsset)
      const address = reverseAddress(await getWalletOwner(jsApi))
      const utxos = reverseUtxos(await jsApi.getUtxos())

      setWalletData({networkName, jsApi, lovelaceBalance, address, utxos})
      setIsLoadingConnect(false)
    } catch (e) {
      setIsLoadingConnect(false)
      throw e
    }
  }

  const handleDisconnectWallet = () => {
    setWalletData(null)
  }

  const handleCreateExampleTransaction = async () => {
    if (!walletData) return

    try {
      setIsLoadingExampleTx(true)
      const ownerHexAddress = await getWalletOwner(walletData.jsApi)
      const ownerBechAddress = reverseAddress(ownerHexAddress)
      const networkName =
        networkIdToNetworkName[await walletData.jsApi.getNetworkId()]
      const protocolParameters = await getCachedProtocolParameters(networkName)

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
        jsApi: walletData.jsApi,
        planArgs,
        network: NETWORKS[networkName],
      })
      const {cborizedTx} = await signTx({
        jsApi: walletData.jsApi,
        tx,
        txAux,
        txWitnessSet,
      })
      const txHash = await walletData.jsApi.submitRawTx(
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
        variant={walletData?.jsApi ? 'outlined' : 'contained'}
        onClick={
          walletData?.jsApi ? handleDisconnectWallet : handleConnectWallet
        }
        loading={isLoadingConnect}
      >
        {walletData?.jsApi ? 'Disconnect wallet' : 'Connect WingRiders wallet'}
      </LoadingButton>

      {walletData && (
        <Stack alignItems="flex-start" spacing={2}>
          <Section title="ADA balance">
            <Typography variant="body1">
              {walletData.lovelaceBalance.shiftedBy(-ADA_DECIMALS).toFormat()}{' '}
              ADA
            </Typography>
          </Section>

          <Section title="Network">
            <Typography variant="body1">{walletData.networkName}</Typography>
          </Section>

          <Section title="Address">
            <Typography variant="body1">{walletData.address}</Typography>
          </Section>

          <LoadingButton
            onClick={handleCreateExampleTransaction}
            variant="contained"
            loading={isLoadingExampleTx}
          >
            Create example transaction
          </LoadingButton>

          {exampleTxResult && (
            <Alert
              onClose={() => setExampleTxResult(null)}
              severity={exampleTxResult.isSuccess ? 'success' : 'error'}
            >
              {exampleTxResult.message}
            </Alert>
          )}

          <Section title="UTxOs">
            <Stack spacing={2}>
              {walletData.utxos.map(
                ({txHash, outputIndex, coins, tokenBundle}) => (
                  <Stack key={`${txHash}#${outputIndex}`}>
                    <Typography variant="body2">
                      {txHash}#{outputIndex}
                    </Typography>
                    <Typography variant="body1">
                      {coins.shiftedBy(-ADA_DECIMALS).toFormat()} ADA
                      {tokenBundle.length > 0 && ' + tokens'}
                    </Typography>
                  </Stack>
                ),
              )}
            </Stack>
          </Section>
        </Stack>
      )}
    </Stack>
  )
}
