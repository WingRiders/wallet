import {LoadingButton} from '@mui/lab'
import {Button, Stack} from '@mui/material'
import type {ReactNode} from 'react'

type FlowButtonOptions = {
  label: string
  onClick?: () => void
  icon?: ReactNode
  disabled?: boolean
  isLoading?: boolean
}
type FlowNavigationProps = {
  nextButtonOptions?: FlowButtonOptions
  backButtonOptions?: FlowButtonOptions
}

export const FlowNavigation = ({
  nextButtonOptions,
  backButtonOptions,
}: FlowNavigationProps) => {
  return (
    <Stack direction="row" justifyContent="space-between" mt={4}>
      {backButtonOptions && (
        <Button
          variant="outlined"
          onClick={backButtonOptions.onClick}
          disabled={backButtonOptions.disabled || backButtonOptions.isLoading}
          endIcon={backButtonOptions.icon}
        >
          {backButtonOptions.label}
        </Button>
      )}

      {nextButtonOptions && (
        <LoadingButton
          variant="contained"
          onClick={nextButtonOptions.onClick}
          loading={nextButtonOptions.isLoading}
          endIcon={nextButtonOptions.icon}
          disabled={nextButtonOptions.disabled || nextButtonOptions.isLoading}
          loadingPosition="end"
        >
          {nextButtonOptions.label}
        </LoadingButton>
      )}
    </Stack>
  )
}
