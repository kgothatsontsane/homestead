import axios from 'axios';
import debounce from '../utils/debounce';

const API_URL = import.meta.env.VITE_API_URL;

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
    
    // Get existing metadata
    const metadata = user.publicMetadata || {};
    
    if (!metadata.initialized) {
      await user.update({
        publicMetadata: {
          role: 'agent',
          initialized: true
        }
      });
      console.log('✅ User role initialized');
    }

    return metadata.role || 'agent';
  } catch (error) {
    console.error('❌ Role initialization failed:', error);
    return 'agent';
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

export const syncUserData = async (userData) => {
  console.log('🔄 Syncing user data:', userData);
  
  try {
    // First update Clerk
    const clerkUpdate = await userData.user.update({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      unsafeMetadata: {
        roles: userData.roles,
        activeRole: userData.roles[0],
        lastUpdated: new Date().toISOString(),
        onboardingComplete: true
      }
    });
    console.log('✅ Clerk update successful:', clerkUpdate);

    // Then sync with our database
    const dbResponse = await axios.post(`${API_URL}/users/sync`, {
      clerkId: userData.user.id,
      email: userData.user.emailAddresses[0].emailAddress,
      username: userData.username,
      first_name: userData.firstName,
      last_name: userData.lastName,
      roles: userData.roles,
      activeRole: userData.roles[0],
      lastRoleUpdate: new Date().toISOString(),
      onboardingComplete: true
    });
    console.log('✅ Database sync successful:', dbResponse.data);

    return { clerk: clerkUpdate, db: dbResponse.data };
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
};

// Add role verification function
export const verifyUserRoles = async (userId) => {
  if (!userId) {
    console.error('❌ No userId provided for role verification');
    return defaultResponse();
  }

  try {
    console.log('🔍 Verifying user roles for:', userId);
    const [clerkResponse, dbResponse] = await Promise.all([
      axios.get(`${API_URL}/clerk/user/${userId}`).catch(handleClerkError),
      axios.get(`${API_URL}/users/${userId}`).catch(handleDbError)
    ]);

    const clerkData = clerkResponse?.data;
    const dbData = dbResponse?.data;

    if (!clerkData || !dbData) {
      console.warn('⚠️ Missing data from one or both sources:', { clerkData, dbData });
      return defaultResponse();
    }

    const rolesMatch = JSON.stringify(clerkData.roles?.sort()) === JSON.stringify(dbData.roles?.sort());
    const activeRoleMatch = clerkData.activeRole === dbData.activeRole;

    console.log('🔄 Role verification:', {
      rolesMatch,
      activeRoleMatch,
      clerk: clerkData,
      db: dbData
    });

    return {
      rolesMatch: rolesMatch && activeRoleMatch,
      clerkData,
      dbData,
      needsSync: !rolesMatch || !activeRoleMatch
    };
  } catch (error) {
    console.error('❌ Role verification failed:', error);
    return defaultResponse();
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

const defaultResponse = () => ({
  rolesMatch: true,
  clerkData: { roles: ['buyer'], activeRole: 'buyer' },
  dbData: { roles: ['buyer'], activeRole: 'buyer' },
  needsSync: false
});
