"use strict";
// Emojis para las cartas (fáciles de ver)
const CARD_EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎺', '🎻', '🥁'];
// Estado global del juego
let gameState = {
    cards: [],
    flippedCards: [],
    isLocked: false,
    moves: 0
};
// Número de pares a generar (8 pares = 16 cartas para grid 4x4)
const PAIRS_COUNT = 8;
/**
 * Genera pares de cartas con emojis aleatorios
 */
function generateCardPairs(count) {
    // Selecciona emojis aleatorios para los pares
    const selectedEmojis = CARD_EMOJIS.slice(0, count);
    // Crea pares de cartas
    const pairs = [];
    let cardId = 0;
    selectedEmojis.forEach(emoji => {
        // Crea dos cartas con el mismo emoji
        pairs.push({ id: cardId++, value: emoji, isFlipped: false, isMatched: false }, { id: cardId++, value: emoji, isFlipped: false, isMatched: false });
    });
    return pairs;
}
/**
 * Baraja las cartas usando el algoritmo Fisher-Yates
 */
function shuffleCards(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
/**
 * Inicializa el juego con nuevas cartas barajadas
 */
function initGame() {
    // Asegura que el juego esté desbloqueado
    gameState.isLocked = false;
    // Limpia cualquier cartas volteadas
    gameState.flippedCards = [];
    // Reinicia el contador de movimientos
    gameState.moves = 0;
    // Limpia mensajes
    clearMessage();
    // Genera pares de cartas
    const cardPairs = generateCardPairs(PAIRS_COUNT);
    // Baraja las cartas
    gameState.cards = shuffleCards(cardPairs);
    // Renderiza las cartas en el DOM
    renderCards();
    // Habilita todas las cartas
    setTimeout(() => {
        enableAvailableCards();
    }, 100);
}
/**
 * Crea un elemento DOM para una carta
 */
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card card-back';
    cardElement.dataset.cardId = card.id.toString();
    // Contenido de la carta (emoji)
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    cardContent.textContent = card.value;
    cardElement.appendChild(cardContent);
    // Event listener para el clic
    cardElement.addEventListener('click', () => handleCardClick(card));
    return cardElement;
}
/**
 * Renderiza todas las cartas en el grid
 */
function renderCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    if (!cardsGrid) {
        console.error('No se encontró el contenedor de cartas');
        return;
    }
    // Limpia el grid
    cardsGrid.innerHTML = '';
    // Crea y agrega cada carta
    gameState.cards.forEach(card => {
        const cardElement = createCardElement(card);
        // Actualiza el estado visual de la carta
        updateCardVisualState(cardElement, card);
        cardsGrid.appendChild(cardElement);
    });
}
/**
 * Actualiza el estado visual de una carta en el DOM
 */
function updateCardVisualState(cardElement, card) {
    const cardContent = cardElement.querySelector('.card-content');
    // Remueve todas las clases de estado
    cardElement.classList.remove('card-back', 'card-front', 'card-matched');
    if (card.isMatched) {
        // Carta emparejada - muestra el contenido y aplica estilo especial
        cardElement.classList.add('card', 'card-matched', 'card-front');
        if (cardContent) {
            cardContent.style.opacity = '1';
        }
        cardElement.style.pointerEvents = 'none';
    }
    else if (card.isFlipped) {
        // Carta boca arriba - muestra el contenido
        cardElement.classList.add('card', 'card-front');
        if (cardContent) {
            cardContent.style.opacity = '1';
        }
    }
    else {
        // Carta boca abajo - oculta el contenido
        cardElement.classList.add('card', 'card-back');
        if (cardContent) {
            cardContent.style.opacity = '0';
        }
    }
    // Maneja la interactividad según el estado del juego
    if (card.isMatched) {
        // Las cartas emparejadas nunca son interactivas
        cardElement.style.pointerEvents = 'none';
    }
    else if (gameState.isLocked) {
        // Durante la comparación, todas las cartas están bloqueadas
        cardElement.style.pointerEvents = 'none';
    }
    else {
        // Solo las cartas no emparejadas y no bloqueadas son interactivas
        cardElement.style.pointerEvents = 'auto';
    }
}
/**
 * Maneja el clic en una carta
 */
function handleCardClick(card) {
    // Validación: no hacer nada si el juego está bloqueado
    if (gameState.isLocked) {
        return;
    }
    // Validación: no hacer nada si la carta ya está volteada
    if (card.isFlipped) {
        return;
    }
    // Validación: no hacer nada si la carta ya está emparejada
    if (card.isMatched) {
        return;
    }
    // Validación: no hacer nada si ya hay 2 cartas volteadas
    if (gameState.flippedCards.length >= 2) {
        return;
    }
    // Validación: no permitir clic en la misma carta dos veces
    if (gameState.flippedCards.some(flippedCard => flippedCard.id === card.id)) {
        return;
    }
    // Voltea la carta
    card.isFlipped = true;
    gameState.flippedCards.push(card);
    // Actualiza el DOM inmediatamente
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
    if (cardElement) {
        updateCardVisualState(cardElement, card);
    }
    // Si hay 2 cartas volteadas, verifica si coinciden después de un breve delay
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        // Pequeño delay para permitir que la segunda carta se vea antes de comparar
        setTimeout(() => {
            checkCardMatch();
        }, 300);
    }
}
/**
 * Verifica si las dos cartas volteadas coinciden
 */
