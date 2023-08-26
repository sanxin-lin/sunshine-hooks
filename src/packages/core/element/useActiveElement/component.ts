import { defineComponent, reactive } from 'vue';
import { useActiveElement } from './hooks';

export const UseActiveElement = /*#__PURE__*/ defineComponent({
  name: 'UseActiveElement',
  setup(_, { slots }) {
    const data = reactive({
      element: useActiveElement(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
