export declare const isClient: boolean;
export declare const isBlob: (target: any) => boolean;
export declare const isCanvasElement: (target: any) => target is HTMLCanvasElement;
export declare const isImageElement: (target: any) => target is HTMLImageElement;
export declare const notNullish: <T = any>(val?: T | null | undefined) => val is T;
export declare const isIOS: boolean | "";
