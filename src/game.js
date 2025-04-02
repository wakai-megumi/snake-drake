import { GRID_SIZE, GAME_SPEED, POWER_UP_SPAWN_CHANCE, FOOD_TYPES } from './config.js';
import { Snake } from './entities/Snake.js';
import { Food } from './entities/Food.js';
import { PowerUp } from './entities/PowerUp.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor(canvas, scoreElement, gameOverElement) {
        console.log('Game constructor called');
        this.canvas = canvas;
        this.scoreElement = scoreElement;
        this.gameOverElement = gameOverElement;
        this.tileCount = canvas.width / GRID_SIZE;
        
        this.snake = new Snake(10, 10);
        this.food = new Food(this.tileCount);
        this.powerUp = new PowerUp(this.tileCount);
        this.renderer = new Renderer(canvas);
        
        this.score = 0;
        this.speed = GAME_SPEED;
        this.gameLoopInterval = null;
        this.isRunning = false;
        this.isPaused = false;
        this.activeEffects = {
            ghost: false,
            doublePoints: false,
            shield: false
        };
        this.activeTimers = {};

        // Generate initial food before setting up event listeners
        console.log('Generating initial food, FOOD_TYPES available:', FOOD_TYPES);
        this.generateNewFood();
        
        this.setupEventListeners();
        
        // Initial draw to show the game state
        console.log('Performing initial draw');
        this.draw();
    }

    update() {
        if (!this.isRunning || this.isPaused) {
            console.log('Game not running or paused');
            return;
        }
        
        // Don't update if snake isn't moving
        if (this.snake.dx === 0 && this.snake.dy === 0) {
            console.log('Snake not moving yet');
            return;
        }
        
        // Get next position
        let nextX = this.snake.getHead().x + this.snake.dx;
        let nextY = this.snake.getHead().y + this.snake.dy;

        console.log('Snake moving to:', nextX, nextY, 'with direction:', this.snake.dx, this.snake.dy);

        // Wall collision with ghost mode check
        if (!this.activeEffects.ghost) {
            if (nextX < 0 || nextX >= this.tileCount || nextY < 0 || nextY >= this.tileCount) {
                console.log('Wall collision detected');
                this.gameOver();
                return;
            }
        } else {
            // Wrap around with ghost mode
            if (nextX < 0) nextX = this.tileCount - 1;
            if (nextX >= this.tileCount) nextX = 0;
            if (nextY < 0) nextY = this.tileCount - 1;
            if (nextY >= this.tileCount) nextY = 0;
        }

        // Self collision with shield check
        if (!this.activeEffects.shield && this.snake.checkCollision(nextX, nextY)) {
            console.log('Self collision detected');
            this.gameOver();
            return;
        }

        // Move snake
        this.snake.move(nextX, nextY);

        // Food collision
        const collidedFood = this.food.checkCollision(nextX, nextY);
        if (collidedFood) {
            console.log('Food collision detected');
            // Add points based on food type
            this.score += this.activeEffects.doublePoints ? collidedFood.type.points * 2 : collidedFood.type.points;
            this.scoreElement.textContent = this.score;
            
            // Grow snake
            this.snake.grow();
            
            // Generate new food if all current food is eaten
            if (this.food.foods.length === 0) {
                this.generateNewFood();
            }
        }

        // Update existing food timers
        if (this.food.update()) {
            this.generateNewFood();
        }

        // Power-up collision and update
        if (this.powerUp.checkCollision(nextX, nextY)) {
            this.powerUp.collect(this);
        }

        // Randomly generate power-up
        if (!this.powerUp.active && Math.random() < POWER_UP_SPAWN_CHANCE) {
            this.generateNewPowerUp();
        }

        this.renderer.updateAnimation();
    }

    draw() {
        console.log('Draw called, current foods:', this.food.foods);
        this.renderer.clear();
        this.renderer.drawSnake(this.snake, this.activeEffects);
        this.renderer.drawFood(this.food);
        this.renderer.drawPowerUp(this.powerUp);
        
        if (this.isPaused) {
            this.renderer.drawPauseOverlay();
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOverElement.style.display === 'block' && e.code === 'Space') {
                this.start();
                return;
            }

            // Handle pause/resume with Enter key
            if (e.code === 'Enter') {
                if (this.isRunning) {
                    if (this.isPaused) {
                        this.resume();
                    } else {
                        this.pause();
                    }
                }
                return;
            }

            if (this.isPaused) return; // Don't handle movement when paused

            let directionSet = false;
            switch (e.code) {
                case 'ArrowUp':
                    directionSet = this.snake.setDirection(0, -1);
                    break;
                case 'ArrowDown':
                    directionSet = this.snake.setDirection(0, 1);
                    break;
                case 'ArrowLeft':
                    directionSet = this.snake.setDirection(-1, 0);
                    break;
                case 'ArrowRight':
                    directionSet = this.snake.setDirection(1, 0);
                    break;
            }

            // Start game on first valid direction input if not already running
            if (directionSet && !this.isRunning) {
                console.log('Starting game on first direction input');
                this.start();
            }
        });
    }

    start() {
        if (this.isRunning) {
            console.log('Game already running');
            return;
        }
        
        console.log('Starting game');
        this.isRunning = true;
        this.gameOverElement.style.display = 'none';
        
        // Reset game state
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.speed = GAME_SPEED;
        this.snake.reset(10, 10);
        
        // Clear existing food and generate new
        this.food.foods = [];
        this.generateNewFood();
        
        // Start game loop
        if (this.gameLoopInterval) {
            console.log('Clearing existing game loop');
            clearInterval(this.gameLoopInterval);
        }
        
        console.log('Starting game loop with speed:', this.speed);
        this.gameLoopInterval = setInterval(() => {
            this.update();
            this.draw();
        }, this.speed);
    }

    gameOver() {
        console.log('Game Over');
        this.isRunning = false;
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        
        // Clear all power-up effects
        for (const timer of Object.values(this.activeTimers)) {
            clearTimeout(timer);
        }
        this.activeTimers = {};
        this.activeEffects = {
            ghost: false,
            doublePoints: false,
            shield: false
        };
        this.gameOverElement.style.display = 'block';
    }

    pause() {
        if (!this.isRunning || this.isPaused) return;
        this.isPaused = true;
        this.draw();
    }

    resume() {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        this.draw();
    }

    generateNewFood() {
        console.log('generateNewFood called');
        if (!FOOD_TYPES || FOOD_TYPES.length === 0) {
            console.error('No FOOD_TYPES available in generateNewFood!');
            return;
        }
        
        // Clear existing foods
        this.food.foods = [];
        
        // Generate initial food
        this.food.generate();
        
        // Chance to generate additional foods
        for (let i = 0; i < 2 && this.food.foods.length < 3; i++) {  // Up to 2 additional foods (3 total max)
            if (Math.random() < 0.3) {  // 30% chance for each additional food
                this.food.generate();
            }
        }
        console.log('Food generation complete, total foods:', this.food.foods?.length || 0);
    }

    generateNewPowerUp() {
        do {
            this.powerUp.generate();
        } while (
            this.snake.checkCollision(this.powerUp.active.x, this.powerUp.active.y) ||
            this.food.hasCollision(this.powerUp.active.x, this.powerUp.active.y)
        );
    }
}
