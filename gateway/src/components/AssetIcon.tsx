import {Box, styled} from '@mui/material'
import {spacing} from '@mui/system'

import {useIsMobile} from '../helpers/resolution'
import {DefaultAssetIcon} from './DefaultAssetIcon'
import {ImageWithFallback} from './ImageWithFallback'

type AssetIconProps = {
  alt?: string
  url?: string
  logoBase64?: string
  logoUrl?: string
  size?: number
}

export const AssetIcon = styled(
  ({
    url,
    logoBase64,
    logoUrl,
    alt,
    size: _size,
    ...otherProps
  }: AssetIconProps) => {
    const defaultSize = useIsMobile() ? 24 : 36
    const size = _size ?? defaultSize

    if (!url && !logoBase64 && !logoUrl) {
      return (
        <Box height={size} width={size} {...otherProps}>
          <DefaultAssetIcon size={size} />
        </Box>
      )
    }
    const src = logoUrl || url || `data:image/png;base64,${logoBase64}`
    return (
      <Box {...otherProps} width={size} height={size}>
        <ImageWithFallback
          sx={{
            height: size,
            width: size,
            imageRendering: '-webkit-optimize-contrast',
          }}
          borderRadius="50%"
          src={src}
          alt={alt}
          fallback={<DefaultAssetIcon size={size} />}
          skeletonVariant="circular"
        />
      </Box>
    )
  },
)(spacing)
