import { timestamp } from '../../../utils';
import type { Ref } from 'vue';
import { computed, markRaw, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';

export interface UseRefHistoryRecord<T> {
  snapshot: T;
  timestamp: number;
}

export interface UseManualRefHistoryOptions<Raw> {
  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number;
  /**
   * Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)).
   * Default to false
   *
   * @default false
   */
  clone?: boolean | ((v: Raw) => Raw);

  /**
   * set data source
   */
  setSource?: (source: Ref<Raw>, v: Raw) => void;
}

export interface UseManualRefHistoryReturn<Raw> {
  /**
   * Bypassed tracking ref from the argument
   */
  source: Ref<Raw>;

  /**
   * An array of history records for undo, newest comes to first
   */
  history: Ref<UseRefHistoryRecord<Raw>[]>;

  /**
   * Last history point, source can be different if paused
   */
  last: Ref<UseRefHistoryRecord<Raw>>;

  /**
   * Same as {@link UseManualRefHistoryReturn.history | history}
   */
  undoStack: Ref<UseRefHistoryRecord<Raw>[]>;

  /**
   * Records array for redo
   */
  redoStack: Ref<UseRefHistoryRecord<Raw>[]>;

  /**
   * A ref representing if undo is possible (non empty undoStack)
   */
  canUndo: Ref<boolean>;

  /**
   * A ref representing if redo is possible (non empty redoStack)
   */
  canRedo: Ref<boolean>;

  /**
   * Undo changes
   */
  undo: () => void;

  /**
   * Redo changes
   */
  redo: () => void;

  /**
   * Clear all the history
   */
  clear: () => void;

  /**
   * Create a new history record
   */
  commit: () => void;

  /**
   * Reset ref's value with latest history
   */
  reset: () => void;
}

function fnSetSource<F>(source: Ref<F>, value: F) {
  return (source.value = value);
}

/**
 * Track the change history of a ref, also provides undo and redo functionality.
 * @param source
 * @param options
 */

export function useManualRefHistory<Raw>(
  source: Ref<Raw>,
  options: UseManualRefHistoryOptions<Raw> = {},
): UseManualRefHistoryReturn<Raw> {
  const { setSource = fnSetSource } = options;

  const _createHistoryRecord = (): UseRefHistoryRecord<Raw> => {
    return markRaw({
      snapshot: cloneDeep(source.value),
      timestamp: timestamp(),
    });
  };

  const last = ref(_createHistoryRecord()) as Ref<UseRefHistoryRecord<Raw>>;

  const undoStack: Ref<UseRefHistoryRecord<Raw>[]> = ref([]);
  const redoStack: Ref<UseRefHistoryRecord<Raw>[]> = ref([]);

  const _setSource = (record: UseRefHistoryRecord<Raw>) => {
    setSource(source, record.snapshot);
    last.value = record;
  };

  const commit = () => {
    undoStack.value.unshift(last.value);
    last.value = _createHistoryRecord();

    if (options.capacity && undoStack.value.length > options.capacity) {
      undoStack.value.splice(options.capacity, Number.POSITIVE_INFINITY);
    }
    if (redoStack.value.length) {
      redoStack.value.splice(0, redoStack.value.length);
    }
  };

  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length);
    redoStack.value.splice(0, redoStack.value.length);
  };

  const undo = () => {
    const state = undoStack.value.shift();

    if (state) {
      redoStack.value.unshift(last.value);
      _setSource(state);
    }
  };

  const redo = () => {
    const state = redoStack.value.shift();

    if (state) {
      undoStack.value.unshift(last.value);
      _setSource(state);
    }
  };

  const reset = () => {
    _setSource(last.value);
  };

  const history = computed(() => [last.value, ...undoStack.value]);

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,

    clear,
    commit,
    reset,
    undo,
    redo,
  };
}
