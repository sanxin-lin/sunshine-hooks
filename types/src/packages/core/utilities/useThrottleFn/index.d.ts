import type { MaybeRefOrGetter, AnyFn } from '../../../types';
import type { ThrottleSettings } from 'lodash';
export declare function useThrottleFn(fn: AnyFn, delay?: MaybeRefOrGetter<number>, options?: ThrottleSettings): import("lodash").DebouncedFunc<(...args: any) => any>;
