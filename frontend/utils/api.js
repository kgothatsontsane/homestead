import axios from 'axios'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

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

export const getAllProperties = async () => {
  try {
    const response = await api.get('/api/property/allproperties')
    return response.data
  } catch (error) {
    toast.error('An error occurred while fetching properties')
    throw error
  }
}