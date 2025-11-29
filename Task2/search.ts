import { DogTable } from './components/DogTable.js';
import { obtenerTodasLasRazasConSubRazas, type BreedWithSubBreeds } from './API/config.js';

// Variables globales para almacenar los datos
let todasLasRazas: BreedWithSubBreeds[] = [];
let dogTable: DogTable | null = null;

// Estado de ordenamiento
type SortOrderBreed = 'asc' | 'desc' | null;
type SortOrderSubBreeds = 'has-subbreeds-first' | 'no-subbreeds-first' | null;

let currentBreedSort: SortOrderBreed = null;
let currentSubBreedsSort: SortOrderSubBreeds = null;

/**
 * Formatea el nombre de una raza o sub-raza para búsqueda
 * @param name - Nombre a formatear
 * @returns Nombre formateado en minúsculas sin espacios
 */
function normalizarNombre(name: string): string {
    return name
        .toLowerCase()
        .replace(/-/g, ' ')
        .trim();
}

/**
 * Filtra las razas y sub-razas según el término de búsqueda
 * @param termino - Término de búsqueda
 * @returns Array filtrado de razas con sub-razas
 */
function filtrarRazas(termino: string): BreedWithSubBreeds[] {
    if (!termino.trim()) {
        return todasLasRazas;
    }

    const terminoNormalizado = normalizarNombre(termino);

    return todasLasRazas.filter((item) => {
        // Buscar en el nombre de la raza
        const nombreRazaNormalizado = normalizarNombre(item.breed);
        if (nombreRazaNormalizado.includes(terminoNormalizado)) {
            return true;
        }

        // Buscar en las sub-razas
        const tieneSubRazaCoincidente = item.subBreeds.some((subBreed) => {
            const nombreSubRazaNormalizado = normalizarNombre(subBreed);
            return nombreSubRazaNormalizado.includes(terminoNormalizado);
        });

        return tieneSubRazaCoincidente;
    });
}

/**
 * Ordena las razas según el criterio seleccionado
 * @param razas - Array de razas a ordenar
 * @returns Array ordenado de razas
 */
function ordenarRazas(razas: BreedWithSubBreeds[]): BreedWithSubBreeds[] {
    let razasOrdenadas = [...razas];

    // Primero aplicar ordenamiento por sub-razas si está activo
    if (currentSubBreedsSort === 'has-subbreeds-first') {
        razasOrdenadas.sort((a, b) => {
            const aHasSubBreeds = a.subBreeds.length > 0;
            const bHasSubBreeds = b.subBreeds.length > 0;
            if (aHasSubBreeds && !bHasSubBreeds) return -1;
            if (!aHasSubBreeds && bHasSubBreeds) return 1;
            return 0;
        });
    } else if (currentSubBreedsSort === 'no-subbreeds-first') {
        razasOrdenadas.sort((a, b) => {
            const aHasSubBreeds = a.subBreeds.length > 0;
            const bHasSubBreeds = b.subBreeds.length > 0;
            if (!aHasSubBreeds && bHasSubBreeds) return -1;
            if (aHasSubBreeds && !bHasSubBreeds) return 1;
            return 0;
        });
    }

    // Luego aplicar ordenamiento por nombre de raza si está activo
    if (currentBreedSort === 'asc') {
        razasOrdenadas.sort((a, b) => {
            const nombreA = normalizarNombre(a.breed);
            const nombreB = normalizarNombre(b.breed);
            return nombreA.localeCompare(nombreB);
        });
    } else if (currentBreedSort === 'desc') {
        razasOrdenadas.sort((a, b) => {
            const nombreA = normalizarNombre(a.breed);
            const nombreB = normalizarNombre(b.breed);
            return nombreB.localeCompare(nombreA);
        });
    }

    return razasOrdenadas;
}

/**
 * Actualiza la tabla con los datos filtrados y ordenados
 * @param terminoBusqueda - Término de búsqueda
 */
function actualizarTabla(terminoBusqueda: string): void {
    const tableSection = document.getElementById('tableSection');
    
    if (!tableSection || !dogTable) {
        return;
    }

    const razasFiltradas = filtrarRazas(terminoBusqueda);
    const razasOrdenadas = ordenarRazas(razasFiltradas);

    if (razasOrdenadas.length === 0) {
        // Mostrar mensaje de no resultados
        tableSection.innerHTML = '';
        const mensajeNoResultados = document.createElement('p');
        mensajeNoResultados.className = 'loading-message';
        mensajeNoResultados.textContent = 'No se encontraron resultados';
        tableSection.appendChild(mensajeNoResultados);
    } else {
        // Actualizar la tabla con los datos filtrados y ordenados
        dogTable.actualizarDatos(razasOrdenadas);
        dogTable.actualizarOrdenamiento(currentBreedSort, currentSubBreedsSort);
        
        // Asegurarse de que la tabla esté en el DOM
        if (!tableSection.contains(dogTable.getElement())) {
            tableSection.innerHTML = '';
            tableSection.appendChild(dogTable.getElement());
        }
    }
}

