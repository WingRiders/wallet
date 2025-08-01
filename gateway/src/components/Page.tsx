import {Container, Stack} from '@mui/material'
import type {ReactNode} from 'react'
import {Header, type HeaderProps} from '../app/Header'

type PageProps = {
  headerProps?: HeaderProps
  children?: ReactNode
}

export const Page = ({headerProps, children}: PageProps) => {
  return (
    <Stack>
      <Header {...headerProps} />
      <Container maxWidth="lg" sx={{pt: 5}}>
        {children}
      </Container>
    </Stack>
  )
}
