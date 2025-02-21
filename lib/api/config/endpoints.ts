// Configuration des endpoints de l'API
import { Platform } from 'react-native';

// Détection automatique de l'environnement
export const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://192.168.10.102:8000',  // Votre adresse IP WiFi réelle
  default: 'http://localhost:8000'
});


export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/users',
    PROFILE: '/api/v1/auth/profile',
  },
  USERS: {
    GET_ALL: '/api/v1/users',
    GET_BY_ID: (id: string) => `/api/v1/users/${id}`,
    UPDATE: (id: string) => `/api/v1/users/${id}`,
    UPDATE_LOCATION: (id: string) => `/api/v1/users/${id}/location`,
    NEARBY_COLLECTORS: '/api/v1/users/precollectors',
  },
  COLLECTION_REQUESTS: {
    CREATE: '/api/v1/collection-requests',
    GET_ALL: '/api/v1/collection-requests',
    GET_BY_ID: (id: string) => `/api/v1/collection-requests/${id}`,
    GET_BY_PRE_COLLECTOR: (id: string) => `/api/v1/collection-requests/pre-collector/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/collection-requests/${id}/status`,
    NEARBY: '/api/v1/collection-requests/nearby',
  }
};