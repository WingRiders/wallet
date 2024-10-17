import {CssBaseline, ThemeProvider} from '@mui/material'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './App.tsx'
import {AppBackground} from './components/AppBackground.tsx'
import {theme} from './theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBackground />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
