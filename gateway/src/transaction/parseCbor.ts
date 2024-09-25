import {AdaAsset} from '@wingriders/cab/constants'
import {
  type Address,
  type AddressKeyHash,
  NetworkId as ApiNetworkId,
  type AssetName,
  type Coin,
  type Hash32,
  type HexString,
  type MintValue,
  type PlutusDatum,
  type PlutusScript,
  type PolicyId,
  type Transaction,
  type TxBody,
  type TxHash,
  type TxInput,
  type TxOutput,
  TxOutputDatumType,
  type TxOutputPostAlonzo,
  TxOutputType,
  type TxScriptRef,
  type TxWitnessSet,
  type UInt,
  type Value,
  type Withdrawals,
} from '@wingriders/cab/dappConnector'
import {
  CborInt64,
  CborizedTxDatum,
  TxBodyKey,
} from '@wingriders/cab/ledger/transaction'
import {BigNumber, NetworkId, type TxCertificate} from '@wingriders/cab/types'
import {decode, encode} from 'borc'
import type {CborizedTxScriptRef} from './CborizedTxScriptRef'
import {
  type CborizedDatumOption,
  type CborizedTxBody,
  type CborizedTxCertificate,
  type CborizedTxInput,
  type CborizedTxOutput,
  type CborizedTxRedeemer,
  type CborizedTxScript,
  type CborizedTxTokenBundle,
  type CborizedTxValue,
  type CborizedTxWithdrawals,
  type CborizedTxWitnessShelley,
  type CborizedTxWitnesses,
  TxOutputKey,
  TxWitnessKey,
} from './types'

export const parseTransactionCbor = (cbor: string): Transaction => {
  const decoded = decode(cbor)
  if (!Array.isArray(decoded) || decoded.length !== 4)
    throw new Error('Invalid transaction CBOR')

  const [txBody, txWitnessSet, isValid, auxiliaryData] = decoded

  const transaction: Transaction = {
    body: parseTxBody(txBody),
    isValid,
    witnessSet: parseTxWitnessSet(txWitnessSet),
    auxiliaryData,
  }
  return transaction
}

const parseTxBody = (decodedTxBody: CborizedTxBody): TxBody => {
  const inputs = decodedTxBody.get(TxBodyKey.INPUTS) as CborizedTxInput[]
  const outputs = decodedTxBody.get(TxBodyKey.OUTPUTS) as CborizedTxOutput[]
  const fee = new CborInt64(decodedTxBody.get(TxBodyKey.FEE) as number)
  const ttl = new CborInt64(decodedTxBody.get(TxBodyKey.TTL) as number)
  const certificates = decodedTxBody.get(TxBodyKey.CERTIFICATES) as
    | CborizedTxCertificate[]
    | undefined
  const withdrawals = decodedTxBody.get(TxBodyKey.WITHDRAWALS) as
    | CborizedTxWithdrawals[]
    | undefined
  const auxiliaryDataHash = decodedTxBody.get(TxBodyKey.AUXILIARY_DATA_HASH) as
    | Buffer
    | undefined
  const validityIntervalStart = decodedTxBody.get(
    TxBodyKey.VALIDITY_INTERVAL_START,
  )
    ? new CborInt64(
        decodedTxBody.get(TxBodyKey.VALIDITY_INTERVAL_START) as number,
      )
    : undefined
  const requiredSigners = decodedTxBody.get(TxBodyKey.REQUIRED_SIGNERS) as
    | Buffer[]
    | undefined
  const mint = decodedTxBody.get(TxBodyKey.MINT) as
    | CborizedTxTokenBundle
    | undefined

  const collateralInputs = decodedTxBody.get(TxBodyKey.COLLATERAL_INPUTS) as
    | CborizedTxInput[]
    | undefined
  const scriptDataHash = decodedTxBody.get(TxBodyKey.SCRIPT_DATA_HASH) as
    | Buffer
    | undefined
  const networkId = decodedTxBody.get(TxBodyKey.NETWORK_ID) as NetworkId
  const referenceInputs = decodedTxBody.get(
    TxBodyKey.REFERENCE_INPUTS,
  ) as CborizedTxInput[]

  return {
    inputs: parseCborizedInputs(inputs),
    outputs: outputs.map(parseCborizedTxOutput),
    fee: fee.bigNumber as Coin,
    ttl: ttl.bigNumber as UInt,
    certificates: certificates?.map(parseCborizedCertificate),
    withdrawals: withdrawals
      ? parseCborizedWithdrawals(withdrawals)
      : undefined,
    auxiliaryDataHash: auxiliaryDataHash?.toString('hex') as Hash32,
    validityStart: validityIntervalStart?.bigNumber as UInt,
    requiredSigners:
      requiredSigners && requiredSigners.length > 0
        ? new Set(
            requiredSigners.map((s) => s.toString('hex') as AddressKeyHash),
          )
        : undefined,
    mint: mint ? cborizedTxTokenBundleToMintValue(mint) : undefined,
    collateralInputs: collateralInputs
      ? parseCborizedInputs(collateralInputs)
      : undefined,
    scriptDataHash: scriptDataHash?.toString('hex') as Hash32,
    networkId:
      networkId === NetworkId.MAINNET
        ? ApiNetworkId.Mainnet
        : ApiNetworkId.Testnet,
    referenceInputs: referenceInputs
      ? parseCborizedInputs(referenceInputs)
      : undefined,
  }
}

