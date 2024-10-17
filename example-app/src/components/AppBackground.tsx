import {Box} from '@mui/material'

export const AppBackground = () => {
  return (
    <Box
      sx={({palette}) => ({
        bgcolor: palette.background.body,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      })}
    />
  )
}
