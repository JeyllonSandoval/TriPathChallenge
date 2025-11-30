"use strict";
// Inicialización del juego
function init() {
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            console.log('New Game button clicked');
            // La lógica del juego se implementará en los siguientes pasos
        });
    }
}
// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
