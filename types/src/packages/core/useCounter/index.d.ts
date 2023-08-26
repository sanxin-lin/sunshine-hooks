import type { MaybeRefOrGetter } from '../../types';
export interface UseCounterOptions {
    min?: number;
    max?: number;
}
export declare function useCounter(initialValue?: MaybeRefOrGetter<number>, options?: UseCounterOptions): {
    count: import("vue").Ref<number>;
    inc: (delta?: number) => number;
    dec: (delta?: number) => number;
    get: () => number;
    set: (val: number) => number;
    reset: (val?: number) => number;
};
