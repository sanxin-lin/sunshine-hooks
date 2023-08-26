import type { ObjectDirective } from 'vue';
import { watch } from 'vue';
import { useElementSize } from './hooks';
import type { ElementSize } from './hooks';
import isFunction from 'lodash/isFunction';

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
  ? I
  : [];

type BindingValueFunction = (size: ElementSize) => void;
type VElementSizeOptions = RemoveFirstFromTuple<Parameters<typeof useElementSize>>;
type BindingValueArray = [BindingValueFunction, ...VElementSizeOptions];

export const vElementSize: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray> =
  {
    mounted(el, binding) {
      const value = binding.value;
      const handler = isFunction(value) ? value : value[0];
      const options = (
        isFunction(value) ? [] : value.slice(1)
      ) as RemoveFirstFromTuple<BindingValueArray>;

      const { width, height } = useElementSize(el, ...options);

      watch([width, height], ([width, height]) => handler({ width, height }));
    },
  };
