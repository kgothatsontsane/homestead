import axios from 'axios';
import debounce from '../utils/debounce';
import { ROLES } from '../utils/userRoles';

// Fix API URL handling
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api`;

export const testApiConnection = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/health`);
    console.log('API connection test:', response.data);
    return response.data;
  } catch (error) {
    console.warn('API connection test failed - this is expected during development:', error.message);
    return { status: 'warning', message: 'API connection failed but continuing' };
  }
};

// Update debounced save role to use the centralized utility
const debouncedSaveRole = debounce(async (userId, email, role) => {
  console.log('Native debounced save user role:', { userId, email, role });
  try {
    const response = await axios.post(`${API_URL}/users`, {
      clerkId: userId,
      email,
      role
    });
    return response.data;
  } catch (error) {
    console.error('Error saving user role:', error);
    throw error;
  }
}, 300);

// Update saveUserRole to use native debouncing
export const saveUserRole = async (userId, email, role) => {
  return debouncedSaveRole(userId, email, role);
};

export const getUserRole = async (userId) => {
  if (!userId) {
    console.warn('⚠️ No user ID provided');
    return 'agent';
  }

  try {
    console.log('🔍 Fetching role for user:', userId);
    const response = await axios.get(`${API_URL}/api/users/${userId}`);
    console.log('📡 DB role response:', response.data);
    return response.data.role || 'agent';
  } catch (error) {
    console.warn('⚠️ Error fetching role:', error);
    return 'agent';
  }
};

export const saveUserProfile = async (userData) => {
  try {
    console.log('💾 Saving profile with role:', userData.role);
    
    // First update Clerk metadata directly
    if (userData.user) {
      console.log('🔄 Updating Clerk metadata...');
      await userData.user.update({
        publicMetadata: { role: 'agent' }
      });
      await userData.user.reload();
      const metadata = await userData.user.getPublicMetadata();
      console.log('✅ Clerk metadata updated:', metadata);
    }

    // Then save to database
    const response = await axios.post(`${API_URL}/users/profile`, {
      clerkId: userData.clerkId,
      email: userData.email,
      username: userData.username,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: 'agent' // Force agent role
    });

    console.log('✅ Profile saved to DB:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Profile save failed:', error);
    throw error;
  }
};

export const initializeUserRole = async (user) => {
  try {
    console.log('🔄 Initializing user role...');
    
    const metadata = user.publicMetadata || {};
    
    if (!metadata.initialized) {
      await user.update({
        publicMetadata: {
          roles: [ROLES.UNSET],
          primaryRole: ROLES.UNSET,
          initialized: true,
          lastUpdated: new Date().toISOString()
        }
      });
      console.log('✅ User role initialized as unset');
    }

    return { roles: [ROLES.UNSET], primaryRole: ROLES.UNSET };
  } catch (error) {
    console.error('❌ Role initialization failed:', error);
    return { roles: [ROLES.UNSET], primaryRole: ROLES.UNSET };
  }
};

// Add retry logic with exponential backoff
const retryOperation = async (operation, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

export const setUserRole = async (user, role) => {
  if (!user) throw new Error('No user provided');
  
  return retryOperation(async () => {
    const metadata = user.unsafeMetadata || {};
    await user.update({
      unsafeMetadata: { 
        ...metadata,
        role,
        lastUpdated: new Date().toISOString()
      }
    });
    return role;
  });
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/role`, {
      role
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};

export const syncUserData = async ({ user, ...userData }) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/sync`, {
      clerkId: user.id,
      ...userData,
      roles: userData.roles,
      primaryRole: userData.primaryRole
    });

    return response.data;
  } catch (error) {
    console.error('Failed to sync user data:', error);
    throw error;
  }
};

