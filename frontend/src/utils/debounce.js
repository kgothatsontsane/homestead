import { scheduleCallback } from './performance';

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} options - The options object
 * @param {boolean} options.leading - Execute on the leading edge of the timeout
 * @param {boolean} options.trailing - Execute on the trailing edge of the timeout
 * @returns {Function} Returns the debounced function with cancel method
 */
export const debounce = (func, wait = 300, options = {}) => {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let result;
  let lastCallTime = 0;
  
  const leading = !!options.leading;
  const trailing = 'trailing' in options ? !!options.trailing : true;
  const maxWait = options.maxWait || wait * 2;

  function invokeFunc() {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastCallTime = Date.now();
    
    // Use RAF for expensive operations
    if (options.expensive) {
      requestAnimationFrame(() => {
        result = func.apply(thisArg, args);
      });
    } else {
      result = func.apply(thisArg, args);
    }
    return result;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking && leading) {
      return scheduleCallback(invokeFunc, 'high');
    }

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = scheduleCallback(() => {
      timeoutId = undefined;
      if (trailing && lastArgs) {
        invokeFunc();
      }
      lastArgs = lastThis = undefined;
    }, options.priority || 'normal');

    return result;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    return lastCallTime === 0 || 
           timeSinceLastCall >= wait || 
           timeSinceLastCall >= maxWait;
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    lastArgs = lastThis = timeoutId = undefined;
  };

  debounced.flush = () => {
    return timeoutId === undefined ? result : invokeFunc();
  };

  return debounced;
};

export default debounce;
