import { useClerk, useUser } from "@clerk/clerk-react";
import { FaSignInAlt, FaUserCircle } from 'react-icons/fa';
// ...existing imports...

const NavProfile = () => {
  const { signIn } = useClerk();
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <Link 
          to="/dashboard" 
          className="flexCenter gap-x-1 rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-gray-100"
        >
          <FaUserCircle className="text-xl" />
          <span>Dashboard</span>
        </Link>
      ) : (
        <button
          onClick={() => signIn()}
          className="flexCenter gap-x-1 rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-gray-100"
        >
          <FaSignInAlt className="text-xl" />
          <span>Sign In</span>
        </button>
      )}

      // ...existing user menu code...
    </div>
  );
};

export default NavProfile;
