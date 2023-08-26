import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue';
import { watch } from 'vue';
import type { ConfigurableEventFilter, MapOldSources, MapSources } from '../../../types';
import { bypassFilter, createFilterWrapper } from '../../shared';

export interface WatchWithFilterOptions<Immediate>
  extends WatchOptions<Immediate>,
    ConfigurableEventFilter {}

export function watchWithFilter<
  T extends Readonly<WatchSource<unknown>[]>,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchWithFilterOptions<Immediate>,
): WatchStopHandle;
export function watchWithFilter<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchWithFilterOptions<Immediate>,
): WatchStopHandle;
export function watchWithFilter<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchWithFilterOptions<Immediate>,
): WatchStopHandle;

export function watchWithFilter<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchStopHandle {
  const { eventFilter = bypassFilter, ...watchOptions } = options;

  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
