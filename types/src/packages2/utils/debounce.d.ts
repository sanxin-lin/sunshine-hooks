/// <reference types="lodash" />
export declare const createDebounceWrapper: (func: (...args: any) => any, wait?: number | undefined, options?: import("lodash").DebounceSettings | undefined) => import("lodash").DebouncedFunc<(...args: any) => any>;
export declare const createThrottleWrapper: (func: (...args: any) => any, wait?: number | undefined, options?: import("lodash").ThrottleSettings | undefined) => import("lodash").DebouncedFunc<(...args: any) => any>;
