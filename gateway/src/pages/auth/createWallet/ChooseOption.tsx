import AddCircleIcon from '@mui/icons-material/AddCircle'
import GetAppIcon from '@mui/icons-material/GetApp'
import {Stack, Typography} from '@mui/material'
import type {ReactNode} from 'react'
import {
  CreateWalletOption,
  useCreateWalletStore,
} from '../../../store/createWallet'

export const ChooseOption = () => {
  const startFlow = useCreateWalletStore((s) => s.startFlow)

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <OptionButton
        label="Create a new wallet"
        description="Create a new wallet with a new seed phrase."
        onClick={() => startFlow(CreateWalletOption.CREATE)}
        icon={<AddCircleIcon />}
      />
      <OptionButton
        label="Import existing wallet"
        description="Import an existing wallet using a seed phrase."
        onClick={() => startFlow(CreateWalletOption.IMPORT)}
        icon={<GetAppIcon />}
      />
    </Stack>
  )
}

type OptionButtonProps = {
  label: string
  description: string
  icon: ReactNode
  onClick: () => void
}

const OptionButton = ({
  label,
  description,
  icon,
  onClick,
}: OptionButtonProps) => {
  return (
    <Stack
      onClick={onClick}
      sx={({palette}) => ({
        bgcolor: palette.background.paper,
        color: palette.text.primary,
        p: 4,
        border: 'none',
        '&:hover': {
          bgcolor: palette.action.hover,
        },
        cursor: 'pointer',
      })}
      component="button"
      spacing={1}
    >
      <Stack direction="row" spacing={1}>
        {icon}
        <Typography variant="button">{label}</Typography>
      </Stack>
      <Typography
        variant="subtitle2"
        sx={({palette}) => ({
          color: palette.text.secondary,
        })}
      >
        {description}
      </Typography>
    </Stack>
  )
}
