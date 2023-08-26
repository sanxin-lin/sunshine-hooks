import type { ComputedGetter, ComputedRef, WatchSource, WritableComputedOptions, WritableComputedRef } from 'vue';
export interface ComputedWithControlRefExtra {
    /**
     * Force update the computed value.
     */
    trigger(): void;
}
export interface ComputedRefWithControl<T> extends ComputedRef<T>, ComputedWithControlRefExtra {
}
export interface WritableComputedRefWithControl<T> extends WritableComputedRef<T>, ComputedWithControlRefExtra {
}
export declare function computedWithControl<T, S>(source: WatchSource<S> | WatchSource<S>[], fn: ComputedGetter<T>): ComputedRefWithControl<T>;
export declare function computedWithControl<T, S>(source: WatchSource<S> | WatchSource<S>[], fn: WritableComputedOptions<T>): WritableComputedRefWithControl<T>;
export { computedWithControl as controlledComputed };
