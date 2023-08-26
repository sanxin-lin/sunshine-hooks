import type { Fn, ConfigurableEventFilter } from '../../../types';
import { watchIgnorable } from '../../watch';
import { pausableFilter } from '../../shared';
import type { Ref } from 'vue';
import type { UseManualRefHistoryReturn } from '../useManualRefHistory';
import { useManualRefHistory } from '../useManualRefHistory';

export interface UseRefHistoryOptions extends ConfigurableEventFilter {
  /**
   * Watch for deep changes, default to false
   *
   * When set to true, it will also create clones for values store in the history
   *
   * @default false
   */
  deep?: boolean;

  /**
   * The flush option allows for greater control over the timing of a history point, default to 'pre'
   *
   * Possible values: 'pre', 'post', 'sync'
   * It works in the same way as the flush option in watch and watch effect in vue reactivity
   *
   * @default 'pre'
   */
  flush?: 'pre' | 'post' | 'sync';

  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number;
}

export interface UseRefHistoryReturn<Raw> extends Partial<UseManualRefHistoryReturn<Raw>> {
  /**
   * A ref representing if the tracking is enabled
   */
  isTracking: Ref<boolean>;

  /**
   * Pause change tracking
   */
  pause(): void;

  /**
   * Resume change tracking
   *
   * @param [commit] if true, a history record will be create after resuming
   */
  resume(commit?: boolean): void;

  /**
   * A sugar for auto pause and auto resuming within a function scope
   *
   * @param fn
   */
  batch(fn: (cancel: Fn) => void): void;

  /**
   * Clear the data and stop the watch
   */
  dispose(): void;
}

/**
 * Track the change history of a ref, also provides undo and redo functionality.
 * @param source
 * @param options
 */

export function useRefHistory<Raw>(source: Ref<Raw>, options: UseRefHistoryOptions = {}) {
  const { deep, flush = 'pre', eventFilter } = options;

  const {
    eventFilter: composedFilter,
    pause,
    resume: resumeTracking,
    isActive: isTracking,
  } = pausableFilter(eventFilter);

  const { clear, commit, history, undo, redo } = useManualRefHistory(source, options);

  const { ignoreUpdates, stop } = watchIgnorable(source, commit, {
    deep,
    flush,
    eventFilter: composedFilter,
  });

  const resume = (commitNow?: boolean) => {
    resumeTracking();
    if (commitNow) commit();
  };

  const batch = (fn: (cancel: Fn) => void) => {
    let canceled = false;

    const cancel = () => (canceled = true);

    ignoreUpdates(() => {
      fn(cancel);
    });

    if (!canceled) {
      commit();
    }
  };

  const dispose = () => {
    stop();
    clear();
  };

  return {
    isTracking,
    history,
    pause,
    resume,
    commit,
    batch,
    dispose,
    undo,
    redo,
  };
}
