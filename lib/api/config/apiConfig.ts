import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './endpoints';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log détaillé de la configuration de la requête
      console.log('Configuration complète de la requête:', {
        method: config.method,
        baseURL: config.baseURL,
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
        timeout: config.timeout
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      config: {
        method: response.config.method,
        baseURL: response.config.baseURL,
        url: response.config.url,
        fullURL: `${response.config.baseURL}${response.config.url}`
      }
    });
    return response;
  },
  (error) => {
    console.error('Erreur de réponse détaillée:', {
      message: error.message,
      code: error.code,
      config: error.config ? {
        method: error.config.method,
        baseURL: error.config.baseURL,
        url: error.config.url,
        fullURL: error.config?.baseURL && error.config?.url ? 
          `${error.config.baseURL}${error.config.url}` : 'N/A',
        headers: error.config.headers,
        data: error.config.data,
        timeout: error.config.timeout
      } : 'No config available',
      response: error.response,
      request: error.request
    });

    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const message = error.response.data?.message || 'Une erreur est survenue';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      return Promise.reject(new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.'));
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return Promise.reject(new Error('Erreur de configuration de la requête'));
    }
  }
);