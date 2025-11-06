import React, { useState, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { MdHomeWork, MdViewQuilt, MdAddHome, MdContactSupport } from 'react-icons/md'
import PropTypes from 'prop-types'
import { useAuth } from '@clerk/clerk-react';
import { Dialog, Transition } from '@headlessui/react';

const Navbar = ({ containerStyles }) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    const handleAddHome = () => {
        if (!isSignedIn) {
            setShowAuthModal(true);
            return;
        }
        navigate('/create-listing');
    };

    const AuthModal = () => (
        <Transition appear show={showAuthModal} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setShowAuthModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-xl font-semibold mb-4">
                                    Sign in Required
                                </Dialog.Title>

                                <Dialog.Description className="mb-6 text-gray-600">
                                    You need to be signed in to list a property. Would you like to sign in now?
                                </Dialog.Description>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowAuthModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(false);
                                            navigate('/sign-in', { 
                                                state: { returnTo: '/create-listing' }
                                            });
                                        }}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(false);
                                            navigate('/sign-up', { 
                                                state: { returnTo: '/create-listing' }
                                            });
                                        }}
                                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

    const navLinkClasses = ({ isActive }) => 
        `flexCenter gap-x-1 rounded-lg px-4 py-2 transition-colors duration-200 ${
            isActive 
                ? 'bg-secondary text-white' 
                : 'hover:bg-gray-100'
        }`;

    const buttonClasses = 
        "flexCenter gap-x-1 rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-gray-100";

    return (
        <>
            <nav className={containerStyles}>
                <NavLink to={"/"} className={navLinkClasses}>
                    <MdHomeWork className="text-xl" />
                    <div>Welcome</div>
                </NavLink>

                <NavLink to={"/listings"} className={navLinkClasses}>
                    <MdViewQuilt className="text-xl" />
                    <div>Listings</div>
                </NavLink>

                <button 
                    onClick={handleAddHome}
                    type="button"
                    className="flexCenter gap-x-1 rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200"
                >
                    <MdAddHome className="text-xl" />
                    <div>Add Home</div>
                </button>

                <NavLink to={"/contact"} className={navLinkClasses}>
                    <MdContactSupport className="text-xl" />
                    <div>Contact</div>
                </NavLink>
            </nav>
            <AuthModal />
        </>
    )
}

Navbar.propTypes = {
    containerStyles: PropTypes.string.isRequired,
}

export default Navbar