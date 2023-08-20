import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle'

export const createDebounceWrapper = (...args: Parameters<typeof debounce>) => {
  return debounce(...args);
};


export const createThrottleWrapper = (...args: Parameters<typeof throttle>) => {
  return throttle(...args);
};