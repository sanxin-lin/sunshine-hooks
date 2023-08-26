import type { ObjectDirective, App } from 'vue';
import type { UseScrollOptions, UseScrollReturn } from './hooks';
type BindingValueFunction = (state: UseScrollReturn) => void;
type BindingValueArray = [BindingValueFunction, UseScrollOptions];
export declare const vScroll: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray>;
export declare const vScrollUse: {
    install: (app: App<Element>) => void;
};
export {};
