/**
 * Servicio para gestionar operaciones CRUD con localStorage
 * Estructura similar a la API: solo breed y subBreeds
 */
const STORAGE_KEY = 'dog_breeds_crud';
/**
 * Obtiene todas las razas guardadas desde localStorage
 * @returns Array de razas guardadas
 */
export function getAllSavedBreeds() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error al leer desde localStorage:', error);
        return [];
    }
}
/**
 * Guarda una nueva raza en localStorage
 * @param breed - Nombre de la raza
 * @param subBreeds - Array de sub-razas
 * @returns La raza guardada con su ID
 */
export function createBreed(breed, subBreeds = []) {
    const savedBreeds = getAllSavedBreeds();
    const newBreed = {
        id: generateId(),
        breed,
        subBreeds
    };
    savedBreeds.push(newBreed);
    saveAllBreeds(savedBreeds);
    return newBreed;
}
/**
 * Lee una raza específica por su ID
 * @param id - ID de la raza
 * @returns La raza encontrada o null
 */
export function readBreed(id) {
    const savedBreeds = getAllSavedBreeds();
    return savedBreeds.find(b => b.id === id) || null;
}
/**
 * Actualiza una raza existente
 * @param id - ID de la raza a actualizar
 * @param updates - Objeto con los campos a actualizar
 * @returns La raza actualizada o null si no se encontró
 */
export function updateBreed(id, updates) {
    const savedBreeds = getAllSavedBreeds();
    const index = savedBreeds.findIndex(b => b.id === id);
    if (index === -1) {
        return null;
    }
    const updatedBreed = {
        ...savedBreeds[index],
        ...updates
    };
    savedBreeds[index] = updatedBreed;
    saveAllBreeds(savedBreeds);
    return updatedBreed;
}
/**
 * Elimina una raza por su ID
 * @param id - ID de la raza a eliminar
 * @returns true si se eliminó correctamente, false si no se encontró
 */
export function deleteBreed(id) {
    const savedBreeds = getAllSavedBreeds();
    const filteredBreeds = savedBreeds.filter(b => b.id !== id);
    if (filteredBreeds.length === savedBreeds.length) {
        return false; // No se encontró la raza
    }
    saveAllBreeds(filteredBreeds);
    return true;
}
/**
 * Guarda todas las razas en localStorage
 * @param breeds - Array de razas a guardar
 */
function saveAllBreeds(breeds) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(breeds));
    }
    catch (error) {
        console.error('Error al guardar en localStorage:', error);
        throw new Error('No se pudo guardar en localStorage. Puede que el almacenamiento esté lleno.');
    }
}
/**
 * Genera un ID único para cada raza
 * @returns ID único
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Limpia todos los datos guardados
 */
export function clearAllBreeds() {
    localStorage.removeItem(STORAGE_KEY);
}
/**
 * Busca razas guardadas por término de búsqueda
 * @param searchTerm - Término de búsqueda
 * @returns Array de razas que coinciden con el término
 */
export function searchBreeds(searchTerm) {
    const savedBreeds = getAllSavedBreeds();
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
        return savedBreeds;
    }
    return savedBreeds.filter(breed => {
        const breedMatch = breed.breed.toLowerCase().includes(term);
        const subBreedMatch = breed.subBreeds.some(sub => sub.toLowerCase().includes(term));
        return breedMatch || subBreedMatch;
    });
}
