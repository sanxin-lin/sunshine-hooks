import { defineComponent, reactive } from 'vue';
import { useWindowFocus } from './hooks';

export const UseWindowFocus = /*#__PURE__*/ defineComponent({
  name: 'WindowFocus',
  setup(_, { slots }) {
    const data = reactive({
      focused: useWindowFocus(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
