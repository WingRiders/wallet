import {Container} from '@mui/material'
import type {ReactNode} from 'react'

type PageProps = {
  children?: ReactNode
}

export const Page = ({children}: PageProps) => {
  return (
    <Container maxWidth="lg" sx={{pt: 5}}>
      {children}
    </Container>
  )
}
