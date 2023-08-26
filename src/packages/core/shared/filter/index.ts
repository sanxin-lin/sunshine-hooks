import { readonly, ref } from 'vue';
import type { Pausable, EventFilter, AnyFn, ArgumentsType } from '../../../types';

export const bypassFilter: EventFilter = (invoke) => {
  return invoke();
};

/**
 * EventFilter that gives extra controls to pause and resume the filter
 *
 * @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
 *
 */
export function pausableFilter(
  extendFilter: EventFilter = bypassFilter,
): Pausable & { eventFilter: EventFilter } {
  const isActive = ref(true);

  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }

  const eventFilter: EventFilter = (...args) => {
    if (isActive.value) extendFilter(...args);
  };

  return { isActive: readonly(isActive), pause, resume, eventFilter };
}

export function createFilterWrapper<T extends AnyFn>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: ArgumentsType<T>) {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject);
    });
  }
  return wrapper;
}
