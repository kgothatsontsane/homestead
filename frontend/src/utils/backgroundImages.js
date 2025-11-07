export const propertyBackgrounds = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
];

// Preload images and cache them
const preloadedImages = new Map();

export const preloadBackgrounds = () => {
  propertyBackgrounds.forEach(url => {
    const fullUrl = `${url}?auto=format&fit=crop&w=2000&q=80`;
    if (!preloadedImages.has(fullUrl)) {
      const img = new Image();
      img.src = fullUrl;
      preloadedImages.set(fullUrl, img);
    }
  });
};

export const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * propertyBackgrounds.length);
  const url = `${propertyBackgrounds[randomIndex]}?auto=format&fit=crop&w=2000&q=80`;
  
  // If not preloaded yet, preload it now
  if (!preloadedImages.has(url)) {
    preloadBackgrounds();
  }
  
  return url;
};