// Add role verification function
export const verifyUserRoles = async (userId) => {
  if (!userId) {
    console.error('❌ No userId provided for role verification');
    return defaultResponse(true); // Indicates needs sync
  }

  try {
    const [clerkResponse, dbResponse] = await Promise.all([
      axios.get(`${API_URL}/clerk/user/${userId}`).catch(handleClerkError),
      axios.get(`${API_URL}/users/${userId}`).catch(handleDbError)
    ]);

    const clerkData = clerkResponse?.data;
    const dbData = dbResponse?.data;

    if (!clerkData || !dbData) {
      console.warn('⚠️ Missing data from one or both sources');
      return defaultResponse(true); // Indicates needs sync
    }

    const rolesMatch = JSON.stringify(clerkData.roles?.sort()) === JSON.stringify(dbData.roles?.sort());
    const hasValidRoles = (clerkData.roles || []).some(role => role !== ROLES.UNSET);

    return {
      rolesMatch,
      clerkData,
      dbData,
      needsSync: !rolesMatch || !hasValidRoles
    };
  } catch (error) {
    console.error('❌ Role verification failed:', error);
    return defaultResponse(true); // Indicates needs sync
  }
};

const handleClerkError = (error) => {
  console.error('Clerk API Error:', error);
  return null;
};

const handleDbError = (error) => {
  console.error('Database API Error:', error);
  return null;
};

const defaultResponse = (needsSync = false) => ({
  rolesMatch: false,
  clerkData: { roles: [ROLES.UNSET], activeRole: ROLES.UNSET },
  dbData: { roles: [ROLES.UNSET], activeRole: ROLES.UNSET },
  needsSync
});

export const syncUserRoles = async (userId, roles, primaryRole) => {
  console.log('🔄 Syncing user roles:', { userId, roles, primaryRole });
  
  if (!userId || !roles || !primaryRole) {
    throw new Error('Missing required parameters for role sync');
  }

  try {
    // Update database first
    const dbResponse = await axios.post(`${API_URL}/api/users/sync-roles/${userId}`, {
      roles,
      primaryRole,
      lastUpdated: new Date().toISOString()
    });

    // Update Clerk metadata
    await axios.patch(`${API_URL}/api/users/${userId}/metadata`, {
      unsafeMetadata: {  // Changed from publicMetadata to unsafeMetadata
        roles,
        primaryRole,
        lastUpdated: new Date().toISOString()
      }
    });

    return dbResponse.data;
  } catch (error) {
    console.error('❌ Role sync failed:', error);
    throw new Error(error.response?.data?.message || 'Role sync failed');
  }
};

export const updateUserProfile = async (userData) => {
  console.log('📝 Updating user profile:', userData);
  try {
    // Update Clerk user with correct metadata parameter
    if (userData.user) {
      await userData.user.update({
        firstName: userData.firstName,
        lastName: userData.lastName,
        unsafeMetadata: {  // Changed from publicMetadata to unsafeMetadata
          ...userData.user.unsafeMetadata,
          roles: userData.roles,
          primaryRole: userData.primaryRole,
          lastUpdated: new Date().toISOString()
        }
      });
    }

    // Then sync with database
    const dbUpdate = await axios.post(`${API_URL}/api/users/sync-profile/${userData.user.id}`, {
      ...userData,
      lastUpdated: new Date().toISOString()
    });

    console.log('✅ Profile sync complete:', { db: dbUpdate.data });
    return dbUpdate.data;
  } catch (error) {
    console.error('❌ Profile update failed:', error);
    throw error;
  }
};

export const completeUserProfile = async ({ user, formData }) => {
  try {
    // First update Clerk profile
    await user.update({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username
    });

    // Then sync with our database
    const userData = {
      clerkId: user.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: user.emailAddresses[0].emailAddress,
      profileComplete: true
    };

    const response = await axios.post('/api/users/complete-profile', userData);
    return response.data;
  } catch (error) {
    console.error('Profile completion failed:', error);
    throw error;
  }
};

export const createUserProfile = async ({ signUpClient, userData }) => {
  try {
    // Use the signUpClient from Clerk hook instead of direct Clerk.signUp
    const result = await signUpClient.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      emailAddress: userData.email,
      phoneNumber: userData.phoneNumber || undefined,
      password: userData.password
    });

    // Prepare the user and continue sign up
    await signUpClient.prepareEmailAddressVerification({ strategy: "email_code" });

    // Then sync with our database
    const dbUser = await axios.post(`${API_URL}/api/users`, {
      clerkId: result.createdSessionId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      roles: ['unset'],
      primaryRole: 'unset'
    });

    return { clerkUser: result, dbUser: dbUser.data };
  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
};
