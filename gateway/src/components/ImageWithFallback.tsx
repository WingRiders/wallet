import {Box, type SxProps, type Theme} from '@mui/material'
import type {OverrideProps} from '@mui/material/OverridableComponent'
import type {BoxTypeMap} from '@mui/system'
import {type ReactNode, useState} from 'react'
import type {Except} from 'type-fest'

import {Skeleton, type SkeletonProps} from './Skeleton'

type BoxImgProps = OverrideProps<BoxTypeMap<any, 'img'>, 'img'>

export type ImageWithFallbackProps = Except<BoxImgProps, 'component' | 'sx'> & {
  sx?: SxProps<Theme>
  // either a ReactNode or an image url
  fallback?: ReactNode | string
  skeletonVariant?: SkeletonProps['variant']
}

export const ImageWithFallback = ({
  src,
  fallback,
  skeletonVariant,
  ...otherProps
}: ImageWithFallbackProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  return isValid || isLoading ? (
    <Skeleton if={isLoading} fullWidth height="100%" variant={skeletonVariant}>
      <Box
        component="img"
        src={src}
        onError={(event) => {
          setIsLoading(false)
          setIsValid(false)
          otherProps.onError?.(event)
        }}
        onLoad={(event) => {
          setIsLoading(false)
          setIsValid(true)
          otherProps.onLoad?.(event)
        }}
        {...otherProps}
      />
    </Skeleton>
  ) : (
    <>
      {typeof fallback === 'string' ? (
        <Box component="img" src={fallback} {...otherProps} />
      ) : (
        fallback
      )}
    </>
  )
}
