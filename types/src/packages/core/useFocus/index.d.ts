import type { Ref } from 'vue';
import type { MaybeElementRef, ConfigurableWindow } from '../../types';
export interface FocusOptions extends ConfigurableWindow {
    /**
     * Initial value. If set true, then focus will be set on the target
     *
     * @default false
     */
    initialValue?: boolean;
    /**
     * The target element for the focus and blur events.
     */
    target?: MaybeElementRef;
}
export interface FocusReturn {
    /**
     * If read as true, then the element has focus. If read as false, then the element does not have focus
     * If set to true, then the element will be focused. If set to false, the element will be blurred.
     */
    focused: Ref<boolean>;
}
export declare function useFocus(options?: FocusOptions): FocusReturn;
