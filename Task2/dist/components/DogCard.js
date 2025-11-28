/**
 * Componente de tarjeta para mostrar una raza de perro
 */
export class DogCard {
    /**
     * Constructor del componente DogCard
     * @param data - Datos de la raza de perro (nombre e imagen)
     */
    constructor(data) {
        this.data = data;
        this.element = this.crearElemento();
    }
    /**
     * Crea el elemento HTML de la tarjeta
     * @returns Elemento HTMLElement de la tarjeta
     */
    crearElemento() {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'dog-card';
        // Contenedor de la imagen
        const contenedorImagen = document.createElement('div');
        contenedorImagen.className = 'dog-image-container';
        // Imagen del perro
        const imagen = document.createElement('img');
        imagen.src = this.data.image;
        imagen.alt = this.data.name;
        imagen.className = 'dog-image';
        // Agregar evento para manejar errores de carga de imagen
        imagen.addEventListener('error', () => {
            console.error(`Error al cargar la imagen para ${this.data.name}`);
            imagen.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23e0e0e0" width="250" height="250"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
        });
        // Nombre de la raza
        const nombre = document.createElement('h3');
        nombre.className = 'dog-name';
        nombre.textContent = this.data.name;
        // Construir la estructura
        contenedorImagen.appendChild(imagen);
        tarjeta.appendChild(contenedorImagen);
        tarjeta.appendChild(nombre);
        return tarjeta;
    }
    /**
     * Obtiene el elemento HTML de la tarjeta
     * @returns Elemento HTMLElement
     */
    getElement() {
        return this.element;
    }
    /**
     * Actualiza los datos de la tarjeta
     * @param data - Nuevos datos de la raza de perro
     */
    actualizarDatos(data) {
        this.data = data;
        // Actualizar la imagen
        const imagen = this.element.querySelector('.dog-image');
        if (imagen) {
            imagen.src = data.image;
            imagen.alt = data.name;
        }
        // Actualizar el nombre
        const nombre = this.element.querySelector('.dog-name');
        if (nombre) {
            nombre.textContent = data.name;
        }
    }
    /**
     * Obtiene los datos actuales de la tarjeta
     * @returns Datos de la raza de perro
     */
    obtenerDatos() {
        return { ...this.data };
    }
}
