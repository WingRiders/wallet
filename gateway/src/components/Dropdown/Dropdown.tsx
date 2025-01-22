import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {InputBase, Select, type SelectProps, styled} from '@mui/material'
import {spacing} from '@mui/system'
import {Children, type Ref, forwardRef, isValidElement} from 'react'

import {DropdownItem, type DropdownItemProps} from './DropdownItem'

type DropdownColorVariant = 'default' | 'paper'

const StyledInput = styled(InputBase, {
  shouldForwardProp: (prop) =>
    !['colorVariant', 'size'].includes(prop as string),
})<{colorVariant?: DropdownColorVariant; size?: SelectProps['size']}>(
  ({theme, colorVariant, size = 'medium'}) => ({
    '& .MuiInputBase-input': {
      borderRadius: 0,
      backgroundColor:
        colorVariant === 'paper'
          ? theme.palette.background.paper
          : theme.palette.background.default,
      padding: theme.spacing(size === 'small' ? 3 : 4),
      border: '1px solid transparent',
      '&:hover': {
        border: `1px solid ${theme.palette.border.annotation}`,
      },
      '&[aria-expanded="true"]': {
        border: `1px solid ${theme.palette.border.contrast}`,
      },
    },
  }),
)

export type DropdownProps<TValue> = {
  onChange?: (value: TValue | string) => void
  itemSx?: DropdownItemProps['sx']
  colorVariant?: DropdownColorVariant
} & Pick<
  SelectProps<TValue>,
  | 'size'
  | 'value'
  | 'fullWidth'
  | 'children'
  | 'displayEmpty'
  | 'multiple'
  | 'renderValue'
  | 'onOpen'
>

const Dropdown = forwardRef(
  <TValue,>(
    {onChange, children, itemSx, ...otherProps}: DropdownProps<TValue>,
    ref: Ref<HTMLDivElement>,
  ) => (
    <Select<TValue>
      onChange={(e) => onChange?.(e.target.value)}
      input={<StyledInput />}
      inputRef={ref}
      MenuProps={{
        sx: (theme) => ({
          '& .MuiPaper-root': {
            borderRadius: 0,
            background: theme.palette.background.paper,
            marginTop: theme.spacing(2),
            border: `1px solid ${theme.palette.border.contrast}`,
            '.Mui-selected': {
              backgroundColor: theme.palette.background.primaryGlass,
            },
          },
        }),
      }}
      IconComponent={KeyboardArrowDownIcon}
      {...otherProps}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return (
            <DropdownItem sx={itemSx} {...child.props}>
              {child.props.label}
            </DropdownItem>
          )
        }

        return child
      })}
    </Select>
  ),
)

const StyledDropdown = styled(Dropdown)(spacing)

export {StyledDropdown as Dropdown}
