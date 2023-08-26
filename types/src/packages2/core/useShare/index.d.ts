import type { MaybeRefOrGetter, ConfigurableNavigator } from '../../types';
export interface UseShareOptions {
    title?: string;
    files?: File[];
    text?: string;
    url?: string;
}
/**
 * Reactive Web Share API.
 * @param shareOptions
 * @param options
 */
export declare function useShare(shareOptions?: MaybeRefOrGetter<UseShareOptions>, options?: ConfigurableNavigator): {
    isSupported: import("vue").ComputedRef<boolean>;
    share: (overrideOptions?: MaybeRefOrGetter<UseShareOptions>) => Promise<void>;
};
export type UseShareReturn = ReturnType<typeof useShare>;
