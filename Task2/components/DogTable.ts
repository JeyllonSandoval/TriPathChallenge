import type { BreedWithSubBreeds } from '../API/config.js';

type SortOrderBreed = 'asc' | 'desc' | null;
type SortOrderSubBreeds = 'has-subbreeds-first' | 'no-subbreeds-first' | null;

/**
 * Componente de tabla para mostrar todas las razas y sub-razas
 */
export class DogTable {
    private element: HTMLElement;
    private data: BreedWithSubBreeds[];
    private onBreedSortClick: () => void;
    private onSubBreedsSortClick: () => void;
    private breedSortOrder: SortOrderBreed = null;
    private subBreedsSortOrder: SortOrderSubBreeds = null;

    /**
     * Constructor del componente DogTable
     * @param data - Array de razas con sus sub-razas
     * @param onBreedSortClick - Callback para cuando se hace clic en el header de raza
     * @param onSubBreedsSortClick - Callback para cuando se hace clic en el header de sub-razas
     */
    constructor(
        data: BreedWithSubBreeds[],
        onBreedSortClick: () => void,
        onSubBreedsSortClick: () => void
    ) {
        this.data = data;
        this.onBreedSortClick = onBreedSortClick;
        this.onSubBreedsSortClick = onSubBreedsSortClick;
        this.element = this.crearElemento();
    }

    /**
     * Formatea el nombre de una raza o sub-raza
     * @param name - Nombre a formatear
     * @returns Nombre formateado
     */
    private formatearNombre(name: string): string {
        return name
            .split('-')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
    }


    private crearIconoOrdenamiento(order: 'asc' | 'desc' | null): HTMLElement {
        const icono = document.createElement('span');
        icono.className = 'sort-icon';
        
        if (order === 'asc') {
            icono.innerHTML = '↑';
            icono.setAttribute('aria-label', 'Ordenado ascendente');
        } else if (order === 'desc') {
            icono.innerHTML = '↓';
            icono.setAttribute('aria-label', 'Ordenado descendente');
        } else {
            icono.innerHTML = '⇅';
            icono.setAttribute('aria-label', 'Ordenar');
            icono.classList.add('sort-icon-inactive');
        }
        
        return icono;
    }

    private crearIconoOrdenamientoSubRazas(order: SortOrderSubBreeds): HTMLElement {
        const icono = document.createElement('span');
        icono.className = 'sort-icon';
        
        if (order === 'has-subbreeds-first') {
            icono.innerHTML = '↑';
            icono.setAttribute('aria-label', 'Con sub-razas primero');
        } else if (order === 'no-subbreeds-first') {
            icono.innerHTML = '↓';
            icono.setAttribute('aria-label', 'Sin sub-razas primero');
        } else {
            icono.innerHTML = '⇅';
            icono.setAttribute('aria-label', 'Ordenar por sub-razas');
            icono.classList.add('sort-icon-inactive');
        }
        
        return icono;
    }

