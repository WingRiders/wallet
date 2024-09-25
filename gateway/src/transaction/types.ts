import type {
  CborInt64,
  CborizedTxDatum,
  TxBodyKey,
} from '@wingriders/cab/ledger/transaction'
import type {NetworkId, TxRedeemerTag} from '@wingriders/cab/types'
import type {Tagged} from 'borc'
import type {CborizedTxScriptRef} from './CborizedTxScriptRef'

export type CborizedTxInput = [Buffer, number]

export type CborizedTxTokenBundle = Map<Buffer, Map<Buffer, number | CborInt64>>

export type CborizedTxValue = CborInt64 | [CborInt64, CborizedTxTokenBundle]

export enum TxOutputKey {
  OUTPUT_KEY_ADDRESS = 0,
  OUTPUT_KEY_VALUE = 1,
  OUTPUT_KEY_DATUM_OPTION = 2,
  OUTPUT_KEY_SCRIPT_REF = 3,
}

export enum TxWitnessKey {
  SHELLEY = 0,
  SCRIPTS_V1 = 3,
  DATA = 4,
  REDEEMERS = 5,
  SCRIPTS_V2 = 6,
}

export enum TxCertificateKey {
  STAKING_KEY_REGISTRATION = 0,
  STAKING_KEY_DEREGISTRATION = 1,
  DELEGATION = 2,
}

export enum TxStakeCredentialType {
  ADDR_KEYHASH = 0,
  // SCRIPTHASH = 1,
}

export type CborizedTxStakeCredential = [TxStakeCredentialType, Buffer]

export type CborizedDatumOption = [0, Buffer] | [1, Tagged<Buffer>]
export type CborizedTxOutput =
  | [Buffer, CborizedTxValue]
  | [Buffer, CborizedTxValue, Buffer]
  | Map<
      TxOutputKey,
      Buffer | CborizedTxValue | CborizedDatumOption | CborizedTxScriptRef
    >

export type CborizedTxStakingKeyRegistrationCert = [
  TxCertificateKey.STAKING_KEY_REGISTRATION,
  CborizedTxStakeCredential,
]

export type CborizedTxStakingKeyDeregistrationCert = [
  TxCertificateKey.STAKING_KEY_DEREGISTRATION,
  CborizedTxStakeCredential,
]

export type CborizedTxDelegationCert = [
  TxCertificateKey.DELEGATION,
  CborizedTxStakeCredential,
  Buffer,
]

export type CborizedTxCertificate =
  | CborizedTxDelegationCert
  | CborizedTxStakingKeyDeregistrationCert
  | CborizedTxStakingKeyRegistrationCert

export type CborizedTxWithdrawals = Map<Buffer, CborInt64>

export type CborizedTxBody = Map<
  TxBodyKey,
  | CborizedTxInput[]
  | CborizedTxInput[]
  | CborizedTxInput[]
  | CborizedTxOutput[]
  | CborInt64
  | CborizedTxCertificate[]
  | CborizedTxWithdrawals
  | Buffer
  | CborInt64
  | Buffer[]
  | CborizedTxTokenBundle
  | Buffer
  | NetworkId
>

export type CborizedTxWitnessShelley = [Buffer, Buffer]

export type CborizedTxScript = Buffer

export type CborizedTxRedeemer = [
  TxRedeemerTag,
  number /* index */,
  CborizedTxDatum,
  [number /* memory */, number /* steps */] /* exunits */,
]

export type CborizedTxWitnesses = Map<
  TxWitnessKey,
  | CborizedTxWitnessShelley[]
  | CborizedTxScript[]
  | CborizedTxScript[]
  | CborizedTxDatum[]
  | CborizedTxRedeemer[]
>
