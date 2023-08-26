import type { EffectScope } from 'vue';
import { effectScope } from 'vue';
import { tryOnScopeDispose } from '../../reactivity';
import type { AnyFn } from '../../../types';

/**
 * Make a composable function usable with multiple Vue instances.
 */

export function createSharedComposable<Fn extends AnyFn>(composable: Fn): Fn {
  let subscribers = 0;
  let state: ReturnType<Fn> | undefined;
  let scope: EffectScope | undefined;

  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = undefined;
      scope = undefined;
    }
  };

  return <Fn>((...args: any[]) => {
    subscribers += 1;
    if (!state) {
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }

    tryOnScopeDispose(dispose);
    return state;
  });
}
