import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://ecoapp-phi.vercel.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const message = error.response.data?.message || 'Une erreur est survenue';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      return Promise.reject(new Error('Impossible de contacter le serveur'));
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return Promise.reject(error);
    }
  }
);