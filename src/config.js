export const GRID_SIZE = 20;
export const GAME_SPEED = 100;
export const POWER_UP_DURATION = 5000;
export const POWER_UP_SPAWN_CHANCE = 0.005;

export const FOOD_TYPES = [
    { color: '#e74c3c', points: 10, probability: 0.6 },    // Regular food (red)
    { color: '#f1c40f', points: 20, probability: 0.3 },    // Special food (yellow)
    { color: '#9b59b6', points: 30, probability: 0.1 }     // Rare food (purple)
];

export const POWER_UP_TYPES = [
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
];
