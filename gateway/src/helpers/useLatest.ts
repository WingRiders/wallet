import {isEqual} from 'lodash'
import {useEffect, useRef} from 'react'

export const isNotNullish = <T>(val: T): val is NonNullable<T> => val != null

type UseLatestPredicate<T> = (next: T, prev: T) => boolean

export const useLatest = <T>(
  value: T,
  shouldUpdate: UseLatestPredicate<T> = isNotNullish,
): [value: T, isStale: boolean] => {
  const ref = useRef(value)

  const latest = shouldUpdate(value, ref.current) ? value : ref.current

  useEffect(() => {
    ref.current = latest
  }, [latest])

  return [latest, !isEqual(latest, value)]
}
