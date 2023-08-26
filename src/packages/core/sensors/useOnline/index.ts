import { useNetwork } from '../useNetwork';

/**
 * Reactive online state.
 * @param options
 */

export function useOnline() {
  const { isOnline } = useNetwork();
  return isOnline;
}
