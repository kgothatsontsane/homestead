import axios from 'axios';
import { ROLES } from '../utils/userRoles';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const testApiConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('API connection test:', response.data);
    return response.data;
  } catch (error) {
    console.warn('API connection test failed - this is expected during development:', error.message);
    return { status: 'warning', message: 'API connection failed but continuing' };
  }
};

export const syncUserData = async ({ user, ...userData }) => {
  try {
    const response = await axios.post(`${API_URL}/users/sync-profile/${user.id}`, {
      clerkId: user.id,
      ...userData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to sync user data:', error);
    throw error;
  }
};

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
    await axios.post(`${API_URL}/users/${userId}/metadata`, {
      unsafeMetadata: {
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
        unsafeMetadata: {
          ...userData.user.unsafeMetadata,
          roles: userData.roles,
          primaryRole: userData.primaryRole,
          lastUpdated: new Date().toISOString()
        }
      });
    }

    // Then sync with database
    const dbUpdate = await axios.post(`${API_URL}/users/sync-profile/${userData.user.id}`, {
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
