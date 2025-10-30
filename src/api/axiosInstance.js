import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
  || process.env.API_BASE_URL
  || 'https://be.phongnguyen.software/';

const createAxiosInstance = (contentType = 'application/json') => {
  const axiosInstance = axios.create({
    baseURL: DEFAULT_BASE_URL,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        Accept: 'application/json',
      };

      if (contentType) {
        headers['Content-Type'] = contentType;
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      config.headers = {
        ...config.headers,
        ...headers,
      };

      return config;
    },
    error => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error),
  );

  return axiosInstance;
};

export default createAxiosInstance;
