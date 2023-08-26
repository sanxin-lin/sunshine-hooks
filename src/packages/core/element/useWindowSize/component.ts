import { defineComponent, reactive } from 'vue';
import type { UseWindowSizeOptions } from './hooks';
import { useWindowSize } from './hooks';

export const UseWindowSize = /*#__PURE__*/ defineComponent<UseWindowSizeOptions>({
  name: 'UseWindowSize',
  props: ['initialWidth', 'initialHeight'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useWindowSize(props));

    return () => {
      if (slots.default) return slots.default(data);
    };
  },
});
