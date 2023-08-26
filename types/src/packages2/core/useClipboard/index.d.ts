import type { MaybeRefOrGetter, ConfigurableNavigator } from '../../types';
import type { Ref } from 'vue';
export interface UseClipboardOptions<Source> extends ConfigurableNavigator {
    /**
     * Enabled reading for clipboard
     *
     * @default false
     */
    read?: boolean;
    /**
     * Copy source
     */
    source?: Source;
    /**
     * Milliseconds to reset state of `copied` ref
     *
     * @default 1500
     */
    copiedDuring?: number;
    /**
     * Whether fallback to document.execCommand('copy') if clipboard is undefined.
     *
     * @default false
     */
    legacy?: boolean;
}
export interface UseClipboardReturn<Optional> {
    isSupported: Ref<boolean>;
    text: Ref<string>;
    copied: Ref<boolean>;
    copy: Optional extends true ? (text?: string) => Promise<void> : (text: string) => Promise<void>;
}
/**
 * Reactive Clipboard API.
 * @param options
 */
export declare function useClipboard(options?: UseClipboardOptions<undefined>): UseClipboardReturn<false>;
export declare function useClipboard(options: UseClipboardOptions<MaybeRefOrGetter<string>>): UseClipboardReturn<true>;
