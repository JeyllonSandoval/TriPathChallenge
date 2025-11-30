// Tipos e interfaces para las cartas
interface Card {
    id: number;
    value: string; // Emoji o símbolo de la carta
    isFlipped: boolean; // Si está boca arriba
    isMatched: boolean; // Si está emparejada
}

// Niveles de dificultad
type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
    pairs: number;
    name: string;
    gridCols: number;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
    easy: { pairs: 4, name: 'Fácil', gridCols: 3 },      // 3x3 con última fila 2 cartas (8 cartas totales)
    medium: { pairs: 8, name: 'Medio', gridCols: 4 },    // 4x4 (16 cartas)
    hard: { pairs: 12, name: 'Difícil', gridCols: 6 }    // 6x4 (24 cartas)
};

// Estado del juego
interface GameState {
    cards: Card[];
    flippedCards: Card[]; // Máximo 2 cartas volteadas
    isLocked: boolean; // Bloquear interacción mientras se comparan cartas
    moves: number; // Contador de movimientos
    time: number; // Tiempo en segundos
    score: number; // Puntuación
    difficulty: Difficulty; // Dificultad actual
    timerInterval: number | null; // ID del intervalo del timer
    isGameActive: boolean; // Si el juego está activo
}

// Emojis para las cartas (fáciles de ver)
const CARD_EMOJIS = ['🎮', '🎯', '🍉', '🏎️', '🎪', '🎬', '🎤', '🎧', '🎸', '🎺', '🎻', '🥁', '🎲', '🎰', '🎳', '🏁'];

// Estado global del juego
let gameState: GameState = {
    cards: [],
    flippedCards: [],
    isLocked: false,
    moves: 0,
    time: 0,
    score: 0,
    difficulty: 'medium',
    timerInterval: null,
    isGameActive: false
};

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
 * Obtiene la configuración de dificultad actual
 */
function getCurrentDifficulty(): DifficultyConfig {
    return DIFFICULTY_CONFIGS[gameState.difficulty];
}

/**
 * Inicializa el juego con nuevas cartas barajadas
 */
function initGame(): void {
    // Detiene el timer si está corriendo
    stopTimer();
    
    // Asegura que el juego esté desbloqueado
    gameState.isLocked = false;
    
    // Limpia cualquier cartas volteadas
    gameState.flippedCards = [];
    
    // Reinicia contadores
    gameState.moves = 0;
    gameState.time = 0;
    gameState.score = 0;
    gameState.isGameActive = false;
    
    // Actualiza estadísticas en el DOM
    updateStatsDisplay();
    
    // Limpia mensajes
    clearMessage();
    
    // Obtiene la configuración de dificultad
    const config = getCurrentDifficulty();
    
    // Genera pares de cartas según la dificultad
    const cardPairs = generateCardPairs(config.pairs);
    console.log(`Generados ${cardPairs.length} cartas para dificultad ${config.name}`);
    
    // Baraja las cartas
    gameState.cards = shuffleCards(cardPairs);
    console.log(`Cartas barajadas:`, gameState.cards.length);
    
    // Actualiza el grid según la dificultad
    updateGridLayout(config.gridCols);
    
    // Renderiza las cartas en el DOM
    renderCards();
    
    // Habilita todas las cartas
    setTimeout(() => {
        enableAvailableCards();
        // El juego está listo, pero el timer iniciará cuando se voltea la primera carta
        gameState.isGameActive = false;
    }, 100);
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
    
    // Event listener para el clic - usa el dataset para encontrar la carta
    cardElement.addEventListener('click', () => {
        const cardId = parseInt(cardElement.dataset.cardId || '0', 10);
        const clickedCard = gameState.cards.find(c => c.id === cardId);
        if (clickedCard) {
            handleCardClick(clickedCard);
        }
    });
    
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
    
    // Verifica que haya cartas para renderizar
    if (!gameState.cards || gameState.cards.length === 0) {
        console.error('No hay cartas para renderizar');
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
    
    console.log(`Renderizadas ${gameState.cards.length} cartas`);
}

/**
 * Actualiza el estado visual de una carta en el DOM
 */
function updateCardVisualState(cardElement: HTMLElement, card: Card): void {
    const cardContent = cardElement.querySelector('.card-content') as HTMLElement;
    
    // Remueve todas las clases de estado
    cardElement.classList.remove('card-back', 'card-front', 'card-matched');
    
    if (card.isMatched) {
        // Carta emparejada - muestra el contenido y aplica estilo especial
        cardElement.classList.add('card', 'card-matched', 'card-front');
        if (cardContent) {
            cardContent.style.opacity = '1';
        }
        cardElement.style.pointerEvents = 'none';
    } else if (card.isFlipped) {
        // Carta boca arriba - muestra el contenido
        cardElement.classList.add('card', 'card-front');
        if (cardContent) {
            cardContent.style.opacity = '1';
        }
    } else {
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
    } else if (gameState.isLocked) {
        // Durante la comparación, todas las cartas están bloqueadas
        cardElement.style.pointerEvents = 'none';
    } else {
        // Solo las cartas no emparejadas y no bloqueadas son interactivas
        cardElement.style.pointerEvents = 'auto';
    }
}

/**
 * Maneja el clic en una carta
 */
function handleCardClick(card: Card): void {
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
    
    // Si es la primera carta volteada, inicia el timer y el juego
    if (gameState.flippedCards.length === 0 && !gameState.isGameActive) {
        gameState.isGameActive = true;
        startTimer();
    }
    
    // Voltea la carta
    card.isFlipped = true;
    gameState.flippedCards.push(card);
    
    // Actualiza el DOM inmediatamente
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement;
    if (cardElement) {
        updateCardVisualState(cardElement, card);
    }
    
    // Si hay 2 cartas volteadas, verifica si coinciden después de un breve delay
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateMovesDisplay();
        updateScore();
        // Pequeño delay para permitir que la segunda carta se vea antes de comparar
        setTimeout(() => {
            checkCardMatch();
        }, 300);
    }
}

