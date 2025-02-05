import axios from 'axios'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

// @ts-ignore
const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables')
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Fetches all properties from the API
 * @async
 * @returns {Promise<Array>} Array of property objects
 * @throws {Error} If the API request fails
 */
export const getAllProperties = async () => {
  console.log('[API] Starting getAllProperties request');
  
  try {
    console.log('[API] Making request to:', `${baseURL}/api/property/allproperties`);
    
    const response = await api.get('/api/property/allproperties', {
      timeout: 10 * 1000
    })
    
    console.log('[API] Response received:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    
    if (response.status === 400 || response.status === 500 || response.status === 404 || response.status === 401) {
      console.error('[API] Error status received:', response.status);
      throw response.data;
    }
    
    // Add formatted dates while preserving original dates
    const formattedData = response.data.map(property => ({
      ...property,
      formattedDates: {
        created: dayjs(property.createdAt).format('DD MMM YYYY'),
        updated: dayjs(property.updatedAt).format('DD MMM YYYY')
      }
    }));
    
    return formattedData;
  } catch (error) {
    console.error('[API] Error in getAllProperties:', {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      }
    });
    
    toast.error(error.response?.data?.message || 'An error occurred while fetching properties');
    throw error;
  }
}

export const getProperty = async (id) => {
  console.log('[API] Starting getProperty request');

  try {
    console.log('[API] Making request to:', `${baseURL}/api/property/${id}`);

    const response = await api.get(`/api/property/${id}`, {
      timeout: 10 * 1000
    })

    console.log('[API] Response received:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    if (response.status === 400 || response.status === 500 || response.status === 404 || response.status === 401) {
      console.error('[API] Error status received:', response.status);
      throw response.data;
    }

    return response.data;
  } catch (error) {
    console.error('[API] Error in getProperties:', {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,        headers: error.config?.headers,
      }
    });

    toast.error(error.response?.data?.message || 'An error occurred whil fetching the property');
    throw error;
  }
}