import { DogTable } from './components/DogTable.js';
import { obtenerTodasLasRazasConSubRazas } from './API/config.js';

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
        const razasConSubRazas = await obtenerTodasLasRazasConSubRazas();
        
        if (razasConSubRazas.length === 0) {
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
        const dogTable = new DogTable(razasConSubRazas);
        
        // Agregar la tabla al contenedor
        tableSection.appendChild(dogTable.getElement());
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

