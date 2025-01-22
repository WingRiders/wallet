import {Stack} from '@mui/material'
import type {ReactNode} from 'react'
import {Button} from './Buttons/Button'
import {TextButton} from './Buttons/TextButton'

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
    <Stack direction="row" justifyContent="space-between" mt={10}>
      {backButtonOptions && (
        <TextButton
          onClick={backButtonOptions.onClick}
          disabled={backButtonOptions.disabled || backButtonOptions.isLoading}
          icon={backButtonOptions.icon}
        >
          {backButtonOptions.label}
        </TextButton>
      )}

      {nextButtonOptions && (
        <Button
          onClick={nextButtonOptions.onClick}
          loading={nextButtonOptions.isLoading && 'centered'}
          icon={nextButtonOptions.icon}
          disabled={nextButtonOptions.disabled || nextButtonOptions.isLoading}
        >
          {nextButtonOptions.label}
        </Button>
      )}
    </Stack>
  )
}
