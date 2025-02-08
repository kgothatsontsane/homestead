import { PuffLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const LoadingSpinner = ({ size = 40, showProgress = false, progress = 0 }) => {
  const { secondary } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] gap-4">
      <PuffLoader color={secondary} size={size} />
      
      {showProgress && (
        <div className="w-48 bg-secondary/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
