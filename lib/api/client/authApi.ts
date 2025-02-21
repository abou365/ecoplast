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

export type UserType = 'CLIENT' | 'PRE_COLLECTOR';
export type CollectorCategory = 'POUBELLE' | 'CENTRE_TRI' | 'DECHETTERIE' | 'TOUS';

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  type: UserType;
  category?: CollectorCategory;
  latitude?: number | null;
  longitude?: number | null;
}

export interface RegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  type: UserType;
  category?: CollectorCategory;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  activeLocation: null | {
    id: string;
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw handleApiError(error);
    }
  },

  register: async (userData: RegisterUserData): Promise<RegisterResponse> => {
    try {
      const fullUrl = `${apiClient.defaults.baseURL}${ENDPOINTS.AUTH.REGISTER}`;
      console.log('URL complète de la requête:', fullUrl);
      console.log('Données envoyées:', userData);
      
      const { data } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
      console.log('Réponse reçue:', data);
      return data;
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        config: error.config,
        response: error.response,
        request: error.request
      });
      throw handleApiError(error);
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