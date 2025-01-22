import {Box, Stack} from '@mui/material'
import type {ReactNode} from 'react'
import {Label} from '../../components/Typography/Label'

type SectionProps = {
  title?: string
  children?: ReactNode
}

export const Section = ({title, children}: SectionProps) => {
  return (
    <Stack spacing={2}>
      {title && <Label variant="large">{title}</Label>}
      <Box bgcolor={({palette}) => palette.background.paper} p={5}>
        {children}
      </Box>
    </Stack>
  )
}
