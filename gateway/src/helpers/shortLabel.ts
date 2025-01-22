import {ELLIPSIS} from '../constants'

export const shortLabel = (
  label: string,
  lengthOfStart: number,
  lengthOfEnd: number,
) => {
  // -1 because there is no need to cut one char and replace it with …
  if (label.length - 1 <= lengthOfStart + lengthOfEnd) return label

  return `${label.substring(0, lengthOfStart)}${ELLIPSIS}${label.substring(label.length - lengthOfEnd)}`
}
