import { GRID_SIZE } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationFrame = 0;
    }

    clear() {
        // Fill base background
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw animated grid pattern
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';  
        this.ctx.lineWidth = 1;
        
        // Calculate grid offset based on animation frame
        const offset = Math.sin(this.animationFrame * 0.1) * 4;  
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + offset, 0);
            this.ctx.lineTo(x + offset, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + offset);
            this.ctx.lineTo(this.canvas.width, y + offset);
            this.ctx.stroke();
        }
    }

    drawSnake(snake, activeEffects) {
        snake.segments.forEach((segment, index) => {
            if (index === 0) {
                // Head color based on active effects
                if (activeEffects.ghost) this.ctx.fillStyle = '#ffffff80';
                else if (activeEffects.shield) this.ctx.fillStyle = '#00fff780';
                else this.ctx.fillStyle = '#2ecc71';
            } else {
                this.ctx.fillStyle = '#2ecc71';
            }
            
            this.ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
            
            // Draw snake eyes on head
            if (index === 0) {
                this.ctx.fillStyle = '#000';
                const eyeSize = 3;
                const eyeOffset = 5;
                this.ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
                this.ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
            }
        });
    }

    drawFood(food) {
        const foodSize = GRID_SIZE * food.scale;
        const foodOffset = (GRID_SIZE - foodSize) / 2;
        
        this.ctx.fillStyle = food.type.color;
        this.ctx.fillRect(
            food.x * GRID_SIZE + foodOffset,
            food.y * GRID_SIZE + foodOffset,
            foodSize - 1,
            foodSize - 1
        );

        // Draw food timer indicator
        const timerWidth = (food.timeLeft / 125) * GRID_SIZE;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(
            food.x * GRID_SIZE,
            food.y * GRID_SIZE + GRID_SIZE - 2,
            timerWidth,
            2
        );
    }

    drawPowerUp(powerUp) {
        if (!powerUp.active) return;

        const scale = 1 + Math.sin(this.animationFrame * 0.2) * 0.2;
        const size = GRID_SIZE * scale;
        const offset = (GRID_SIZE - size) / 2;
        
        this.ctx.fillStyle = powerUp.active.type.color;
        this.ctx.fillRect(
            powerUp.active.x * GRID_SIZE + offset,
            powerUp.active.y * GRID_SIZE + offset,
            size - 1,
            size - 1
        );

        // Draw power-up name
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            powerUp.active.type.name,
            powerUp.active.x * GRID_SIZE + GRID_SIZE / 2,
            powerUp.active.y * GRID_SIZE - 2
        );
    }

    drawActiveEffects(activeEffects) {
        let effectIndex = 0;
        for (const [effect, active] of Object.entries(activeEffects)) {
            if (active) {
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(
                    effect,
                    10,
                    50 + effectIndex * 20
                );
                effectIndex++;
            }
        }
    }

    drawPauseOverlay() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Pause text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        // Instructions
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press ENTER to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    updateAnimation() {
        this.animationFrame = (this.animationFrame + 1) % 60;
    }
}
