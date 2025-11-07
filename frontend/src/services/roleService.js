import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updateUserRole = async (userId, role) => {
  console.log('📝 Updating user role:', { userId, role });
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/roles/${userId}`, {
      role,
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Role update successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Role update failed:', error);
    throw error;
  }
};
