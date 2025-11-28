/**
 * Configuración de la API de Dog CEO
 */
export const DOG_API_BASE_URL = 'https://dog.ceo/api';
/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
    // Obtiene la lista de todas las razas de perros
    ALL_BREEDS: `${DOG_API_BASE_URL}/breeds/list/all`,
    // Obtiene una imagen aleatoria de una raza específica
    BREED_IMAGE: (breed) => `${DOG_API_BASE_URL}/breed/${breed}/images/random`
};
