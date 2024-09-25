import {Alert, Stack, Typography} from '@mui/material'
import {utxoId} from '@wingriders/cab/helpers'
import {useState} from 'react'
import {useWalletDataStore} from '../store/walletData'
import type {ResultType} from '../types'
import {SetCollateralButton} from './SetCollateralButton'

export const CollateralPanel = () => {
  const [createCollateralResult, setCreateCollateralResult] =
    useState<ResultType | null>(null)
  const collateral = useWalletDataStore((s) => s.collateral)

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1">
          {collateral
            ? `Collateral set (${utxoId(collateral)})`
            : 'Collateral not set'}
        </Typography>
        <SetCollateralButton onCreate={setCreateCollateralResult} />
      </Stack>

      {createCollateralResult && (
        <Alert
          severity={createCollateralResult.isSuccess ? 'success' : 'error'}
          onClose={() => setCreateCollateralResult(null)}
        >
          {createCollateralResult.isSuccess
            ? 'Collateral set successfully'
            : createCollateralResult.errorMessage
              ? `Failed to create collateral: ${createCollateralResult.errorMessage}`
              : 'Failed to create collateral'}
        </Alert>
      )}
    </Stack>
  )
}
