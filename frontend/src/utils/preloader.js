export class Preloader {
  constructor() {
    this.cache = new Map();
    this.progress = 0;
    this.total = 0;
    this.loaded = 0;
  }

  async preloadImage(src) {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    this.total++;
    
    try {
      const img = new Image();
      const promise = new Promise((resolve, reject) => {
        img.onload = () => {
          this.loaded++;
          this.progress = (this.loaded / this.total) * 100;
          resolve(img);
        };
        img.onerror = reject;
      });

      img.src = src;
      this.cache.set(src, promise);
      return promise;
    } catch (error) {
      console.error('Failed to preload image:', src, error);
      this.loaded++;
      return null;
    }
  }

  async preloadComponent(importFn) {
    this.total++;
    try {
      const result = await importFn();
      this.loaded++;
      this.progress = (this.loaded / this.total) * 100;
      return result;
    } catch (error) {
      console.error('Failed to preload component:', error);
      this.loaded++;
      return null;
    }
  }

  getProgress() {
    return Math.min(100, Math.round(this.progress));
  }

  reset() {
    this.progress = 0;
    this.total = 0;
    this.loaded = 0;
  }
}

export const globalPreloader = new Preloader();
