import { ref, reactive, defineComponent, h } from 'vue';
import { useElementBounding } from './hooks';
import type { RenderableComponent } from '../../../types';

export const UseElementBounding = /*#__PURE__*/ defineComponent<RenderableComponent>({
  name: 'UseElementBounding',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref();
    const data = reactive(useElementBounding(target));

    return () => {
      if (slots.default) return h(props.as || 'div', { ref: target }, slots.default(data));
    };
  },
});
