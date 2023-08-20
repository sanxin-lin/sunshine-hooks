export const isClient = typeof window !== 'undefined';
export const isBlob = (target: any) => target instanceof Blob;
export const isCanvasElement = (target: any): target is HTMLCanvasElement =>
  target instanceof HTMLCanvasElement;
export const isImageElement = (target: any): target is HTMLImageElement =>
  target instanceof HTMLImageElement;

export const notNullish = <T = any>(val?: T | null | undefined): val is T => val != null;

const getIsIOS = () => {
  return (
    isClient &&
    /*#__PURE__*/ window?.navigator?.userAgent &&
    /*#__PURE__*/ /iP(ad|hone|od)/.test(/*#__PURE__*/ window.navigator.userAgent)
  );
};
export const isIOS = /*#__PURE__*/ getIsIOS();
