import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue'
import type { MapOldSources, MapSources, MaybeRefOrGetter } from '../../../types'
import { watchWithFilter } from '../watchWithFilter'
import debounce from 'lodash/debounce'
import { toValue } from '../../shared'

export interface WatchDebouncedOptions<Immediate> extends WatchOptions<Immediate> {
  delay?: MaybeRefOrGetter<number>
}

// overloads
export function watchDebounced<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchDebouncedOptions<Immediate>): WatchStopHandle
export function watchDebounced<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchDebouncedOptions<Immediate>): WatchStopHandle
export function watchDebounced<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchDebouncedOptions<Immediate>): WatchStopHandle

export function watchDebounced<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchDebouncedOptions<Immediate> = {},
): WatchStopHandle {
  const {
    delay = 0,
    ...watchOptions
  } = options

  const _debounce = debounce((cb) => cb(), toValue(delay))

  return watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: _debounce
    }
  )

}