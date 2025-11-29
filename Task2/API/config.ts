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
    BREED_IMAGE: (breed: string) => `${DOG_API_BASE_URL}/breed/${breed}/images/random`
};

/**
 * Interfaz para las respuestas de la API de Dog CEO
 */
export interface DogApiResponse {
    message: string | { [key: string]: string[] };
    status: string;
}

/**
 * Función para obtener la lista de todas las razas de perros
 * @returns Promise con un array de nombres de razas
 */
export async function obtenerTodasLasRazas(): Promise<string[]> {
    try {
        const respuesta = await fetch(API_ENDPOINTS.ALL_BREEDS);
        const datos: DogApiResponse = await respuesta.json();
        
        if (datos.status === 'success' && typeof datos.message === 'object') {
            // Extraer solo los nombres de las razas principales (sin sub-razas)
            return Object.keys(datos.message);
        }
        return [];
    } catch (error) {
        console.error('Error al obtener las razas:', error);
        return [];
    }
}

/**
 * Función para obtener un número aleatorio de razas
 * @param cantidad - Número de razas aleatorias a obtener
 * @returns Promise con un array de nombres de razas aleatorias
 */
export async function obtenerRazasAleatorias(cantidad: number): Promise<string[]> {
    try {
        const todasLasRazas = await obtenerTodasLasRazas();
        
        if (todasLasRazas.length === 0) {
            return [];
        }

        // Mezclar el array aleatoriamente (Fisher-Yates shuffle)
        const razasMezcladas = [...todasLasRazas];
        for (let i = razasMezcladas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = razasMezcladas[i]!;
            const swap = razasMezcladas[j]!;
            razasMezcladas[i] = swap;
            razasMezcladas[j] = temp;
        }

        // Retornar solo la cantidad solicitada
        return razasMezcladas.slice(0, cantidad);
    } catch (error) {
        console.error('Error al obtener razas aleatorias:', error);
        return [];
    }
}

/**
 * Función para obtener una imagen aleatoria de una raza específica
 * @param raza - Nombre de la raza de perro
 * @returns Promise con la URL de la imagen
 */
export async function obtenerImagenRaza(raza: string): Promise<string> {
    try {
        const respuesta = await fetch(API_ENDPOINTS.BREED_IMAGE(raza));
        const datos: DogApiResponse = await respuesta.json();
        
        if (datos.status === 'success' && typeof datos.message === 'string') {
            return datos.message;
        }
        return '';
    } catch (error) {
        console.error(`Error al obtener imagen para ${raza}:`, error);
        return '';
    }
}

/**
 * Función para obtener las sub-razas de una raza específica
 * @param raza - Nombre de la raza de perro
 * @returns Promise con un array de sub-razas
 */
export async function obtenerSubRazas(raza: string): Promise<string[]> {
    try {
        const respuesta = await fetch(API_ENDPOINTS.ALL_BREEDS);
        const datos: DogApiResponse = await respuesta.json();
        
        if (datos.status === 'success' && typeof datos.message === 'object') {
            const razas = datos.message as { [key: string]: string[] };
            // Retornar las sub-razas de la raza especificada, o array vacío si no tiene
            return razas[raza] || [];
        }
        return [];
    } catch (error) {
        console.error(`Error al obtener sub-razas para ${raza}:`, error);
        return [];
    }
}

/**
 * ----------------------------------------------------------------------------
 * Tabla de razas con sub-razas
 * ----------------------------------------------------------------------------
 */
export interface BreedWithSubBreeds {
    breed: string;
    subBreeds: string[];
}

/**
 * Función para obtener todas las razas con sus sub-razas
 * @returns Promise con un array de razas y sus sub-razas
 */
export async function obtenerTodasLasRazasConSubRazas(): Promise<BreedWithSubBreeds[]> {
    try {
        const respuesta = await fetch(API_ENDPOINTS.ALL_BREEDS);
        const datos: DogApiResponse = await respuesta.json();
        
        if (datos.status === 'success' && typeof datos.message === 'object') {
            const razas = datos.message as { [key: string]: string[] };
            
            // Convertir el objeto en un array de BreedWithSubBreeds
            return Object.entries(razas).map(([breed, subBreeds]) => ({
                breed,
                subBreeds: subBreeds || []
            }));
        }
        return [];
    } catch (error) {
        console.error('Error al obtener todas las razas con sub-razas:', error);
        return [];
    }
}

