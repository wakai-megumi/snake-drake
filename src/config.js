// Game constants
export const GRID_SIZE = 20;
export const GAME_SPEED = 100;
export const POWER_UP_DURATION = 5000;
export const POWER_UP_SPAWN_CHANCE = 0.005;
export const MAX_FOODS = 3;  // Maximum number of foods that can spawn at once
export const MULTI_FOOD_SPAWN_CHANCE = 0.3;  // Increased chance to spawn additional food

// Food types with their properties
export const FOOD_TYPES = Object.freeze([
    { 
        color: '#e74c3c', 
        points: 10, 
        probability: 0.6, 
        emoji: '🍎',
        name: 'apple'
    },
    { 
        color: '#f1c40f', 
        points: 20, 
        probability: 0.3, 
        emoji: '🍊',
        name: 'orange'
    },
    { 
        color: '#9b59b6', 
        points: 30, 
        probability: 0.1, 
        emoji: '🍇',
        name: 'grape'
    }
]);

// Power-up types
export const POWER_UP_TYPES = Object.freeze([
    { 
        color: '#3498db', 
        name: 'Speed', 
        probability: 0.3,
        effect: (game) => { game.speed = 50; },
        reset: (game) => { game.speed = GAME_SPEED; }
    },
    { 
        color: '#ffffff', 
        name: 'Ghost', 
        probability: 0.2,
        effect: (game) => { game.activeEffects.ghost = true; },
        reset: (game) => { game.activeEffects.ghost = false; }
    },
    { 
        color: '#f39c12', 
        name: 'Double Points', 
        probability: 0.3,
        effect: (game) => { game.activeEffects.doublePoints = true; },
        reset: (game) => { game.activeEffects.doublePoints = false; }
    },
    { 
        color: '#00fff7', 
        name: 'Shield', 
        probability: 0.2,
        effect: (game) => { game.activeEffects.shield = true; },
        reset: (game) => { game.activeEffects.shield = false; }
    }
]);
