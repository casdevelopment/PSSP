// apis/axiosInstance.js
import axios from 'axios';
import { Alert } from 'react-native';
import Server from '../constants/server';
import { useAuthStore } from '../store/AuthStore';
 
const axiosInstance = axios.create({
  baseURL: Server,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
});
 
// 🔹 Flag to prevent multiple alerts
let isSessionExpired = false;
 
// 🔹 Request Interceptor → Attach Access Token
axiosInstance.interceptors.request.use(
  async config => {
    const token = useAuthStore.getState().accessToken;
 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
 
// 🔹 Response Interceptor → Handle 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !isSessionExpired) {
      isSessionExpired = true; // block duplicate alerts
 
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [
          {
            text: 'OK',
            onPress: () => {
              useAuthStore.getState().logout();
              isSessionExpired = false; // reset after user sees alert
            },
          },
        ],
      );
    }
    return Promise.reject(error);
  },
);
 
export default axiosInstance;