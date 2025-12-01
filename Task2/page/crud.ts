import {
    getAllSavedBreeds,
    createBreed,
    readBreed,
    updateBreed,
    deleteBreed,
    searchBreeds,
    clearAllBreeds,
    type SavedBreed
} from '../services/localStorageService.js';

// Referencias a elementos del DOM
let formElement: HTMLFormElement;
let breedIdInput: HTMLInputElement;
let breedNameInput: HTMLInputElement;
let subBreedsInput: HTMLInputElement;
let submitBtn: HTMLButtonElement;
let cancelBtn: HTMLButtonElement;
let formTitle: HTMLElement;
let breedsListContainer: HTMLElement;
let searchInput: HTMLInputElement;
let emptyState: HTMLElement;

let isEditing = false;
let currentEditId: string | null = null;

/**
 * Inicializa la aplicación CRUD
 */
function init(): void {
    // Obtener referencias a elementos del DOM
    formElement = document.getElementById('breedForm') as HTMLFormElement;
    breedIdInput = document.getElementById('breedId') as HTMLInputElement;
    breedNameInput = document.getElementById('breedName') as HTMLInputElement;
    subBreedsInput = document.getElementById('subBreeds') as HTMLInputElement;
    submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
    formTitle = document.getElementById('formTitle') as HTMLElement;
    breedsListContainer = document.getElementById('breedsList') as HTMLElement;
    searchInput = document.getElementById('crudSearchInput') as HTMLInputElement;
    emptyState = document.getElementById('emptyState') as HTMLElement;

    // Configurar event listeners
    formElement.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    searchInput.addEventListener('input', handleSearch);

    // Cargar y mostrar las razas guardadas
    renderBreedsList();
}

/**
 * Maneja el envío del formulario
 */
function handleFormSubmit(event: Event): void {
    event.preventDefault();

    const breedName = breedNameInput.value.trim();
    if (!breedName) {
        alert('Por favor, ingresa un nombre de raza');
        return;
    }

    const subBreedsText = subBreedsInput.value.trim();
    const subBreeds = subBreedsText
        ? subBreedsText.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [];

    if (isEditing && currentEditId) {
        // Actualizar raza existente
        const updated = updateBreed(currentEditId, {
            breed: breedName,
            subBreeds
        });

        if (updated) {
            resetForm();
            renderBreedsList();
            showMessage('Raza actualizada correctamente', 'success');
        } else {
            showMessage('Error al actualizar la raza', 'error');
        }
    } else {
        // Crear nueva raza
        createBreed(breedName, subBreeds);

        resetForm();
        renderBreedsList();
        showMessage('Raza guardada correctamente', 'success');
    }
}

/**
 * Maneja la cancelación de la edición
 */
function handleCancel(): void {
    resetForm();
}

/**
 * Resetea el formulario a su estado inicial
 */
function resetForm(): void {
    formElement.reset();
    breedIdInput.value = '';
    isEditing = false;
    currentEditId = null;
    formTitle.textContent = 'Agregar Nueva Raza';
    submitBtn.textContent = 'Guardar';
    cancelBtn.style.display = 'none';
}

/**
 * Inicia la edición de una raza
 */
function startEdit(breed: SavedBreed): void {
    isEditing = true;
    currentEditId = breed.id;

    breedIdInput.value = breed.id;
    breedNameInput.value = breed.breed;
    subBreedsInput.value = breed.subBreeds.join(', ');

    formTitle.textContent = 'Editar Raza';
    submitBtn.textContent = 'Actualizar';
    cancelBtn.style.display = 'inline-block';

    // Scroll al formulario
    document.getElementById('crudFormSection')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Elimina una raza
 */
function handleDelete(id: string, breedName: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la raza "${breedName}"?`)) {
        const deleted = deleteBreed(id);
        if (deleted) {
            renderBreedsList();
            showMessage('Raza eliminada correctamente', 'success');
            
            // Si estaba editando esta raza, resetear el formulario
            if (isEditing && currentEditId === id) {
                resetForm();
            }
        } else {
            showMessage('Error al eliminar la raza', 'error');
        }
    }
}

/**
 * Renderiza la lista de razas guardadas
 */
function renderBreedsList(searchTerm?: string): void {
    const breeds = searchTerm ? searchBreeds(searchTerm) : getAllSavedBreeds();
    
    breedsListContainer.innerHTML = '';

    if (breeds.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    breeds.forEach((breed: SavedBreed) => {
        const breedCard = createBreedCard(breed);
        breedsListContainer.appendChild(breedCard);
    });
}

/**
 * Crea un elemento card para una raza
 */
function createBreedCard(breed: SavedBreed): HTMLElement {
    const card = document.createElement('div');
    card.className = 'breed-card';

    const formattedBreed = formatBreedName(breed.breed);
    
    card.innerHTML = `
        <div class="breed-card-header">
            <h3 class="breed-card-title">
                ${formattedBreed}
            </h3>
            <div class="breed-card-actions">
                <button class="btn btn-small btn-edit" data-id="${breed.id}" aria-label="Editar ${formattedBreed}">
                    Editar
                </button>
                <button class="btn btn-small btn-delete" data-id="${breed.id}" aria-label="Eliminar ${formattedBreed}">
                    Eliminar
                </button>
            </div>
        </div>
        <div class="breed-card-body">
            ${breed.subBreeds.length > 0 ? `
                <div class="breed-card-section">
                    <strong>Sub-razas:</strong>
                    <ul class="breed-subbreeds-list">
                        ${breed.subBreeds.map((sub: string) => `<li>${formatBreedName(sub)}</li>`).join('')}
                    </ul>
                </div>
            ` : `
                <div class="breed-card-section">
                    <span class="breed-no-subbreeds">—</span>
                </div>
            `}
        </div>
    `;

    // Agregar event listeners a los botones
    const editBtn = card.querySelector('.btn-edit') as HTMLButtonElement;
    const deleteBtn = card.querySelector('.btn-delete') as HTMLButtonElement;

    editBtn.addEventListener('click', () => {
        const breedToEdit = readBreed(breed.id);
        if (breedToEdit) {
            startEdit(breedToEdit);
        }
    });

    deleteBtn.addEventListener('click', () => {
        handleDelete(breed.id, breed.breed);
    });

    return card;
}

/**
 * Maneja la búsqueda
 */
function handleSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    renderBreedsList(searchTerm);
}


/**
 * Formatea el nombre de una raza
 */
function formatBreedName(name: string): string {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


/**
 * Muestra un mensaje temporal
 */
function showMessage(message: string, type: 'success' | 'error'): void {
    // Crear elemento de mensaje
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageEl);

    // Remover después de 3 segundos
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

