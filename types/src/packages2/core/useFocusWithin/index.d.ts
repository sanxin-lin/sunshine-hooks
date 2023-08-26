import type { Ref } from 'vue';
import type { MaybeElementRef, ConfigurableWindow } from '../../types';
export interface FocusWithinReturn {
    /**
     * True if the element or any of its descendants are focused
     */
    focused: Ref<boolean>;
}
export declare function useFocusWithin(target: MaybeElementRef, options: ConfigurableWindow): FocusWithinReturn;
