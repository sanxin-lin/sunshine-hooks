import { defineComponent, reactive } from 'vue';
import { useDocumentVisibility } from './hooks';

export const UseDocumentVisibility = /*#__PURE__*/ defineComponent({
  name: 'UseDocumentVisibility',
  setup(_, { slots }) {
    const data = reactive({
      visibility: useDocumentVisibility(),
    });

    return () => {
      if (slots.default) {
        return slots.default(data);
      }
    };
  },
});
