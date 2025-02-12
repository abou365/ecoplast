import { apiClient } from '../config/apiConfig';
import { ENDPOINTS } from '../config/endpoints';
import { handleApiError } from '../errors/apiErrors';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  type: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLocationDto {
  latitude: number;
  longitude: number;
}


export const userApi = {
  getById: async (id: string): Promise<User> => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.USERS.GET_BY_ID(id));
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateLocation: async (id: string, location: UpdateLocationDto) => {
    try {
      const { data } = await apiClient.patch(`/users/${id}/location`, location);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  findNearbyCollectors: async (latitude: number, longitude: number, radius?: number) => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.USERS.NEARBY_COLLECTORS, {
        params: { latitude, longitude, radius }
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Ajout de la méthode pour obtenir les précollecteurs
  getAllPrecollecteurs: async () => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.USERS.NEARBY_COLLECTORS); // Utilisation de l'endpoint correct
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  
};
