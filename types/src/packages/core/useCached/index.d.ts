import type { Ref, WatchOptions } from 'vue';
export declare function useCached<T>(refValue: Ref<T>, comparator?: (a: T, b: T) => boolean, watchOptions?: WatchOptions): Ref<T>;
