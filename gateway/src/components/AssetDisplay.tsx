import {Stack, type StackProps} from '@mui/material'

import {shortLabel} from '../helpers/shortLabel'
import {AssetIcon} from './AssetIcon'
import {Label} from './Typography/Label'
import {Paragraph} from './Typography/Paragraph'

export const FINGERPRINT_START_CHARS = 10
export const FINGERPRINT_END_CHARS = 5

export type AssetDisplayProps = {
  logoBase64?: string
  logoUrl?: string
  label?: string
  showArrow?: boolean
  showStablecoinChip?: boolean
  description: string
  customDescription?: string
  iconSize?: number
  maxWidth?: StackProps['maxWidth']
  flexGrow?: StackProps['flex']
}

export const AssetDisplay = ({
  logoBase64,
  logoUrl,
  iconSize,
  label,
  description,
  customDescription,
  maxWidth = 300,
  flexGrow = 1,
}: AssetDisplayProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={3}
      flexGrow={flexGrow}
      minWidth={0}
    >
      <AssetIcon
        logoBase64={logoBase64}
        logoUrl={logoUrl}
        alt={description}
        size={iconSize}
      />
      <Stack
        flex={1}
        minWidth={0}
        direction="row"
        alignItems="center"
        spacing={3}
      >
        <Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Label
              variant="large"
              noWrap
              sx={{color: 'inherit'}}
              maxWidth={maxWidth}
            >
              {description}
            </Label>
            {customDescription != null && (
              <Label
                variant="large"
                sx={({palette}) => ({color: palette.text.secondary})}
              >
                ({customDescription})
              </Label>
            )}
          </Stack>
          {label && (
            <Paragraph variant="small">
              {shortLabel(
                label,
                FINGERPRINT_START_CHARS,
                FINGERPRINT_END_CHARS,
              )}
            </Paragraph>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
