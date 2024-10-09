import {Box} from '@mui/material'
import type {BigNumber} from '@wingriders/cab/types'
import type {ReactNode} from 'react'

type DiffDisplayProps = {
  diff: BigNumber
  children?: ReactNode
}
export const DiffDisplay = ({diff, children}: DiffDisplayProps) => {
  return (
    <Box
      component="span"
      color={({palette}) =>
        diff.gt(0)
          ? palette.success.main
          : diff.lt(0)
            ? palette.error.main
            : undefined
      }
    >
      {children}
    </Box>
  )
}
