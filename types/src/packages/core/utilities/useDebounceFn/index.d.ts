import type { MaybeRefOrGetter, AnyFn } from '../../../types';
import type { DebounceSettings } from 'lodash';
export declare function useDebounceFn(fn: AnyFn, delay?: MaybeRefOrGetter<number>, options?: DebounceSettings): import("lodash").DebouncedFunc<(...args: any) => any>;
