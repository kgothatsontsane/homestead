import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/common/Modal';
import SignInForm from '../components/SignInForm';  // Update path
import SignUpForm from '../components/SignUpForm';  // Update path

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'signin' or 'signup'

  const openModal = useCallback((type) => {
    setModalType(type);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === 'signin' && <SignInForm onClose={closeModal} />}
        {modalType === 'signup' && <SignUpForm onClose={closeModal} />}
      </Modal>
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
