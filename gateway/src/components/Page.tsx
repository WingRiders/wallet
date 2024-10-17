import {Container, Stack} from '@mui/material'
import type {ReactNode} from 'react'
import {Header, type HeaderProps} from './Header'

type PageProps = {
  showHeader?: boolean
  headerProps?: HeaderProps
  children?: ReactNode
}

export const Page = ({showHeader, headerProps, children}: PageProps) => {
  return (
    <Stack>
      {showHeader && <Header {...headerProps} />}
      <Container maxWidth="lg" sx={{pt: 5}}>
        {children}
      </Container>
    </Stack>
  )
}
