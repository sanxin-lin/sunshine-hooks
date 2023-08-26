import type { WatchOptions, WatchSource } from 'vue';
import { isRef, watch } from 'vue';
import { toValue } from '../../shared';
import type { ElementOf, MaybeRefOrGetter, ShallowUnwrapRef } from '../../../types';
import { promiseTimeout } from '../../../utils';
import isNil from 'lodash/isNil';
import isNaN from 'lodash/isNaN';
import isArray from 'lodash/isArray';

export interface UntilToMatchOptions {
  /**
   * Milliseconds timeout for promise to resolve/reject if the when condition does not meet.
   * 0 for never timed out
   *
   * @default 0
   */
  timeout?: number;

  /**
   * Reject the promise when timeout
   *
   * @default false
   */
  throwOnTimeout?: boolean;

  /**
   * `flush` option for internal watch
   *
   * @default 'sync'
   */
  flush?: WatchOptions['flush'];

  /**
   * `deep` option for internal watch
   *
   * @default 'false'
   */
  deep?: WatchOptions['deep'];
}

export interface UntilBaseInstance<T, Not extends boolean = false> {
  toMatch<U extends T = T>(
    condition: (v: T) => v is U,
    options?: UntilToMatchOptions,
  ): Not extends true ? Promise<Exclude<T, U>> : Promise<U>;
  toMatch(condition: (v: T) => boolean, options?: UntilToMatchOptions): Promise<T>;
}

type Falsy = false | void | null | undefined | 0 | 0n | '';

export interface UntilValueInstance<T, Not extends boolean = false>
  extends UntilBaseInstance<T, Not> {
  readonly not: UntilValueInstance<T, Not extends true ? false : true>;

  toBe<P = T>(
    value: MaybeRefOrGetter<P>,
    options?: UntilToMatchOptions,
  ): Not extends true ? Promise<T> : Promise<P>;
  toBeTruthy(
    options?: UntilToMatchOptions,
  ): Not extends true ? Promise<T & Falsy> : Promise<Exclude<T, Falsy>>;
  toBeNull(
    options?: UntilToMatchOptions,
  ): Not extends true ? Promise<Exclude<T, null>> : Promise<null>;
  toBeUndefined(
    options?: UntilToMatchOptions,
  ): Not extends true ? Promise<Exclude<T, undefined>> : Promise<undefined>;
  toBeNaN(options?: UntilToMatchOptions): Promise<T>;
}

export interface UntilArrayInstance<T> extends UntilBaseInstance<T> {
  readonly not: UntilArrayInstance<T>;

  toContains(
    value: MaybeRefOrGetter<ElementOf<ShallowUnwrapRef<T>>>,
    options?: UntilToMatchOptions,
  ): Promise<T>;
}

const createUntil = <T>(r: any, isNot = false) => {
  const toMatch = (
    condition: (v: any) => boolean,
    { flush = 'sync', deep = false, timeout, throwOnTimeout }: UntilToMatchOptions = {},
  ) => {
    let stop: (() => void) | null = null;
    const watcher = new Promise<T>((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) !== isNot) {
            stop?.();
            resolve(v);
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      );
    });

    const promises = [watcher];
    if (!isNil(timeout)) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .then(() => toValue(r))
          .finally(() => stop?.()),
      );
    }

    return Promise.race(promises);
  };

  const toBe = <P>(value: MaybeRefOrGetter<P | T>, options?: UntilToMatchOptions) => {
    if (!isRef(value)) {
      return toMatch((v) => v === value, options);
    }

    const { flush = 'sync', deep = false, timeout, throwOnTimeout } = options ?? {};
    let stop: (() => void) | null = null;

    const watcher = new Promise<T>((resolve) => {
      stop = watch(
        [r, value],
        ([v1, v2]) => {
          if (isNot !== (v1 === v2)) {
            stop?.();
            resolve(v1);
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      );
    });

    const promises = [watcher];
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout)
          .then(() => toValue(r))
          .finally(() => {
            stop?.();
            return toValue(r);
          }),
      );
    }

    return Promise.race(promises);
  };

  function toBeTruthy(options?: UntilToMatchOptions) {
    return toMatch((v) => Boolean(v), options);
  }

  function toBeNull(options?: UntilToMatchOptions) {
    return toBe<null>(null, options);
  }

  function toBeUndefined(options?: UntilToMatchOptions) {
    return toBe<undefined>(undefined, options);
  }

  function toBeNaN(options?: UntilToMatchOptions) {
    return toMatch(isNaN, options);
  }

  function toContains(value: any, options?: UntilToMatchOptions) {
    return toMatch((v) => {
      const array = Array.from(v as any);
      return array.includes(value) || array.includes(toValue(value));
    }, options);
  }

  if (isArray(toValue(r))) {
    const instance: UntilArrayInstance<T> = {
      toMatch,
      toContains,
      get not() {
        return createUntil(r, !isNot) as UntilArrayInstance<T>;
      },
    };
    return instance;
  } else {
    const instance: UntilValueInstance<T, boolean> = {
      toMatch,
      toBe,
      toBeTruthy: toBeTruthy as any,
      toBeNull: toBeNull as any,
      toBeNaN,
      toBeUndefined: toBeUndefined as any,
      get not() {
        return createUntil(r, !isNot) as UntilValueInstance<T, boolean>;
      },
    };

    return instance;
  }
};

/**
 * Promised one-time watch for changes
 * @example
 * ```
 * const { count } = useCounter()
 *
 * await until(count).toMatch(v => v > 7)
 *
 * alert('Counter is now larger than 7!')
 * ```
 */
export function until<T extends unknown[]>(
  r: WatchSource<T> | MaybeRefOrGetter<T>,
): UntilArrayInstance<T>;
export function until<T>(r: WatchSource<T> | MaybeRefOrGetter<T>): UntilValueInstance<T>;
export function until<T>(r: any): UntilValueInstance<T> | UntilArrayInstance<T> {
  return createUntil(r);
}
