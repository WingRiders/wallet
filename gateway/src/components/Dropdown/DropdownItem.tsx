import {MenuItem, type MenuItemProps} from '@mui/material'
import type {ReactNode} from 'react'

export type DropdownItemProps = {
  label?: string | ReactNode
} & Pick<MenuItemProps, 'value' | 'disabled' | 'sx'>

export const DropdownItem = ({label, ...otherProps}: DropdownItemProps) => {
  return <MenuItem {...otherProps}>{label}</MenuItem>
}
