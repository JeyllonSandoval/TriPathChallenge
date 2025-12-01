import { DogCard } from './components/DogCard.js';
import { obtenerRazasAleatorias, obtenerImagenRaza } from './API/config.js';

/**
 * Función para formatear el nombre de la raza (capitalizar primera letra)
 */
function formatearNombreRaza(raza: string): string {
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

    // Obtener solo 20 razas aleatorias (no todas, para no sobrecargar la pagina)
    const cantidadRazas = 20;
    const razasAleatorias = await obtenerRazasAleatorias(cantidadRazas);
    
    if (razasAleatorias.length === 0) {
        gridContainer.innerHTML = '';
        const mensajeError = document.createElement('p');
        mensajeError.className = 'loading-message';
        mensajeError.textContent = 'No se pudieron cargar las razas';
        gridContainer.appendChild(mensajeError);
        return;
    }

    // Limpiar el mensaje de carga
    gridContainer.innerHTML = '';

    // Cargar y mostrar las imágenes progresivamente
    // Usamos Promise.allSettled para cargar todas en paralelo pero mostrar cada una cuando esté lista
    const promesasRazas = razasAleatorias.map(async (raza) => {
        try {
            const imagen = await obtenerImagenRaza(raza);
            const nombreFormateado = formatearNombreRaza(raza);
            
            if (imagen) {
                // Crear una instancia del componente DogCard
                const dogCard = new DogCard({
                    name: nombreFormateado,
                    image: imagen,
                    breedKey: raza // Nombre original para consultar sub-razas
                });
                
                // Agregar al grid inmediatamente cuando esté lista
                gridContainer.appendChild(dogCard.getElement());
            }
        } catch (error) {
            console.error(`Error al cargar la raza ${raza}:`, error);
        }
    });

    // Esperar a que todas las promesas se resuelvan
    await Promise.allSettled(promesasRazas);
}

// Ejecutar cuando el DOM esté listo
console.log('Script cargado, verificando DOM...');

if (document.readyState === 'loading') {
    console.log('DOM aun cargando, esperando evento...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM listo, iniciando carga de perros...');
        cargarRazasDePerros();
    });
} else {
    console.log('DOM ya listo, iniciando carga de perros...');
    cargarRazasDePerros();
}

