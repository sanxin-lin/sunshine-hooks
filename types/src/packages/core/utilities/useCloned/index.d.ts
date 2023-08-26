import type { MaybeRefOrGetter } from '../../../types';
import type { ComputedRef, WatchOptions } from 'vue';
export interface UseClonedOptions<T = any> extends WatchOptions {
    /**
     * Custom clone function.
     *
     * By default, it use `JSON.parse(JSON.stringify(value))` to clone.
     */
    clone?: (source: T) => T;
    /**
     * Manually sync the ref
     *
     * @default false
     */
    manual?: boolean;
}
export declare function useCloned<T>(source: MaybeRefOrGetter<T>, options?: UseClonedOptions): ComputedRef<T>;
