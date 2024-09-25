import {createTheme} from '@mui/material'

const COLORS = {
  neutral: {
    gray0: '#FFFFFF',
    gray1: '#F5F5F5',
    gray2: '#D9D9D9',
    gray3: '#8C8C8C',
    gray4: '#595959',
    gray5: '#262626',
    gray6: '#151918',
    gray7: '#000000',
  },
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: COLORS.neutral.gray7,
      paper: COLORS.neutral.gray6,
    },
  },
})
