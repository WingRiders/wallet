import type {ProtocolParameters as OgmiosProtocolParameters} from '@cardano-ogmios/schema'
import type {NullableProtocolParameters} from '@wingriders/cab/types'

export const parseOgmiosProtocolParameters = (
  parameters: OgmiosProtocolParameters,
): NullableProtocolParameters => {
  const scriptPrices = {
    memory: parameters.scriptExecutionPrices!.memory,
    steps: parameters.scriptExecutionPrices!.cpu,
  }

  const exUnitsTx = {
    memory: parameters.maxExecutionUnitsPerTransaction!.memory,
    steps: parameters.maxExecutionUnitsPerTransaction!.cpu,
  }

  const exUnitsBlock = {
    memory: parameters.maxExecutionUnitsPerBlock!.memory,
    steps: parameters.maxExecutionUnitsPerBlock!.cpu,
  }

  const params = {
    minFeeCoefficient: parameters.minFeeCoefficient,
    minFeeConstant: Number(parameters.minFeeConstant.ada.lovelace),
    maxBlockBodySize: parameters.maxBlockBodySize.bytes,
    maxBlockHeaderSize: parameters.maxBlockHeaderSize.bytes,
    maxTxSize: parameters.maxTransactionSize?.bytes ?? null,
    stakeKeyDeposit: Number(parameters.stakeCredentialDeposit.ada.lovelace),
    poolDeposit: Number(parameters.stakePoolDeposit.ada.lovelace),
    poolRetirementEpochBound: parameters.stakePoolRetirementEpochBound,
    desiredNumberOfPools: parameters.desiredNumberOfStakePools,
    poolInfluence: parameters.stakePoolPledgeInfluence,
    monetaryExpansion: parameters.monetaryExpansion,
    treasuryExpansion: parameters.treasuryExpansion,
    minPoolCost: Number(parameters.minStakePoolCost.ada.lovelace),
    coinsPerUtxoByte: parameters.minUtxoDepositCoefficient,
    maxValueSize: parameters.maxValueSize?.bytes ?? null,
    collateralPercentage: parameters.collateralPercentage ?? null,
    maxCollateralInputs: parameters.maxCollateralInputs ?? null,
    protocolVersion: parameters.version,
    costModels: parameters.plutusCostModels ?? null,
    prices: scriptPrices,
    maxExecutionUnitsPerTransaction: exUnitsTx,
    maxExecutionUnitsPerBlock: exUnitsBlock,
  }

  return params
}
