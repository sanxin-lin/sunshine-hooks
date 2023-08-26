import type { WatchCallback, WatchSource, WatchStopHandle } from 'vue';
import { ref, watch } from 'vue';
import type { MapOldSources, MapSources } from '../../../types';
import { bypassFilter, createFilterWrapper } from '../../shared';
import type { WatchWithFilterOptions } from '../watchWithFilter';

// watchIgnorable(source,callback,options) composable
//
// Extended watch that exposes a ignoreUpdates(updater) function that allows to update the source without triggering effects

export type IgnoredUpdater = (updater: () => void) => void;

export interface WatchIgnorableReturn {
  ignoreUpdates: IgnoredUpdater;
  // ignorePrevAsyncUpdates: () => void;
  stop: WatchStopHandle;
}

export function watchIgnorable<
  T extends Readonly<WatchSource<unknown>[]>,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchWithFilterOptions<Immediate>,
): WatchIgnorableReturn;
export function watchIgnorable<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchWithFilterOptions<Immediate>,
): WatchIgnorableReturn;
export function watchIgnorable<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchWithFilterOptions<Immediate>,
): WatchIgnorableReturn;

export function watchIgnorable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchIgnorableReturn {
  const { eventFilter = bypassFilter, ...watchOptions } = options;

  const filteredCb = createFilterWrapper(eventFilter, cb);

  let ignoreUpdates: IgnoredUpdater;
  let ignorePrevAsyncUpdates: () => void;
  let stop: () => void;

  // if (watchOptions.flush === 'sync') {
  const ignore = ref(false);
  // no op for flush: sync
  ignorePrevAsyncUpdates = () => {};

  ignoreUpdates = (updater: () => void) => {
    // Call the updater function and count how many sync updates are performed,
    // then add them to the ignore count
    ignore.value = true;
    console.log('---ignoreUpdates---', ignore.value);
    updater();
    ignore.value = false;
  };

  stop = watch(
    source,
    (...args) => {
      console.log(ignore.value);
      if (!ignore.value) {
        filteredCb(...args);
      }
    },
    { flush: 'sync', ...watchOptions },
  );
  // } else {
  //   // flush 'pre' and 'post'

  //   // const disposables: Fn[] = []

  //   // const ignoreCounter = ref(0)
  //   // const syncCounter = ref(0)

  //   // ignorePrevAsyncUpdates = () => {
  //   //   ignoreCounter.value = syncCounter.value
  //   // }

  //   // // Sync watch to count modifications to the source
  //   // disposables.push(
  //   //   watch(
  //   //     source,
  //   //     () => {
  //   //       syncCounter.value++
  //   //     },
  //   //     { ...watchOptions, flush: 'sync' },
  //   //   ),
  //   // )

  // }

  return {
    stop,
    ignoreUpdates,
  };
}