const parseTxWitnessSet = (
  decodedTxWitnesses: CborizedTxWitnesses | object,
): TxWitnessSet => {
  if (!(decodedTxWitnesses instanceof Map)) return {}

  const shelley = decodedTxWitnesses.get(TxWitnessKey.SHELLEY) as
    | CborizedTxWitnessShelley[]
    | undefined
  const datums = decodedTxWitnesses.get(TxWitnessKey.DATA) as
    | CborizedTxDatum[]
    | undefined
  const scriptsV1 = decodedTxWitnesses.get(TxWitnessKey.SCRIPTS_V1) as
    | CborizedTxScript[]
    | undefined
  const scriptsV2 = decodedTxWitnesses.get(TxWitnessKey.SCRIPTS_V2) as
    | CborizedTxScript[]
    | undefined
  const redeemers = decodedTxWitnesses.get(TxWitnessKey.REDEEMERS) as
    | CborizedTxRedeemer[]
    | undefined

  return {
    vKeyWitnesses: shelley?.map(([a, b]) => ({
      publicKey: a.toString('hex') as HexString,
      signature: b.toString('hex') as HexString,
    })),
    plutusDatums: datums?.map((d) => CborizedTxDatum.decode(encode(d))) as
      | PlutusDatum[]
      | undefined,
    redeemers: redeemers?.map(([tag, index, datum, exUnits]) => ({
      data: CborizedTxDatum.decode(encode(datum)) as PlutusDatum,
      exUnits: {
        mem: new BigNumber(exUnits[0]) as UInt,
        steps: new BigNumber(exUnits[1]) as UInt,
      },
      index: new BigNumber(index) as UInt,
      tag: tag as number,
    })),
    plutusV1Scripts: scriptsV1?.map((s) => s.toString('hex') as PlutusScript),
    plutusV2Scripts: scriptsV2?.map((s) => s.toString('hex') as PlutusScript),
  }
}

const parseCborizedInput = (input: CborizedTxInput): TxInput => {
  return {
    txHash: input[0].toString('hex') as TxHash,
    index: new BigNumber(input[1]) as UInt,
  }
}

const parseCborizedInputs = (inputs: CborizedTxInput[]): Set<TxInput> => {
  return new Set(inputs.map(parseCborizedInput))
}

