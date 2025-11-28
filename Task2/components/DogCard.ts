import { obtenerSubRazas } from '../API/config.js';

/**
 * Interfaz para los datos de una raza de perro
 */
export interface DogBreed {
    name: string;
    image: string;
    breedKey?: string; // Nombre original de la raza para consultar sub-razas
}

/**
 * Componente de tarjeta para mostrar una raza de perro
 */
export class DogCard {
    private element: HTMLElement;
    private data: DogBreed;

    /**
     * Constructor del componente DogCard
     * @param data - Datos de la raza de perro (nombre e imagen)
     */
    constructor(data: DogBreed) {
        this.data = data;
        this.element = this.crearElemento();
    }

    /**
     * Crea el elemento HTML de la tarjeta
     * @returns Elemento HTMLElement de la tarjeta
     */
    private crearElemento(): HTMLElement {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'dog-card';
        tarjeta.setAttribute('role', 'listitem');
        tarjeta.setAttribute('tabindex', '0');

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
            // Placeholder SVG minimalista
            const svgPlaceholder = `
                <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
                    <rect width="320" height="320" fill=var(--color-beige)"/>
                    <circle cx="160" cy="140" r="25" fill="none" stroke=var(--color-teal) stroke-width="1.5" opacity="0.4"/>
                    <path d="M 120 200 Q 160 180 200 200" stroke=var(--color-teal) stroke-width="1.5" fill="none" opacity="0.4"/>
                </svg>
            `;
            imagen.src = 'data:image/svg+xml,' + encodeURIComponent(svgPlaceholder);
        });

        // Overlay para mostrar sub-razas en hover
        const overlay = document.createElement('div');
        overlay.className = 'dog-overlay';
        overlay.setAttribute('role', 'tooltip');
        overlay.setAttribute('aria-label', 'Sub-razas del perro');
        overlay.innerHTML = '<div class="dog-overlay-content"><p class="dog-overlay-loading">Cargando sub-razas...</p></div>';

        // Nombre de la raza
        const nombre = document.createElement('h3');
        nombre.className = 'dog-name';
        nombre.textContent = this.data.name;
        nombre.setAttribute('aria-label', `Raza de perro: ${this.data.name}`);

        // Construir la estructura
        contenedorImagen.appendChild(imagen);
        contenedorImagen.appendChild(overlay);
        tarjeta.appendChild(contenedorImagen);
        tarjeta.appendChild(nombre);

        // Agregar eventos de hover para mostrar sub-razas
        this.configurarHover(contenedorImagen, overlay);

        return tarjeta;
    }

    /**
     * Configura los eventos de hover para mostrar las sub-razas
     * @param contenedorImagen - Contenedor de la imagen
     * @param overlay - Elemento overlay para mostrar sub-razas
     */
    private configurarHover(contenedorImagen: HTMLElement, overlay: HTMLElement): void {
        let subRazasCargadas = false;
        let cargandoSubRazas = false;

        contenedorImagen.addEventListener('mouseenter', async () => {
            overlay.classList.add('active');
            
            // Solo cargar sub-razas una vez
            if (!subRazasCargadas && !cargandoSubRazas && this.data.breedKey) {
                cargandoSubRazas = true;
                try {
                    const subRazas = await obtenerSubRazas(this.data.breedKey);
                    subRazasCargadas = true;
                    cargandoSubRazas = false;

                    if (subRazas.length > 0) {
                        // Formatear nombres de sub-razas
                        const subRazasFormateadas = subRazas.map(subRaza => {
                            return subRaza
                                .split('-')
                                .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                                .join(' ');
                        });

                        overlay.innerHTML = `
                            <div class="dog-overlay-content">
                                <h4 class="dog-overlay-title">Sub-razas</h4>
                                <ul class="dog-overlay-list">
                                    ${subRazasFormateadas.map(subRaza => `<li>${subRaza}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } else {
                        overlay.innerHTML = `
                            <div class="dog-overlay-content">
                                <p class="dog-overlay-empty">Sin sub-razas</p>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error(`Error al cargar sub-razas para ${this.data.name}:`, error);
                    overlay.innerHTML = `
                        <div class="dog-overlay-content">
                            <p class="dog-overlay-error">Error al cargar sub-razas</p>
                        </div>
                    `;
                    cargandoSubRazas = false;
                }
            }
        });

        contenedorImagen.addEventListener('mouseleave', () => {
            overlay.classList.remove('active');
        });
    }

    /**
     * Obtiene el elemento HTML de la tarjeta
     * @returns Elemento HTMLElement
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Actualiza los datos de la tarjeta
     * @param data - Nuevos datos de la raza de perro
     */
    public actualizarDatos(data: DogBreed): void {
        this.data = data;
        
        // Actualizar la imagen
        const imagen = this.element.querySelector('.dog-image') as HTMLImageElement;
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
    public obtenerDatos(): DogBreed {
        return { ...this.data };
    }
}