/**
 * Maneja el clic en el header de ordenamiento por raza
 */
function manejarOrdenamientoRaza(): void {
    // Ciclar entre: null -> asc -> desc -> null
    if (currentBreedSort === null) {
        currentBreedSort = 'asc';
    } else if (currentBreedSort === 'asc') {
        currentBreedSort = 'desc';
    } else {
        currentBreedSort = null;
    }

    // Resetear ordenamiento de sub-razas cuando se ordena por raza
    currentSubBreedsSort = null;

    // Obtener el término de búsqueda actual y actualizar la tabla
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const terminoBusqueda = searchInput ? searchInput.value : '';
    actualizarTabla(terminoBusqueda);
}

/**
 * Maneja el clic en el header de ordenamiento por sub-razas
 */
function manejarOrdenamientoSubRazas(): void {
    // Ciclar entre: null -> has-subbreeds-first -> no-subbreeds-first -> null
    if (currentSubBreedsSort === null) {
        currentSubBreedsSort = 'has-subbreeds-first';
    } else if (currentSubBreedsSort === 'has-subbreeds-first') {
        currentSubBreedsSort = 'no-subbreeds-first';
    } else {
        currentSubBreedsSort = null;
    }

    // Resetear ordenamiento de raza cuando se ordena por sub-razas
    currentBreedSort = null;

    // Obtener el término de búsqueda actual y actualizar la tabla
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const terminoBusqueda = searchInput ? searchInput.value : '';
    actualizarTabla(terminoBusqueda);
}

/**
 * Configura el evento de búsqueda
 */
function configurarBusqueda(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    
    if (!searchInput) {
        console.error('No se encontró el input de búsqueda');
        return;
    }

    // Búsqueda en tiempo real mientras el usuario escribe
    searchInput.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        actualizarTabla(target.value);
    });

    // También permitir búsqueda con Enter (aunque ya funciona en tiempo real)
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            actualizarTabla(searchInput.value);
        }
    });
}

/**
 * Función principal para cargar y mostrar la tabla de razas y sub-razas
 */
async function cargarTablaDeRazas() {
    const tableSection = document.getElementById('tableSection');
    
    if (!tableSection) {
        console.error('No se encontró el contenedor de la tabla');
        return;
    }

    // Limpiar el contenedor
    tableSection.innerHTML = '';

    // Mostrar mensaje de carga
    const mensajeCarga = document.createElement('p');
    mensajeCarga.className = 'loading-message';
    mensajeCarga.textContent = 'Cargando razas de perros...';
    tableSection.appendChild(mensajeCarga);

    try {
        // Obtener todas las razas con sus sub-razas
        todasLasRazas = await obtenerTodasLasRazasConSubRazas();
        
        if (todasLasRazas.length === 0) {
            tableSection.innerHTML = '';
            const mensajeError = document.createElement('p');
            mensajeError.className = 'loading-message';
            mensajeError.textContent = 'No se pudieron cargar las razas';
            tableSection.appendChild(mensajeError);
            return;
        }

        // Limpiar el mensaje de carga
        tableSection.innerHTML = '';

        // Crear una instancia del componente DogTable
        dogTable = new DogTable(todasLasRazas, manejarOrdenamientoRaza, manejarOrdenamientoSubRazas);
        
        // Agregar la tabla al contenedor
        tableSection.appendChild(dogTable.getElement());

        // Configurar el evento de búsqueda
        configurarBusqueda();
    } catch (error) {
        console.error('Error al cargar la tabla de razas:', error);
        tableSection.innerHTML = '';
        const mensajeError = document.createElement('p');
        mensajeError.className = 'loading-message';
        mensajeError.textContent = 'Error al cargar las razas';
        tableSection.appendChild(mensajeError);
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM listo, iniciando carga de tabla...');
        cargarTablaDeRazas();
    });
} else {
    console.log('DOM ya listo, iniciando carga de tabla...');
    cargarTablaDeRazas();
}

