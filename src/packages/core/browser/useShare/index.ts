import type { MaybeRefOrGetter, ConfigurableNavigator } from '../../../types';
import { toValue } from '../../shared';
import { useSupported } from '../../utilities';
import { defaultNavigator } from '../../../utils';

export interface UseShareOptions {
  title?: string;
  files?: File[];
  text?: string;
  url?: string;
}

interface NavigatorWithShare {
  share?: (data: UseShareOptions) => Promise<void>;
  canShare?: (data: UseShareOptions) => boolean;
}

/**
 * Reactive Web Share API.
 * @param shareOptions
 * @param options
 */
export function useShare(
  shareOptions: MaybeRefOrGetter<UseShareOptions> = {},
  options: ConfigurableNavigator = {},
) {
  const { navigator = defaultNavigator } = options;

  const _navigator = navigator as NavigatorWithShare;
  const isSupported = useSupported(() => _navigator && 'canShare' in _navigator);

  const share = async (overrideOptions: MaybeRefOrGetter<UseShareOptions> = {}) => {
    if (isSupported.value) {
      const data = {
        ...toValue(shareOptions),
        ...toValue(overrideOptions),
      };
      let granted = true;

      if (data.files && _navigator.canShare) granted = _navigator.canShare({ files: data.files });

      if (granted) return _navigator.share!(data);
    }
  };

  return {
    isSupported,
    share,
  };
}

export type UseShareReturn = ReturnType<typeof useShare>;
