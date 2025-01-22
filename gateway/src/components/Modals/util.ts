import {useLatest} from '../../helpers/useLatest'

/**
 * Retains props from the last render that had the modal open.
 * This prevents content from disappearing as the modal's closing transition is playing.
 */
export const useModalProps = <T>(open: boolean, newProps: T): T => {
  const [props] = useLatest(newProps, () => open)
  return props
}
