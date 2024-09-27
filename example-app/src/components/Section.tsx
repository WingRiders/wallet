import {Box, Stack, Typography} from '@mui/material'
import type {ReactNode} from 'react'

type SectionProps = {
  title?: string
  children?: ReactNode
}

export const Section = ({title, children}: SectionProps) => {
  return (
    <Stack spacing={1}>
      {title && <Typography variant="body1">{title}</Typography>}
      <Box bgcolor={({palette}) => palette.background.paper} p={3}>
        {children}
      </Box>
    </Stack>
  )
}
