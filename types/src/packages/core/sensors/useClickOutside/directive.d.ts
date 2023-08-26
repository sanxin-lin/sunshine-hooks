import type { ObjectDirective, App } from 'vue';
import type { OnClickOutsideHandler, OnClickOutsideOptions } from './hooks';
export declare const vClickOutside: ObjectDirective<HTMLElement, OnClickOutsideHandler | [(evt: any) => void, OnClickOutsideOptions]>;
export declare const vClickOutsideUse: {
    install: (app: App<Element>) => void;
};
