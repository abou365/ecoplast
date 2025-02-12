// Configuration des endpoints de l'API
export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/v1/auth/login',
    REGISTER: 'api/v1/users',
    PROFILE: 'api/v1/auth/profile',
  },
  USERS: {
    GET_ALL: 'api/v1/users',
    GET_BY_ID: (id: string) => `api/v1/users/${id}`,
    UPDATE: (id: string) => `api/v1/users/${id}`,
    UPDATE_LOCATION: (id: string) => `api/v1/users/${id}/location`,
    NEARBY_COLLECTORS: 'api/v1/users/precollectors',

  },
  COLLECTION_REQUESTS: {
    CREATE: 'api/v1/collection-requests',
    GET_ALL: 'api/v1/collection-requests',
    GET_BY_ID: (id: string) => `api/v1/collection-requests/${id}`,
    GET_BY_PRE_COLLECTOR: (id: string) => `api/v1/collection-requests/pre-collector/${id}`,
    UPDATE_STATUS: (id: string) => `api/v1/collection-requests/${id}/status`,
    NEARBY: 'api/v1/collection-requests/nearby',
  }
};