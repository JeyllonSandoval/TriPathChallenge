import type { BreedWithSubBreeds } from '../API/config.js';

/**
 * Componente de tabla para mostrar todas las razas y sub-razas
 */
export class DogTable {
    private element: HTMLElement;
    private data: BreedWithSubBreeds[];

    /**
     * Constructor del componente DogTable
     * @param data - Array de razas con sus sub-razas
     */
    constructor(data: BreedWithSubBreeds[]) {
        this.data = data;
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

    /**
     * Crea el elemento HTML de la tabla
     * @returns Elemento HTMLElement de la tabla
     */
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
        headerBreed.className = 'dog-table-header';
        headerBreed.textContent = 'Raza';
        headerBreed.setAttribute('scope', 'col');
        
        const headerSubBreeds = document.createElement('th');
        headerSubBreeds.className = 'dog-table-header';
        headerSubBreeds.textContent = 'Sub-razas';
        headerSubBreeds.setAttribute('scope', 'col');

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
     * Obtiene los datos actuales de la tabla
     * @returns Array de razas con sub-razas
     */
    public obtenerDatos(): BreedWithSubBreeds[] {
        return [...this.data];
    }
}
