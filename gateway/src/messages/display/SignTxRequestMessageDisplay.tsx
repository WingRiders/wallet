import {useQuery as useApolloQuery} from '@apollo/client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {AdaAsset} from '@wingriders/cab/constants'
import type {TxInput} from '@wingriders/cab/dappConnector'
import {assetId, networkNameToNetworkId} from '@wingriders/cab/helpers'
import {
  invertValue,
  tokenBundleToValue,
  tokenToAsset,
  valueAdd,
  valueToLovelace,
  valueToTokenBundle,
} from '@wingriders/cab/ledger/assets'
import type {Address} from '@wingriders/cab/types'
import {reverseTx} from '@wingriders/cab/wallet/connector'
import {type UTxOResponse, parseUTxOResponse} from '@wingriders/wallet-common'
import {useMemo} from 'react'
import {AssetQuantityDisplay} from '../../components/AssetQuantityDisplay'
import {DiffDisplay} from '../../components/DiffDisplay'
import {Skeleton} from '../../components/Skeleton'
import {cabServerUrlByNetwork} from '../../config'
import {assetsMetadataQuery} from '../../metadata/queries'
import {useCreatedWalletStore} from '../../store/createdWallet'
import {useWalletDataStore} from '../../store/walletData'
import {parseTransactionCbor} from '../../transaction/parseCbor'
import {MessageDisplayParent} from './MessageDisplayParent'
import type {ConcreteMessageDisplayProps} from './types'

const fetchUtxosByReferences = async (
  cabServerUrl: string,
  inputs: readonly TxInput[],
) => {
  const utxosResponse: UTxOResponse[] = await fetch(
    `${cabServerUrl}/utxos?references=${inputs
      .map(({txHash, index}) =>
        encodeURIComponent(`${txHash}#${index.toString()}`),
      )
      .join(',')}`,
  ).then((res) => res.json())
  return utxosResponse.map(parseUTxOResponse)
}

export const SignTxRequestMessageDisplay = ({
  item,
  isLoading,
  onAllow,
  onReject,
}: ConcreteMessageDisplayProps<'SIGN_TX_REQUEST'>) => {
  const network = useCreatedWalletStore((s) => s.network)
  const addresses = useWalletDataStore((s) => s.addresses)

  const {transaction, txHash} = useMemo(() => {
    const transaction = parseTransactionCbor(
      item.message.payload.tx,
      networkNameToNetworkId[network],
    )
    return {
      transaction,
      txHash: reverseTx(transaction, []).getId(),
    }
  }, [item.message.payload.tx, network])

  const {data: txUtxos, isLoading: isLoadingInputUtxos} = useQuery({
    queryKey: [
      'utxos-by-references',
      [
        ...Array.from(transaction.body.inputs),
        ...(transaction.body.collateralInputs
          ? Array.from(transaction.body.collateralInputs)
          : []),
      ],
    ] as const,
    queryFn: async ({queryKey}) =>
      fetchUtxosByReferences(cabServerUrlByNetwork[network], queryKey[1]),
  })

  const userAddresses = useMemo(() => {
    if (!addresses) return undefined

    const {usedAddresses, unusedAddresses, changeAddress, rewardAddresses} =
      addresses
    return new Set([
      ...usedAddresses,
      ...unusedAddresses,
      changeAddress,
      ...rewardAddresses,
    ])
  }, [addresses])

  const reversedTx = useMemo(() => {
    if (!txUtxos) return undefined

    return reverseTx(transaction, txUtxos)
  }, [txUtxos, transaction])

  const userDiffValue = useMemo(() => {
    if (!reversedTx || !userAddresses) return undefined

    const matchUserUtxo = (utxo: {address: Address}) =>
      userAddresses.has(utxo.address)
    const userInputs = reversedTx.inputs.filter(matchUserUtxo)
    const userOutputs = reversedTx.outputs.filter(matchUserUtxo)

    const userInputValue = valueAdd(
      ...userInputs.map((i) => tokenBundleToValue(i.tokenBundle, i.coins)),
    )
    const userOutputValue = valueAdd(
      ...userOutputs.map((o) => tokenBundleToValue(o.tokenBundle, o.coins)),
    )

    const userDiffValue = valueAdd(invertValue(userInputValue), userOutputValue)

    return {
      lovelace: valueToLovelace(userDiffValue),
      tokens: valueToTokenBundle(userDiffValue, {withoutZero: true}),
    }
  }, [reversedTx, userAddresses])

  const {data: assetsMetadata, loading: isLoadingAssetsMetadata} =
    useApolloQuery(assetsMetadataQuery, {
      variables: userDiffValue
        ? {assets: userDiffValue.tokens.map(tokenToAsset)}
        : undefined,
    })

  const isLoadingData = isLoadingInputUtxos || isLoadingAssetsMetadata

  // if the transaction is made for a different network than the wallet's network, no UTxOs are fetched.
  const isTxValid = txUtxos && txUtxos.length > 0

  return (
    <MessageDisplayParent
      onAllow={onAllow}
      onReject={onReject}
      isLoading={isLoading}
      disabled={isLoadingData || !isTxValid || !userAddresses}
      title="Sign transaction request"
      allowText="Sign"
    >
      <Typography sx={{mb: 2}}>
        <Link href={item.origin} target="_blank">
          {item.origin}
        </Link>{' '}
        is requesting to sign transaction.
      </Typography>

      <Skeleton if={isLoadingData} fullWidth>
        {!userAddresses && (
          <Alert severity="error">
            Wallet not found, please login to your wallet again.
          </Alert>
        )}

        {isTxValid ? (
          <Stack bgcolor={({palette}) => palette.background.paper} p={2}>
            {userDiffValue && assetsMetadata ? (
              <>
                <Typography variant="h4">
                  <DiffDisplay diff={userDiffValue.lovelace}>
                    <AssetQuantityDisplay
                      token={{
                        ...AdaAsset,
                        quantity: userDiffValue.lovelace,
                      }}
                      options={{showSignIfPositive: true}}
                    />
                  </DiffDisplay>
                </Typography>

                <Stack>
                  {userDiffValue.tokens.map((token) => (
                    <Typography key={assetId(token)} variant="body1">
                      <DiffDisplay diff={token.quantity}>
                        <AssetQuantityDisplay
                          token={token}
                          options={{showSignIfPositive: true}}
                        />
                      </DiffDisplay>
                    </Typography>
                  ))}
                </Stack>
              </>
            ) : (
              '-'
            )}
          </Stack>
        ) : (
          <Alert severity="error">
            Invalid transaction, please make sure your wallet is on the expected
            network.
          </Alert>
        )}
      </Skeleton>

      <Box bgcolor={({palette}) => palette.background.paper} p={2} mt={3}>
        <Typography variant="body2" sx={{overflowWrap: 'break-word'}}>
          Transaction hash: {txHash}
        </Typography>
      </Box>

      <Box sx={{mt: 1}}>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={({palette}) => ({bgcolor: palette.background.paper})}
          >
            <Typography variant="body2">Transaction CBOR</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={({palette}) => ({bgcolor: palette.background.paper})}
          >
            <Typography variant="body2" sx={{overflowWrap: 'break-word'}}>
              {item.message.payload.tx}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </MessageDisplayParent>
  )
}
