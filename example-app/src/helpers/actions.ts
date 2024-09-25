import type * as api from '@wingriders/cab/dappConnector'
import {
  evaluateTxBodyFactory,
  getEvaluatedTxPlan,
  validityIntervalToSlots,
} from '@wingriders/cab/helpers'
import {hasSpendingScript} from '@wingriders/cab/ledger/address'
import {
  type ShelleyTxAux,
  type TxSigned,
  getTxPlan,
  prepareTxAux,
  prepareTxWitnessSet,
  signedTransaction,
} from '@wingriders/cab/ledger/transaction'
import type {
  Network,
  TxPlanArgs,
  TxWitnessSet,
  UTxO,
} from '@wingriders/cab/types'
import {
  normalizeTx,
  reverseAddress,
  reverseUtxos,
  reverseVKeyWitnesses,
} from '@wingriders/cab/wallet/connector'

import {calculateValidityInterval} from './validityInterval'
import {getWalletOwner} from './wallet'

interface BuildTxProps {
  jsApi: api.JsAPI
  planArgs: TxPlanArgs
  network: Network
  apiServerUrl?: string
  // UTxOs that will not be used to build the tx
  ignoredUTxOs?: api.TxInput[]
}

export type BuiltTxInfo = {
  tx: api.Transaction
  txAux: ShelleyTxAux
  txWitnessSet: TxWitnessSet
}

export const buildTx = async ({
  jsApi,
  planArgs,
  network,
  apiServerUrl,
  ignoredUTxOs,
}: BuildTxProps): Promise<BuiltTxInfo> => {
  const changeAddress = reverseAddress(await getWalletOwner(jsApi))

  const canBeUsed = (utxo: Pick<UTxO, 'txHash' | 'outputIndex'>) =>
    !ignoredUTxOs ||
    ignoredUTxOs.findIndex(
      ({txHash, index}) =>
        txHash === utxo.txHash && index.toNumber() === utxo.outputIndex,
    ) === -1

  const utxos = reverseUtxos(
    await jsApi.getUtxos({withoutLocked: true}),
  ).filter(canBeUsed)
  const needsCollateral =
    planArgs.inputs?.some((input) => input.isScript) || !!planArgs.mint?.length
  const walletCollaterals =
    !planArgs.potentialCollaterals && needsCollateral
      ? reverseUtxos(await jsApi.getCollateral())
      : undefined

  const txPlanResult = apiServerUrl
    ? await getEvaluatedTxPlan({
        txPlanArgs: {potentialCollaterals: walletCollaterals, ...planArgs},
        utxos,
        changeAddress,
        evaluateTxBodyFn: evaluateTxBodyFactory(apiServerUrl),
        ...(planArgs.validityInterval
          ? validityIntervalToSlots(network, planArgs.validityInterval)
          : {}),
      })
    : getTxPlan(
        {potentialCollaterals: walletCollaterals, ...planArgs},
        utxos,
        changeAddress,
      )

  if (txPlanResult.success === false) {
    const origErrorMessage = txPlanResult.error?.message
    const errorMessage = [
      'Unable to create tx',
      `Reason: ${txPlanResult.error?.reason ?? txPlanResult.error?.code ?? 'internal'}`,
      ...(origErrorMessage ? [`Message: ${origErrorMessage}`] : []),
    ].join('. ')
    throw new Error(errorMessage)
  }

  const validityInterval =
    planArgs.validityInterval || calculateValidityInterval(network)
  const {validityIntervalStart, ttl} = validityIntervalToSlots(
    network,
    validityInterval,
  )

  const txAux = prepareTxAux(txPlanResult.txPlan, ttl, validityIntervalStart)

  const txWitnessSet = prepareTxWitnessSet(txPlanResult.txPlan)
  const tx = normalizeTx(txAux, txWitnessSet)

  return {tx, txAux, txWitnessSet}
}

type SignTxProps = {
  jsApi: api.JsAPI
} & BuiltTxInfo

export type SignedTxInfo = {
  signedTx: api.Transaction
  cborizedTx: TxSigned
  txHash: api.TxHash
}

export const signTx = async ({
  jsApi,
  tx,
  txAux,
  txWitnessSet,
}: SignTxProps): Promise<SignedTxInfo> => {
  const txHash = txAux.getId() as api.TxHash

  const hasScriptInputs = txAux.inputs.some((utxo) =>
    hasSpendingScript(utxo.address),
  )
  const signatures = await jsApi.signTx(tx, txHash, {
    partialSign: hasScriptInputs,
  })
  // only use the signatures from the returned witness set
  const txWitnessSetWithSignatures: TxWitnessSet = {
    ...txWitnessSet,
    vKeyWitnesses: reverseVKeyWitnesses(signatures.vKeyWitnesses || []),
  }

  const signedTx = normalizeTx(txAux, txWitnessSetWithSignatures)
  const cborizedTx = signedTransaction(txAux, txWitnessSetWithSignatures)

  return {
    signedTx,
    cborizedTx,
    txHash: cborizedTx.txHash as api.TxHash,
  }
}