/**
 * Verifica si las dos cartas volteadas coinciden
 */
function checkCardMatch(): void {
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
        } else {
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
function handleMatch(card1: Card, card2: Card): void {
    // Marca las cartas como emparejadas
    card1.isMatched = true;
    card2.isMatched = true;
    
    // Actualiza el DOM con animación
    const cardElement1 = document.querySelector(`[data-card-id="${card1.id}"]`) as HTMLElement;
    const cardElement2 = document.querySelector(`[data-card-id="${card2.id}"]`) as HTMLElement;
    
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
        if (cardElement1) cardElement1.classList.remove('card-match-success');
        if (cardElement2) cardElement2.classList.remove('card-match-success');
    }, 500);
    
    // Verifica si el juego terminó
    checkGameWin();
}

/**
 * Maneja cuando las cartas no coinciden
 */
function handleMismatch(card1: Card, card2: Card): void {
    // Vuelve a voltear las cartas
    card1.isFlipped = false;
    card2.isFlipped = false;
    
    // Actualiza el DOM
    const cardElement1 = document.querySelector(`[data-card-id="${card1.id}"]`) as HTMLElement;
    const cardElement2 = document.querySelector(`[data-card-id="${card2.id}"]`) as HTMLElement;
    
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
function disableAllCards(): void {
    document.querySelectorAll('.card').forEach(cardEl => {
        (cardEl as HTMLElement).style.pointerEvents = 'none';
    });
}

/**
 * Habilita solo las cartas disponibles (no emparejadas)
 */
function enableAvailableCards(): void {
    document.querySelectorAll('.card').forEach(cardEl => {
        if (!cardEl.classList.contains('card-matched')) {
            (cardEl as HTMLElement).style.pointerEvents = 'auto';
        }
    });
}

/**
 * Verifica si el juego terminó (todas las cartas emparejadas)
 */
function checkGameWin(): void {
    const allMatched = gameState.cards.every(card => card.isMatched);
    
    if (allMatched) {
        // Detiene el timer
        stopTimer();
        gameState.isGameActive = false;
        
        // Calcula la puntuación final
        calculateFinalScore();
        
        // Muestra mensaje de victoria
        const config = getCurrentDifficulty();
        const minutes = Math.floor(gameState.time / 60);
        const seconds = gameState.time % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        showMessage(
            `¡FELICIDADES!\n` +
            `Completaste el nivel ${config.name}\n` +
            `${timeStr} | ${gameState.moves} movimientos | ${gameState.score.toLocaleString()} puntos`
        );
    }
}

/**
 * Inicia el timer del juego
 */
function startTimer(): void {
    // Limpia cualquier timer existente
    if (gameState.timerInterval !== null) {
        clearInterval(gameState.timerInterval);
    }
    
    // Reinicia el tiempo
    gameState.time = 0;
    updateTimerDisplay();
    
    // Inicia el intervalo cada segundo
    gameState.timerInterval = window.setInterval(() => {
        if (gameState.isGameActive) {
            gameState.time++;
            updateTimerDisplay();
            updateScore(); // Actualiza la puntuación mientras juega
        }
    }, 1000);
}

/**
 * Detiene el timer del juego
 */
function stopTimer(): void {
    if (gameState.timerInterval !== null) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

/**
 * Actualiza el display del timer
 */
function updateTimerDisplay(): void {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        const minutes = Math.floor(gameState.time / 60);
        const seconds = gameState.time % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

/**
 * Actualiza el display de movimientos
 */
function updateMovesDisplay(): void {
    const movesDisplay = document.getElementById('movesDisplay');
    if (movesDisplay) {
        movesDisplay.textContent = gameState.moves.toString();
    }
}

/**
 * Actualiza el display de puntuación
 */
function updateScoreDisplay(): void {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = gameState.score.toLocaleString();
    }
}

/**
 * Actualiza todas las estadísticas en el display
 */
function updateStatsDisplay(): void {
    updateTimerDisplay();
    updateMovesDisplay();
    updateScoreDisplay();
}

/**
 * Calcula la puntuación mientras se juega
 */
function updateScore(): void {
    if (!gameState.isGameActive || gameState.moves === 0) {
        gameState.score = 0;
        return;
    }
    
    const config = getCurrentDifficulty();
    const baseScore = config.pairs * 100; // Puntuación base según dificultad
    const timePenalty = gameState.time * 2; // Penalización por tiempo
    const movesPenalty = gameState.moves * 5; // Penalización por movimientos
    
    // Puntuación = base - penalizaciones (mínimo 0)
    gameState.score = Math.max(0, baseScore - timePenalty - movesPenalty);
    updateScoreDisplay();
}

/**
 * Calcula la puntuación final cuando ganas
 */
function calculateFinalScore(): void {
    const config = getCurrentDifficulty();
    const baseScore = config.pairs * 100;
    const timePenalty = gameState.time * 2;
    const movesPenalty = gameState.moves * 5;
    
    // Bonus por completar rápido
    const timeBonus = Math.max(0, 300 - gameState.time) * 3;
    
    // Bonus por pocos movimientos
    const efficiencyBonus = Math.max(0, (config.pairs * 2 - gameState.moves) * 10);
    
    gameState.score = Math.max(0, baseScore - timePenalty - movesPenalty + timeBonus + efficiencyBonus);
    updateScoreDisplay();
}

/**
 * Actualiza el layout del grid según la dificultad
 */
function updateGridLayout(cols: number): void {
    const cardsGrid = document.getElementById('cardsGrid');
    if (cardsGrid) {
        cardsGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Ajusta el max-width según el número de columnas
        if (cols === 3) {
            cardsGrid.style.maxWidth = '450px';
            cardsGrid.classList.add('grid-3-cols');
        } else if (cols <= 4) {
            cardsGrid.style.maxWidth = '600px';
            cardsGrid.classList.remove('grid-3-cols');
        } else if (cols === 6) {
            // En móviles, ajustar a 4 columnas si la pantalla es pequeña
            if (window.innerWidth <= 480) {
                cardsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                cardsGrid.style.maxWidth = '100%';
            } else {
                cardsGrid.style.maxWidth = '900px';
            }
            cardsGrid.classList.remove('grid-3-cols');
        } else {
            cardsGrid.style.maxWidth = '900px';
            cardsGrid.classList.remove('grid-3-cols');
        }
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
    const difficultySelect = document.getElementById('difficultySelect') as HTMLSelectElement;
    
    // Configura el botón de nuevo juego
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            initGame();
        });
    }
    
    // Configura el selector de dificultad
    if (difficultySelect) {
        difficultySelect.value = gameState.difficulty;
        difficultySelect.addEventListener('change', (e) => {
            const newDifficulty = (e.target as HTMLSelectElement).value as Difficulty;
            gameState.difficulty = newDifficulty;
            initGame(); // Reinicia el juego con la nueva dificultad
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