const parseCborizedTxDatumOption = (
  datumOption: CborizedDatumOption,
): TxOutputPostAlonzo['datumOption'] => {
  if (datumOption[0] === 0) {
    return {
      type: TxOutputDatumType.HASH,
      datumHash: datumOption[1].toString('hex') as Hash32,
    }
  }

  return {
    type: TxOutputDatumType.INLINED_DATUM,
    datum: CborizedTxDatum.decode(
      datumOption[1].value.toString('hex'),
    ) as PlutusDatum,
  }
}

// TODO
const parseCborizedScriptRef = (
  _scriptRef: CborizedTxScriptRef,
): TxScriptRef => {
  throw new Error('Not implemented')
}

const parseCborizedTxOutput = (output: CborizedTxOutput): TxOutput => {
  if (Array.isArray(output)) {
    const [address, value, datumHash] = output
    return {
      type: TxOutputType.LEGACY,
      address: address.toString('hex') as Address,
      value: parseCborizedTxValue(value),
      datumHash: datumHash?.toString('hex') as Hash32,
    }
  }

  const cborizedDatumOption = output.get(TxOutputKey.OUTPUT_KEY_DATUM_OPTION) as
    | CborizedDatumOption
    | undefined
  const cborizedScriptRef = output.get(TxOutputKey.OUTPUT_KEY_SCRIPT_REF) as
    | CborizedTxScriptRef
    | undefined

  return {
    type: TxOutputType.POST_ALONZO,
    address: output
      .get(TxOutputKey.OUTPUT_KEY_ADDRESS)!
      .toString('hex') as Address,
    value: parseCborizedTxValue(
      output.get(TxOutputKey.OUTPUT_KEY_VALUE)! as CborizedTxValue,
    ),
    datumOption: cborizedDatumOption
      ? parseCborizedTxDatumOption(cborizedDatumOption)
      : undefined,
    scriptRef: cborizedScriptRef
      ? parseCborizedScriptRef(cborizedScriptRef)
      : undefined,
  }
}

const cborInt64ToBigNumber = (
  value: CborInt64 | number | BigNumber,
): BigNumber =>
  typeof value === 'number'
    ? new BigNumber(value)
    : BigNumber.isBigNumber(value)
      ? value
      : value.bigNumber

const parseCborizedTxTokenBundle = (
  tokenBundle: CborizedTxTokenBundle,
): Value => {
  const res: Value = new Map()

  tokenBundle.forEach((tokens, policyId) => {
    const assetMap = new Map<AssetName, UInt>()
    tokens.forEach((quantity, assetName) => {
      assetMap.set(
        assetName.toString('hex') as AssetName,
        cborInt64ToBigNumber(quantity) as UInt,
      )
    })
    res.set(policyId.toString('hex') as PolicyId, assetMap)
  })

  return res
}

const parseCborizedTxValue = (value: CborizedTxValue): Value => {
  const [coins, tokenBundle] = Array.isArray(value)
    ? [cborInt64ToBigNumber(value[0]), value[1]]
    : [cborInt64ToBigNumber(value)]
  const parsedTokenBundle = tokenBundle
    ? parseCborizedTxTokenBundle(tokenBundle)
    : undefined

  const res = new Map([
    [
      AdaAsset.policyId as PolicyId,
      new Map([[AdaAsset.assetName as AssetName, coins as UInt]]),
    ],
  ])

  parsedTokenBundle?.forEach((value, policyId) => {
    res.set(policyId, value)
  })

  return res
}

// TODO
const parseCborizedCertificate = (
  _cert: CborizedTxCertificate,
): TxCertificate => {
  throw new Error('Not implemented')
}

// TODO
const parseCborizedWithdrawals = (
  _withdrawals: CborizedTxWithdrawals[],
): Withdrawals => {
  throw new Error('Not implemented')
}

const cborizedTxTokenBundleToMintValue = (
  tokenBundle: CborizedTxTokenBundle,
): MintValue => {
  return parseCborizedTxTokenBundle(tokenBundle) as Map<
    PolicyId,
    Map<AssetName, BigNumber>
  > as MintValue
}
