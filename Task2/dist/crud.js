import { getAllSavedBreeds, createBreed, readBreed, updateBreed, deleteBreed, searchBreeds } from './services/localStorageService.js';
// Referencias a elementos del DOM
let formElement;
let breedIdInput;
let breedNameInput;
let subBreedsInput;
let submitBtn;
let cancelBtn;
let formTitle;
let breedsListContainer;
let searchInput;
let emptyState;
let isEditing = false;
let currentEditId = null;
/**
 * Inicializa la aplicación CRUD
 */
function init() {
    // Obtener referencias a elementos del DOM
    formElement = document.getElementById('breedForm');
    breedIdInput = document.getElementById('breedId');
    breedNameInput = document.getElementById('breedName');
    subBreedsInput = document.getElementById('subBreeds');
    submitBtn = document.getElementById('submitBtn');
    cancelBtn = document.getElementById('cancelBtn');
    formTitle = document.getElementById('formTitle');
    breedsListContainer = document.getElementById('breedsList');
    searchInput = document.getElementById('crudSearchInput');
    emptyState = document.getElementById('emptyState');
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
function handleFormSubmit(event) {
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
        }
        else {
            showMessage('Error al actualizar la raza', 'error');
        }
    }
    else {
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
function handleCancel() {
    resetForm();
}
/**
 * Resetea el formulario a su estado inicial
 */
function resetForm() {
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
function startEdit(breed) {
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
function handleDelete(id, breedName) {
    if (confirm(`¿Estás seguro de que deseas eliminar la raza "${breedName}"?`)) {
        const deleted = deleteBreed(id);
        if (deleted) {
            renderBreedsList();
            showMessage('Raza eliminada correctamente', 'success');
            // Si estaba editando esta raza, resetear el formulario
            if (isEditing && currentEditId === id) {
                resetForm();
            }
        }
        else {
            showMessage('Error al eliminar la raza', 'error');
        }
    }
}
/**
 * Renderiza la lista de razas guardadas
 */
function renderBreedsList(searchTerm) {
    const breeds = searchTerm ? searchBreeds(searchTerm) : getAllSavedBreeds();
    breedsListContainer.innerHTML = '';
    if (breeds.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    breeds.forEach(breed => {
        const breedCard = createBreedCard(breed);
        breedsListContainer.appendChild(breedCard);
    });
}
/**
 * Crea un elemento card para una raza
 */
function createBreedCard(breed) {
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
                        ${breed.subBreeds.map(sub => `<li>${formatBreedName(sub)}</li>`).join('')}
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
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
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
function handleSearch(event) {
    const target = event.target;
    const searchTerm = target.value;
    renderBreedsList(searchTerm);
}
/**
 * Formatea el nombre de una raza
 */
function formatBreedName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
/**
 * Muestra un mensaje temporal
 */
function showMessage(message, type) {
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
}
else {
    init();
}
