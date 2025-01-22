import AddIcon from '@mui/icons-material/Add'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import {Box, Stack} from '@mui/material'
import type {ReactNode} from 'react'
import {Button} from '../../../components/Buttons/Button'
import {Paragraph} from '../../../components/Typography/Paragraph'
import {
  CreateWalletOption,
  useCreateWalletStore,
} from '../../../store/createWallet'

export const ChooseOption = () => {
  const startFlow = useCreateWalletStore((s) => s.startFlow)

  return (
    <Stack
      direction={{xs: 'column-reverse', md: 'row'}}
      spacing={{xs: 5, md: 15}}
    >
      <Stack
        direction={{xs: 'column', sm: 'row'}}
        alignItems="stretch"
        spacing={6}
        flex={2}
      >
        <Box flex={1}>
          <OptionButton
            label="Create a new wallet"
            description="Create a new WingRiders Prime wallet and start your Cardano journey. Secure your funds with a unique recovery phrase, giving you full control and ownership of your assets."
            onClick={() => startFlow(CreateWalletOption.CREATE)}
            icon={<AddIcon fontSize="small" />}
          />
        </Box>
        <Box flex={1}>
          <OptionButton
            label="Restore existing wallet"
            description="Restore your wallet using a recovery phrase. Access your wallet and continue managing your funds seamlessly."
            onClick={() => startFlow(CreateWalletOption.IMPORT)}
            icon={<SettingsBackupRestoreIcon fontSize="small" />}
          />
        </Box>
      </Stack>

      <Stack spacing={3} flex={1}>
        <Paragraph variant="long">
          WingRiders Prime wallet is a secure, mobile-friendly, and intuitive
          wallet designed to simplify your journey in the Cardano dApps
          ecosystem. Fully integrated with the WingRiders platform, it allows
          seamless connection to dApps and gives you complete control over you
          assets.
        </Paragraph>
        <Paragraph variant="long">
          Whether you're creating a new wallet, restoring an existing one,
          WingRiders Prime wallet ensures a smooth and efficient experience
          across all your devices.
        </Paragraph>
      </Stack>
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
    <Box
      sx={({palette}) => ({
        p: 6,
        pb: 10,
        background: palette.background.paper,
        border: `1px solid ${palette.border.container}`,
        height: '100%',
        position: 'relative',
      })}
    >
      <Box
        sx={({palette}) => ({
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '1px',
          background: palette.gradient.success,
        })}
      />

      <Stack alignItems="center" spacing={5} height="100%">
        <Paragraph variant="long" sx={{textAlign: 'center', flex: 1}}>
          {description}
        </Paragraph>
        <Button icon={icon} onClick={onClick}>
          {label}
        </Button>
      </Stack>
    </Box>
  )
}
