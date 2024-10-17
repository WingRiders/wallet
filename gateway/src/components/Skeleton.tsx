import {
  Skeleton as MuiSkeleton,
  type SkeletonProps as MuiSkeletonProps,
} from '@mui/material'

type SkeletonProps = MuiSkeletonProps & {
  if?: boolean
  fullWidth?: boolean
}

export const Skeleton = ({
  if: show,
  fullWidth,
  children,
  ...props
}: SkeletonProps) => {
  return show ? (
    <MuiSkeleton
      {...props}
      variant="rectangular"
      animation="wave"
      width={fullWidth ? '100%' : undefined}
    >
      {children}
    </MuiSkeleton>
  ) : (
    children
  )
}