function checkCardMatch() {
    const [card1, card2] = gameState.flippedCards;
    if (!card1 || !card2) {
        return;
    }
    // Bloquea todas las interacciones mientras se verifica
    gameState.isLocked = true;
    disableAllCards();
    // Espera para que el usuario vea las cartas antes de comparar
    setTimeout(() => {
        if (card1.value === card2.value) {
            // ¡Las cartas coinciden!
            handleMatch(card1, card2);
        }
        else {
            // Las cartas no coinciden, voltearlas de nuevo
            handleMismatch(card1, card2);
        }
        // Limpia las cartas volteadas
        gameState.flippedCards = [];
        // Desbloquea el juego después de un breve momento
        setTimeout(() => {
            gameState.isLocked = false;
            enableAvailableCards();
        }, 300);
    }, 1000); // Espera 1 segundo para ver las cartas
}
/**
 * Maneja cuando las cartas coinciden
 */
function handleMatch(card1, card2) {
    // Marca las cartas como emparejadas
    card1.isMatched = true;
    card2.isMatched = true;
    // Actualiza el DOM con animación
    const cardElement1 = document.querySelector(`[data-card-id="${card1.id}"]`);
    const cardElement2 = document.querySelector(`[data-card-id="${card2.id}"]`);
    if (cardElement1) {
        updateCardVisualState(cardElement1, card1);
        cardElement1.classList.add('card-match-success');
    }
    if (cardElement2) {
        updateCardVisualState(cardElement2, card2);
        cardElement2.classList.add('card-match-success');
    }
    // Remueve la clase de éxito después de la animación
    setTimeout(() => {
        if (cardElement1)
            cardElement1.classList.remove('card-match-success');
        if (cardElement2)
            cardElement2.classList.remove('card-match-success');
    }, 500);
    // Verifica si el juego terminó
    checkGameWin();
}
/**
 * Maneja cuando las cartas no coinciden
 */
function handleMismatch(card1, card2) {
    // Vuelve a voltear las cartas
    card1.isFlipped = false;
    card2.isFlipped = false;
    // Actualiza el DOM
    const cardElement1 = document.querySelector(`[data-card-id="${card1.id}"]`);
    const cardElement2 = document.querySelector(`[data-card-id="${card2.id}"]`);
    if (cardElement1) {
        updateCardVisualState(cardElement1, card1);
        // Agrega animación de "shake" visual
        cardElement1.classList.add('card-mismatch');
        setTimeout(() => cardElement1.classList.remove('card-mismatch'), 500);
    }
    if (cardElement2) {
        updateCardVisualState(cardElement2, card2);
        // Agrega animación de "shake" visual
        cardElement2.classList.add('card-mismatch');
        setTimeout(() => cardElement2.classList.remove('card-mismatch'), 500);
    }
}
/**
 * Deshabilita todas las cartas temporalmente
 */
function disableAllCards() {
    document.querySelectorAll('.card').forEach(cardEl => {
        cardEl.style.pointerEvents = 'none';
    });
}
/**
 * Habilita solo las cartas disponibles (no emparejadas)
 */
function enableAvailableCards() {
    document.querySelectorAll('.card').forEach(cardEl => {
        if (!cardEl.classList.contains('card-matched')) {
            cardEl.style.pointerEvents = 'auto';
        }
    });
}
/**
 * Verifica si el juego terminó (todas las cartas emparejadas)
 */
function checkGameWin() {
    const allMatched = gameState.cards.every(card => card.isMatched);
    if (allMatched) {
        showMessage(`¡Ganaste! Completaste el juego en ${gameState.moves} movimientos. 🎉`);
    }
}
/**
 * Muestra un mensaje en el área de mensajes
 */
function showMessage(message) {
    const messageArea = document.getElementById('messageArea');
    if (messageArea) {
        messageArea.textContent = message;
        messageArea.classList.add('show');
    }
}
/**
 * Limpia el mensaje
 */
function clearMessage() {
    const messageArea = document.getElementById('messageArea');
    if (messageArea) {
        messageArea.textContent = '';
        messageArea.classList.remove('show');
    }
}
// Inicialización del juego
function init() {
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            initGame();
        });
    }
    // Inicia el juego automáticamente
    initGame();
}
// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