    private crearElemento(): HTMLElement {
        const contenedor = document.createElement('div');
        contenedor.className = 'dog-table-container';

        const tabla = document.createElement('table');
        tabla.className = 'dog-table';
        tabla.setAttribute('role', 'table');
        tabla.setAttribute('aria-label', 'Tabla de razas de perros y sub-razas');

        // Crear encabezado de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headerBreed = document.createElement('th');
        headerBreed.className = 'dog-table-header dog-table-header-sortable';
        headerBreed.setAttribute('scope', 'col');
        headerBreed.setAttribute('role', 'button');
        headerBreed.setAttribute('tabindex', '0');
        headerBreed.setAttribute('aria-label', 'Ordenar por raza');
        
        const breedContainer = document.createElement('div');
        breedContainer.style.display = 'flex';
        breedContainer.style.alignItems = 'center';
        breedContainer.style.gap = 'var(--spacing-sm)';
        breedContainer.style.width = '100%';
        breedContainer.style.justifyContent = 'space-between';
        
        const breedText = document.createElement('span');
        breedText.textContent = 'Raza';
        const breedIcon = this.crearIconoOrdenamiento(this.breedSortOrder);
        
        breedContainer.appendChild(breedText);
        breedContainer.appendChild(breedIcon);
        headerBreed.appendChild(breedContainer);
        
        // Agregar evento de clic
        headerBreed.addEventListener('click', () => {
            this.onBreedSortClick();
        });
        
        headerBreed.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.onBreedSortClick();
            }
        });
        
        const headerSubBreeds = document.createElement('th');
        headerSubBreeds.className = 'dog-table-header dog-table-header-sortable';
        headerSubBreeds.setAttribute('scope', 'col');
        headerSubBreeds.setAttribute('role', 'button');
        headerSubBreeds.setAttribute('tabindex', '0');
        headerSubBreeds.setAttribute('aria-label', 'Ordenar por sub-razas');
        
        const subBreedsContainer = document.createElement('div');
        subBreedsContainer.style.display = 'flex';
        subBreedsContainer.style.alignItems = 'center';
        subBreedsContainer.style.gap = 'var(--spacing-sm)';
        subBreedsContainer.style.width = '100%';
        subBreedsContainer.style.justifyContent = 'space-between';
        
        const subBreedsText = document.createElement('span');
        subBreedsText.textContent = 'Sub-razas';
        const subBreedsIcon = this.crearIconoOrdenamientoSubRazas(this.subBreedsSortOrder);
        
        subBreedsContainer.appendChild(subBreedsText);
        subBreedsContainer.appendChild(subBreedsIcon);
        headerSubBreeds.appendChild(subBreedsContainer);
        
        // Agregar evento de clic
        headerSubBreeds.addEventListener('click', () => {
            this.onSubBreedsSortClick();
        });
        
        headerSubBreeds.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.onSubBreedsSortClick();
            }
        });

        headerRow.appendChild(headerBreed);
        headerRow.appendChild(headerSubBreeds);
        thead.appendChild(headerRow);
        tabla.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        tbody.className = 'dog-table-body';

        // Agregar filas para cada raza
        this.data.forEach((item) => {
            const row = document.createElement('tr');
            row.className = 'dog-table-row';

            // Celda de raza
            const breedCell = document.createElement('td');
            breedCell.className = 'dog-table-cell dog-table-breed';
            breedCell.textContent = this.formatearNombre(item.breed);

            // Celda de sub-razas
            const subBreedsCell = document.createElement('td');
            subBreedsCell.className = 'dog-table-cell dog-table-subbreeds';
            
            if (item.subBreeds.length > 0) {
                const subBreedsList = document.createElement('ul');
                subBreedsList.className = 'dog-table-subbreeds-list';
                
                item.subBreeds.forEach((subBreed) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'dog-table-subbreed-item';
                    listItem.textContent = this.formatearNombre(subBreed);
                    subBreedsList.appendChild(listItem);
                });
                
                subBreedsCell.appendChild(subBreedsList);
            } else {
                subBreedsCell.textContent = '—';
                subBreedsCell.classList.add('dog-table-empty');
            }

            row.appendChild(breedCell);
            row.appendChild(subBreedsCell);
            tbody.appendChild(row);
        });

        tabla.appendChild(tbody);
        contenedor.appendChild(tabla);

        return contenedor;
    }

    /**
     * Obtiene el elemento HTML de la tabla
     * @returns Elemento HTMLElement
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Actualiza los datos de la tabla
     * @param data - Nuevos datos de razas con sub-razas
     */
    public actualizarDatos(data: BreedWithSubBreeds[]): void {
        this.data = data;
        
        // Recrear el elemento con los nuevos datos
        const nuevoElemento = this.crearElemento();
        const contenedorPadre = this.element.parentElement;
        
        if (contenedorPadre) {
            contenedorPadre.replaceChild(nuevoElemento, this.element);
            this.element = nuevoElemento;
        } else {
            this.element = nuevoElemento;
        }
    }

    /**
     * Actualiza los iconos de ordenamiento sin recrear toda la tabla
     * @param breedSort - Ordenamiento actual de razas
     * @param subBreedsSort - Ordenamiento actual de sub-razas
     */
    public actualizarOrdenamiento(breedSort: SortOrderBreed, subBreedsSort: SortOrderSubBreeds): void {
        this.breedSortOrder = breedSort;
        this.subBreedsSortOrder = subBreedsSort;
        
        // Actualizar los iconos en los headers
        const headers = this.element.querySelectorAll('.dog-table-header-sortable');
        
        if (headers.length >= 2) {
            // Actualizar icono de raza
            const headerBreed = headers[0] as HTMLElement;
            const breedContainer = headerBreed.querySelector('div');
            const breedIcon = breedContainer?.querySelector('.sort-icon');
            if (breedIcon && breedContainer) {
                const nuevoIcono = this.crearIconoOrdenamiento(breedSort);
                breedContainer.replaceChild(nuevoIcono, breedIcon);
            }
            
            // Actualizar icono de sub-razas
            const headerSubBreeds = headers[1] as HTMLElement;
            const subBreedsContainer = headerSubBreeds.querySelector('div');
            const subBreedsIcon = subBreedsContainer?.querySelector('.sort-icon');
            if (subBreedsIcon && subBreedsContainer) {
                const nuevoIcono = this.crearIconoOrdenamientoSubRazas(subBreedsSort);
                subBreedsContainer.replaceChild(nuevoIcono, subBreedsIcon);
            }
        }
    }

    /**
     * Obtiene los datos actuales de la tabla
     * @returns Array de razas con sub-razas
     */
    public obtenerDatos(): BreedWithSubBreeds[] {
        return [...this.data];
    }
}
