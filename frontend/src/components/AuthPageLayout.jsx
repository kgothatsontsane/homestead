import { useEffect, useState } from 'react';
import { getRandomBackground, preloadBackgrounds } from '../utils/backgroundImages';

const AuthPageLayout = ({ children }) => {
  const [bgImage, setBgImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure images are preloaded before showing
    preloadBackgrounds();
    setBgImage(getRandomBackground());
    setIsLoading(false);
  }, []);

  return (
    <div 
      className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 relative z-10">
        <h1 className="text-center text-3xl font-bold text-white">
          Welcome to <span className="text-primary">Homestead</span>
        </h1>
        <p className="mt-2 text-center text-sm text-gray-300">
          {children.props.subtitle}
        </p>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthPageLayout;
