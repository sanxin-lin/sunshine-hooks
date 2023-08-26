import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue';
import type { MapOldSources, MapSources, MaybeRefOrGetter } from '../../../types';
import { watchWithFilter } from '../watchWithFilter';
import throttle from 'lodash/throttle';
import { toValue } from '../../shared';

export interface WatchThrottledOptions<Immediate> extends WatchOptions<Immediate> {
  delay?: MaybeRefOrGetter<number>;
  trailing?: boolean;
  leading?: boolean;
}

// overloads
export function watchThrottled<
  T extends Readonly<WatchSource<unknown>[]>,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchThrottledOptions<Immediate>,
): WatchStopHandle;
export function watchThrottled<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchThrottledOptions<Immediate>,
): WatchStopHandle;
export function watchThrottled<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchThrottledOptions<Immediate>,
): WatchStopHandle;

// implementation
export function watchThrottled<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchThrottledOptions<Immediate> = {},
): WatchStopHandle {
  const { delay = 0, trailing = true, leading = true, ...watchOptions } = options;

  const _throttle = throttle((cb) => cb, toValue(delay), { leading, trailing });

  return watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter: _throttle,
  });
}
