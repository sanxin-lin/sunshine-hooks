import { defineComponent, h, reactive, ref } from 'vue';
import type { ElementSize } from './hooks';
import { useElementSize } from './hooks';
import type { RenderableComponent } from '../../../types';
import type { UseResizeObserverOptions } from '../useResizeObserver';

export const UseElementSize = /*#__PURE__*/ defineComponent<
  ElementSize & UseResizeObserverOptions & RenderableComponent
>({
  name: 'UseElementSize',
  props: ['width', 'height', 'box'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref();
    const { width, height, box, as } = props;
    const data = reactive(useElementSize(target, { width, height }, { box }));

    return () => {
      if (slots.default) {
        return h(as || 'div', { ref: target }, slots.default(data));
      }
    };
  },
});
