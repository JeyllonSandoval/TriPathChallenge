// Tipos e interfaces para las cartas
interface Card {
    id: number;
    value: string; // Emoji o símbolo de la carta
    isFlipped: boolean; // Si está boca arriba
    isMatched: boolean; // Si está emparejada
}

// Estado del juego
interface GameState {
    cards: Card[];
    flippedCards: Card[]; // Máximo 2 cartas volteadas
    isLocked: boolean; // Bloquear interacción mientras se comparan cartas
    moves: number; // Contador de movimientos
}

// Emojis para las cartas (fáciles de ver)
const CARD_EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎺', '🎻', '🥁'];

// Estado global del juego
let gameState: GameState = {
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
function generateCardPairs(count: number): Card[] {
    // Selecciona emojis aleatorios para los pares
    const selectedEmojis = CARD_EMOJIS.slice(0, count);
    
    // Crea pares de cartas
    const pairs: Card[] = [];
    let cardId = 0;
    
    selectedEmojis.forEach(emoji => {
        // Crea dos cartas con el mismo emoji
        pairs.push(
            { id: cardId++, value: emoji, isFlipped: false, isMatched: false },
            { id: cardId++, value: emoji, isFlipped: false, isMatched: false }
        );
    });
    
    return pairs;
}

/**
 * Baraja las cartas usando el algoritmo Fisher-Yates
 */
function shuffleCards<T>(array: T[]): T[] {
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
function initGame(): void {
    // Genera pares de cartas
    const cardPairs = generateCardPairs(PAIRS_COUNT);
    
    // Baraja las cartas
    gameState.cards = shuffleCards(cardPairs);
    
    // Reinicia el estado del juego
    gameState.flippedCards = [];
    gameState.isLocked = false;
    gameState.moves = 0;
    
    // Limpia mensajes
    clearMessage();
    
    // Renderiza las cartas en el DOM
    renderCards();
}

/**
 * Crea un elemento DOM para una carta
 */
function createCardElement(card: Card): HTMLElement {
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
function renderCards(): void {
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
function updateCardVisualState(cardElement: HTMLElement, card: Card): void {
    const cardContent = cardElement.querySelector('.card-content') as HTMLElement;
    
    // Remueve todas las clases de estado
    cardElement.classList.remove('card-back', 'card-front', 'card-matched');
    
    if (card.isMatched) {
        // Carta emparejada
        cardElement.classList.add('card', 'card-matched', 'card-front');
        if (cardContent) cardContent.style.opacity = '1';
    } else if (card.isFlipped) {
        // Carta boca arriba
        cardElement.classList.add('card', 'card-front');
        if (cardContent) cardContent.style.opacity = '1';
    } else {
        // Carta boca abajo
        cardElement.classList.add('card', 'card-back');
        if (cardContent) cardContent.style.opacity = '0';
    }
    
    // Deshabilita clics si está emparejada o el juego está bloqueado
    if (card.isMatched || gameState.isLocked) {
        cardElement.style.pointerEvents = 'none';
    } else {
        cardElement.style.pointerEvents = 'auto';
    }
}

/**
 * Maneja el clic en una carta
 */
function handleCardClick(card: Card): void {
    // No hacer nada si la carta ya está volteada, emparejada, o el juego está bloqueado
    if (card.isFlipped || card.isMatched || gameState.isLocked) {
        return;
    }
    
    // No hacer nada si ya hay 2 cartas volteadas
    if (gameState.flippedCards.length >= 2) {
        return;
    }
    
    // Voltea la carta
    card.isFlipped = true;
    gameState.flippedCards.push(card);
    
    // Actualiza el DOM
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement;
    if (cardElement) {
        updateCardVisualState(cardElement, card);
    }
    
    // Si hay 2 cartas volteadas, verifica si coinciden
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        checkCardMatch();
    }
}

/**
 * Verifica si las dos cartas volteadas coinciden
 */
function checkCardMatch(): void {
    const [card1, card2] = gameState.flippedCards;
    
    // Bloquea interacciones mientras se verifica
    gameState.isLocked = true;
    
    // Espera un momento para que el usuario vea las cartas
    setTimeout(() => {
        if (card1.value === card2.value) {
            // ¡Coinciden!
            card1.isMatched = true;
            card2.isMatched = true;
            
            // Actualiza el DOM
            const cardElement1 = document.querySelector(`[data-card-id="${card1.id}"]`) as HTMLElement;
            const cardElement2 = document.querySelector(`[data-card-id="${card2.id}"]`) as HTMLElement;
            
            if (cardElement1) updateCardVisualState(cardElement1, card1);
            if (cardElement2) updateCardVisualState(cardElement2, card2);
            
            // Verifica si el juego terminó
            checkGameWin();
        } else {
            // No coinciden, voltea las cartas de nuevo
            card1.isFlipped = false;
            card2.isFlipped = false;
            
            // Actualiza el DOM
            const cardElement1 = document.querySelector(`[data-card-id="${card1.id}"]`) as HTMLElement;
            const cardElement2 = document.querySelector(`[data-card-id="${card2.id}"]`) as HTMLElement;
            
            if (cardElement1) updateCardVisualState(cardElement1, card1);
            if (cardElement2) updateCardVisualState(cardElement2, card2);
        }
        
        // Limpia las cartas volteadas y desbloquea
        gameState.flippedCards = [];
        gameState.isLocked = false;
        
        // Habilita interacciones de nuevo
        document.querySelectorAll('.card').forEach(cardEl => {
            if (!cardEl.classList.contains('card-matched')) {
                (cardEl as HTMLElement).style.pointerEvents = 'auto';
            }
        });
    }, 1000); // Espera 1 segundo
}

/**
 * Verifica si el juego terminó (todas las cartas emparejadas)
 */
function checkGameWin(): void {
    const allMatched = gameState.cards.every(card => card.isMatched);
    
    if (allMatched) {
        showMessage(`¡Ganaste! Completaste el juego en ${gameState.moves} movimientos. 🎉`);
    }
}

/**
 * Muestra un mensaje en el área de mensajes
 */
function showMessage(message: string): void {
    const messageArea = document.getElementById('messageArea');
    if (messageArea) {
        messageArea.textContent = message;
        messageArea.classList.add('show');
    }
}

/**
 * Limpia el mensaje
 */
function clearMessage(): void {
    const messageArea = document.getElementById('messageArea');
    if (messageArea) {
        messageArea.textContent = '';
        messageArea.classList.remove('show');
    }
}

// Inicialización del juego
function init(): void {
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
} else {
    init();
}
