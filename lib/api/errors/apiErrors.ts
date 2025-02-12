export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Erreur avec réponse du serveur
    return new ApiError(
      error.response.status,
      error.response.data.message || 'Une erreur est survenue',
      error.response.data
    );
  } else if (error.request) {
    // Erreur sans réponse du serveur
    return new ApiError(
      500,
      'Impossible de contacter le serveur'
    );
  } else {
    // Erreur de configuration de la requête
    return new ApiError(
      500,
      'Erreur de configuration de la requête'
    );
  }
};