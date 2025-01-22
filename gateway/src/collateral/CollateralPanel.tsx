import {Alert, Stack} from '@mui/material'
import {useState} from 'react'
import {Label} from '../components/Typography/Label'
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
        <Label
          variant="large"
          sx={({palette}) => ({
            color: collateral ? palette.success.main : palette.error.main,
          })}
        >
          {collateral ? 'Collateral set' : 'Collateral not set'}
        </Label>
        <SetCollateralButton
          hasCollateral={!!collateral}
          onCreate={setCreateCollateralResult}
        />
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
