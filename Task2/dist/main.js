import { DogCard } from './components/DogCard.js';
/**
 * Función para obtener la lista de todas las razas de perros
 */
async function obtenerTodasLasRazas() {
    try {
        const respuesta = await fetch('https://dog.ceo/api/breeds/list/all');
        const datos = await respuesta.json();
        if (datos.status === 'success' && typeof datos.message === 'object') {
            // Extraer solo los nombres de las razas principales (sin sub-razas)
            return Object.keys(datos.message);
        }
        return [];
    }
    catch (error) {
        console.error('Error al obtener las razas:', error);
        return [];
    }
}
/**
 * Función para obtener una imagen aleatoria de una raza específica
 */
async function obtenerImagenRaza(raza) {
    try {
        const respuesta = await fetch(`https://dog.ceo/api/breed/${raza}/images/random`);
        const datos = await respuesta.json();
        if (datos.status === 'success' && typeof datos.message === 'string') {
            return datos.message;
        }
        return '';
    }
    catch (error) {
        console.error(`Error al obtener imagen para ${raza}:`, error);
        return '';
    }
}
/**
 * Función para formatear el nombre de la raza (capitalizar primera letra)
 */
function formatearNombreRaza(raza) {
    return raza
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}
/**
 * Función principal para cargar y mostrar las razas de perros
 */
async function cargarRazasDePerros() {
    const gridContainer = document.getElementById('dogsGrid');
    if (!gridContainer) {
        console.error('No se encontró el contenedor del grid');
        return;
    }
    // Limpiar el placeholder
    gridContainer.innerHTML = '';
    // Mostrar mensaje de carga
    const mensajeCarga = document.createElement('p');
    mensajeCarga.className = 'loading-message';
    mensajeCarga.textContent = 'Cargando razas de perros...';
    gridContainer.appendChild(mensajeCarga);
    // Obtener todas las razas
    const razas = await obtenerTodasLasRazas();
    if (razas.length === 0) {
        gridContainer.innerHTML = '';
        const mensajeError = document.createElement('p');
        mensajeError.className = 'loading-message';
        mensajeError.textContent = 'No se pudieron cargar las razas';
        gridContainer.appendChild(mensajeError);
        return;
    }
    // Limpiar el mensaje de carga
    gridContainer.innerHTML = '';
    // Obtener imágenes para cada raza (limitamos a las primeras 20 para la versión básica)
    const razasLimitadas = razas.slice(0, 20);
    for (const raza of razasLimitadas) {
        const imagen = await obtenerImagenRaza(raza);
        const nombreFormateado = formatearNombreRaza(raza);
        if (imagen) {
            // Crear una instancia del componente DogCard
            const dogCard = new DogCard({
                name: nombreFormateado,
                image: imagen
            });
            // Obtener el elemento y agregarlo al grid
            gridContainer.appendChild(dogCard.getElement());
        }
    }
}
// Ejecutar cuando el DOM esté listo
console.log('Script cargado, verificando DOM...');
if (document.readyState === 'loading') {
    console.log('DOM aún cargando, esperando evento...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM listo, iniciando carga de perros...');
        cargarRazasDePerros();
    });
}
else {
    console.log('DOM ya listo, iniciando carga de perros...');
    cargarRazasDePerros();
}
