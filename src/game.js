import { GRID_SIZE, GAME_SPEED, POWER_UP_SPAWN_CHANCE } from './config.js';
import { Snake } from './entities/Snake.js';
import { Food } from './entities/Food.js';
import { PowerUp } from './entities/PowerUp.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor(canvas, scoreElement, gameOverElement) {
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

        this.setupEventListeners();
        this.generateNewFood(); // Generate initial food
        this.draw(); // Initial draw
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOverElement.style.display === 'block' && e.code === 'Space') {
                this.reset();
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

            // Start game on first valid direction input
            if (directionSet && !this.isRunning) {
                this.isRunning = true;
                this.start();
            }
        });
    }

    start() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }
        this.gameLoopInterval = setInterval(() => this.gameLoop(), this.speed);
    }

    gameLoop() {
        if (!this.isPaused && this.isRunning) {
            this.update();
            this.draw();
        }
    }

    update() {
        if (!this.isRunning || this.isPaused) return;  
        // Get next position
        let nextX = this.snake.getHead().x + this.snake.dx;
        let nextY = this.snake.getHead().y + this.snake.dy;

        // Wall collision with ghost mode check
        if (!this.activeEffects.ghost) {
            if (nextX < 0 || nextX >= this.tileCount || nextY < 0 || nextY >= this.tileCount) {
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

        const head = { x: nextX, y: nextY };

        // Self collision check (only if snake has more than 1 segment)
        if (!this.activeEffects.shield && this.snake.segments.length > 1) {
            // Check against all segments except the tail (which will move)
            const willCollide = this.snake.segments.slice(0, -1).some(segment => 
                segment.x === head.x && segment.y === head.y
            );
            if (willCollide) {
                this.gameOver();
                return;
            }
        }

        // Move snake
        this.snake.move(head);

        // Food collision
        if (this.food.checkCollision(head.x, head.y)) {
            const points = this.food.type.points * (this.activeEffects.doublePoints ? 2 : 1);
            this.score += points;
            this.scoreElement.textContent = this.score;
            this.generateNewFood();
        } else {
            this.snake.removeTail();
        }

        // Power-up collision
        if (this.powerUp.checkCollision(head.x, head.y)) {
            this.powerUp.collect(this);
            if (Math.random() < 0.2) {
                this.generateNewPowerUp();
            }
        }

        // Update food timer
        if (this.food.update()) {
            this.generateNewFood();
        }

        // Randomly generate power-up
        if (!this.powerUp.active && Math.random() < POWER_UP_SPAWN_CHANCE) {
            this.generateNewPowerUp();
        }

        this.renderer.updateAnimation();
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawSnake(this.snake, this.activeEffects);
        this.renderer.drawFood(this.food);
        this.renderer.drawPowerUp(this.powerUp);
        this.renderer.drawActiveEffects(this.activeEffects);
    }

    generateNewFood() {
        do {
            this.food.generate();
        } while (
            this.snake.checkCollision(this.food.x, this.food.y) ||
            (this.powerUp.active && this.powerUp.checkCollision(this.food.x, this.food.y))
        );
    }

    generateNewPowerUp() {
        do {
            this.powerUp.generate();
        } while (
            this.snake.checkCollision(this.powerUp.active.x, this.powerUp.active.y) ||
            this.food.checkCollision(this.powerUp.active.x, this.powerUp.active.y)
        );
    }

    gameOver() {
        this.isRunning = false;
        clearInterval(this.gameLoopInterval);
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

    reset() {
        this.snake.reset(10, 10);
        this.generateNewFood();
        this.powerUp.active = null;
        this.score = 0;
        this.speed = GAME_SPEED;
        this.isRunning = false;
        this.scoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'none';
        this.draw();
    }

    pause() {
        if (!this.isRunning) return;
        this.isPaused = true;
        this.renderer.drawPauseOverlay();
    }

    resume() {
        if (!this.isRunning) return;
        this.isPaused = false;
        this.draw();
    }
}
