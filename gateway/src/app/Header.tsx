import {AppBar, Stack, useScrollTrigger} from '@mui/material'
import Logo from '../assets/logo.svg?react'
import {NetworkSwitch} from '../components/NetworkSwitch'
import {WalletButton} from './WalletButton'

export type HeaderProps = {
  showWallet?: boolean
  showNetwork?: boolean
}

export const Header = ({showWallet, showNetwork}: HeaderProps) => {
  const scrolled = useScrollTrigger({threshold: 20, disableHysteresis: true})

  return (
    <AppBar
      position="sticky"
      sx={({palette}) => ({
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        boxShadow: 'none',
        py: 4,
        px: 12,
        borderBottom: 1,
        borderColor: palette.background.dark,
        transition: 'background-color 0.1s linear',
        backgroundColor: scrolled ? palette.background.body : undefined,
      })}
      color="transparent"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
        minHeight={50}
      >
        <Logo height={40} width={170} />

        <Stack direction="row" alignItems="center" spacing={2}>
          {showNetwork && <NetworkSwitch size="small" />}
          {showWallet && <WalletButton />}
        </Stack>
      </Stack>
    </AppBar>
  )
}
