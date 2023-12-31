import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import type {
  MaybeRefOrGetter,
  Pausable,
  MaybeComputedElementRef,
  MaybeElement,
} from '../../../types';
import { toValue } from '../../shared';
import { useSupported } from '../../utilities';
import { tryOnScopeDispose } from '../../reactivity';
import { unrefElement } from '../../components';
import { defaultWindow, noop, notNullish } from '../../../utils';
import isArray from 'lodash/isArray';

export interface UseIntersectionObserverOptions {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeComputedElementRef;

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string;

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   */
  threshold?: number | number[];
}

export interface UseIntersectionObserverReturn extends Pausable {
  isSupported: Ref<boolean>;
  stop: () => void;
}

/**
 * Detects that a target element's visibility.
 * @param target
 * @param callback
 * @param options
 */
export function useIntersectionObserver(
  target: MaybeComputedElementRef | MaybeRefOrGetter<MaybeElement[]> | MaybeComputedElementRef[],
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const { root, rootMargin = '0px', threshold = 0.1, immediate = true } = options;

  const isSupported = useSupported(() => defaultWindow && 'IntersectionObserver' in defaultWindow);
  const targets = computed(() => {
    const _target = toValue(target);
    return (isArray(_target) ? _target : [_target]).map(unrefElement).filter(notNullish);
  });

  let cleanup = noop;
  const isActive = ref(immediate);

  const stopWatch = isSupported.value
    ? watch(
        () => [targets.value, unrefElement(root), isActive.value] as const,
        ([targets, root]) => {
          cleanup();
          if (!isActive.value) return;
          if (!targets.length) return;

          const ovserver = new IntersectionObserver(callback, {
            root: unrefElement(root),
            rootMargin,
            threshold,
          });

          targets.forEach(el => el && ovserver.observe(el));

          cleanup = () => {
            ovserver.disconnect();
            cleanup = noop;
          };
        },
        { immediate, flush: 'post' },
      )
    : noop;

  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };

  tryOnScopeDispose(stop);

  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop,
  };
}
