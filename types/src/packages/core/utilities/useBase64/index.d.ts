import type { Ref } from 'vue';
import type { MaybeRef } from '../../../types';
export interface ToDataURLOptions {
    /**
     * MIME type
     */
    type?: string | undefined;
    /**
     * Image quality of jpeg or webp
     */
    quality?: any;
}
export interface UseBase64Return {
    base64: Ref<string>;
    promise: Ref<Promise<string>>;
    execute: () => Promise<string>;
}
export declare function useBase64(target: MaybeRef<string>): UseBase64Return;
export declare function useBase64(target: MaybeRef<Blob>): UseBase64Return;
export declare function useBase64(target: MaybeRef<ArrayBuffer>): UseBase64Return;
export declare function useBase64(target: MaybeRef<HTMLCanvasElement>): UseBase64Return;
export declare function useBase64(target: MaybeRef<HTMLImageElement>): UseBase64Return;
