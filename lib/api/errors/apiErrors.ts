export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): never => {
  console.error('Détails de l\'erreur:', {
    name: error.name,
    message: error.message,
    config: error.config,
    response: error.response,
    request: error.request
  });

  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    const message = error.response.data?.message || 'Une erreur est survenue';
    throw new ApiError(message);
  } else if (error.request) {
    // La requête a été faite mais pas de réponse
    throw new ApiError('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    throw new ApiError('Erreur de configuration de la requête');
  }
};