import { apiClient } from '../config/apiConfig';
import { ENDPOINTS } from '../config/endpoints';
import { handleApiError } from '../errors/apiErrors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    type: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

    // Fonction pour l'inscription d'un utilisateur
    register: async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
      type: string;
    }) => {
      try {
        const { data } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
        return data;
      } catch (error) {
        throw handleApiError(error);  // Utilisation de la fonction de gestion des erreurs
      }
    },  

  getProfile: async () => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.AUTH.PROFILE);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};