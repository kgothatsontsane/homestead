import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState('signin');

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Dialog
      as={motion.div}
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Updated background with gradient and blur */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Add glowing effect behind the form */}
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-3xl" />
          
          <AnimatePresence mode="wait">
            {authMode === 'signin' ? (
              <SignInForm 
                onClose={onClose}
                onSwitchMode={toggleAuthMode}
              />
            ) : (
              <SignUpForm 
                onClose={onClose}
                onSwitchMode={toggleAuthMode}
              />
            )}
          </AnimatePresence>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal;
