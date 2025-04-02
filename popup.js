import { Game } from './src/game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('gameOver');
    
    try {
        const game = new Game(canvas, scoreElement, gameOverElement);
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
        gameOverElement.textContent = 'Error initializing game. Please refresh.';
        gameOverElement.style.display = 'block';
    }
});
