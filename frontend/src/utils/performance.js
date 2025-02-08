export const PERF_THRESHOLDS = {
  timeout: 50,
  heavyOperation: 100,
  animation: 16 // ~60fps
};

export const scheduleCallback = (callback, priority = 'normal') => {
  if (priority === 'high') {
    return requestAnimationFrame(callback);
  }
  
  if (priority === 'low') {
    return requestIdleCallback ? 
      requestIdleCallback(callback) : 
      setTimeout(callback, 0);
  }
  
  return setTimeout(callback, 0);
};

export const throttleRAF = (callback) => {
  let frameId = null;
  return (...args) => {
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      callback(...args);
      frameId = null;
    });
  };
};
