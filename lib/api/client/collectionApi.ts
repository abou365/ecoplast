import { apiClient } from '../config/apiConfig';
import { handleApiError } from '../errors/apiErrors';
import { User } from './userApi';

export enum CollectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface CollectionRequest {
  id: string;
  clientId: string;
  preCollectorId?: string;
  wasteType: string;
  weight: number;
  price: number;
  pickupLatitude: number;
  pickupLongitude: number;
  status: CollectionStatus;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  client?: User;
  preCollector?: User;
}

export interface CreateCollectionRequestDto {
  wasteType: string;
  weight: number;
  price: number;
  pickupLatitude: number;
  pickupLongitude: number;
  preCollectorId?: string;
}

export interface UpdateCollectionStatusDto {
  status: CollectionStatus;
}

export const collectionApi = {
  create: async (request: CreateCollectionRequestDto): Promise<CollectionRequest> => {
    try {
      const { data } = await apiClient.post('/collection-requests', request);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<CollectionRequest> => {
    try {
      const { data } = await apiClient.get(`/collection-requests/${id}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyRequests: async (): Promise<CollectionRequest[]> => {
    try {
      const { data } = await apiClient.get('/collection-requests');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPreCollectorRequests: async (preCollectorId: string): Promise<CollectionRequest[]> => {
    try {
      const { data } = await apiClient.get(`/collection-requests/pre-collector/${preCollectorId}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  findNearbyRequests: async (latitude: number, longitude: number, radius?: number): Promise<CollectionRequest[]> => {
    try {
      const { data } = await apiClient.get('/collection-requests/nearby', {
        params: { latitude, longitude, radius }
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateStatus: async (id: string, updateStatusDto: UpdateCollectionStatusDto): Promise<CollectionRequest> => {
    try {
      const { data } = await apiClient.patch(`/collection-requests/${id}/status`, updateStatusDto);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};