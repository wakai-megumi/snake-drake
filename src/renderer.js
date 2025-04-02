import { GRID_SIZE } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationFrame = 0;
        this.backgroundOffset = { x: 0, y: 0 };
        this.lastDirection = { x: 0, y: 0 };
        this.grassPatches = this.generateGrassPatches();
        this.flowers = this.generateFlowers();
    }

    generateGrassPatches() {
        const patches = [];
        for (let i = 0; i < 100; i++) {
            patches.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 5 + Math.random() * 15,
                angle: Math.random() * Math.PI * 2,
                color: `rgb(${30 + Math.random() * 30}, ${100 + Math.random() * 50}, ${30 + Math.random() * 30})`
            });
        }
        return patches;
    }

    generateFlowers() {
        const flowers = [];
        const flowerColors = ['#ff6b6b', '#ffb8b8', '#fff3a3', '#48dbfb'];
        for (let i = 0; i < 20; i++) {
            flowers.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
                size: 4 + Math.random() * 4
            });
        }
        return flowers;
    }

    drawGrassBlade(x, y, size, angle, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle + Math.sin(this.animationFrame * 0.05) * 0.1);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(size/2, -size, size, 0);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawFlower(x, y, color, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(Math.sin(this.animationFrame * 0.03) * 0.1);

        // Draw petals
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.rotate(Math.PI * 2 / 5);
            this.ctx.ellipse(size, 0, size, size/2, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }

        // Draw center
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd32a';
        this.ctx.fill();

        this.ctx.restore();
    }

    clear() {
        // Create base grass background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2ecc71');  // Lighter grass green
        gradient.addColorStop(1, '#27ae60');  // Darker grass green
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ambient shadows
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(this.animationFrame * 0.02 + i) * 100) + this.backgroundOffset.x;
            const y = (Math.cos(this.animationFrame * 0.02 + i) * 100) + this.backgroundOffset.y;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, 100, 50, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Update background offset based on snake direction
        this.backgroundOffset.x += this.lastDirection.x * 0.5;
        this.backgroundOffset.y += this.lastDirection.y * 0.5;
        
        // Keep offsets within bounds
        this.backgroundOffset.x = this.backgroundOffset.x % GRID_SIZE;
        this.backgroundOffset.y = this.backgroundOffset.y % GRID_SIZE;

        // Draw grass patches with offset
        this.grassPatches.forEach(patch => {
            const x = (patch.x + this.backgroundOffset.x) % this.canvas.width;
            const y = (patch.y + this.backgroundOffset.y) % this.canvas.height;
            this.drawGrassBlade(x, y, patch.size, patch.angle, patch.color);
        });

        // Draw flowers with offset
        this.flowers.forEach(flower => {
            const x = (flower.x + this.backgroundOffset.x) % this.canvas.width;
            const y = (flower.y + this.backgroundOffset.y) % this.canvas.height;
            this.drawFlower(x, y, flower.color, flower.size);
        });

        // Draw subtle grid for gameplay clarity
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        // Draw vertical lines with offset
        for (let x = -GRID_SIZE; x <= this.canvas.width + GRID_SIZE; x += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.backgroundOffset.x, 0);
            this.ctx.lineTo(x + this.backgroundOffset.x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines with offset
        for (let y = -GRID_SIZE; y <= this.canvas.height + GRID_SIZE; y += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + this.backgroundOffset.y);
            this.ctx.lineTo(this.canvas.width, y + this.backgroundOffset.y);
            this.ctx.stroke();
        }
    }

    drawSnake(snake, activeEffects) {
        // Update last direction based on snake head movement
        if (snake.segments.length > 1) {
            const head = snake.segments[0];
            const neck = snake.segments[1];
            this.lastDirection.x = head.x - neck.x;
            this.lastDirection.y = head.y - neck.y;
        }

        snake.segments.forEach((segment, index) => {
            // Create snake body gradient
            const gradientY = segment.y * GRID_SIZE;
            const segmentGradient = this.ctx.createLinearGradient(
                segment.x * GRID_SIZE,
                gradientY,
                segment.x * GRID_SIZE,
                gradientY + GRID_SIZE
            );

            if (index === 0) {
                // Head color based on active effects
                if (activeEffects.ghost) {
                    segmentGradient.addColorStop(0, '#ffffff80');
                    segmentGradient.addColorStop(1, '#ffffff60');
                } else if (activeEffects.shield) {
                    segmentGradient.addColorStop(0, '#00fff780');
                    segmentGradient.addColorStop(1, '#00fff760');
                } else {
                    // Blue color scheme for head
                    segmentGradient.addColorStop(0, '#3498db');
                    segmentGradient.addColorStop(1, '#2980b9');
                }
            } else {
                // Purple color scheme for body
                segmentGradient.addColorStop(0, '#9b59b6');
                segmentGradient.addColorStop(1, '#8e44ad');
            }
            
            this.ctx.fillStyle = segmentGradient;
            
            // Draw segment with rounded corners and outline
            this.ctx.beginPath();
            this.ctx.roundRect(
                segment.x * GRID_SIZE,
                segment.y * GRID_SIZE,
                GRID_SIZE - 1,
                GRID_SIZE - 1,
                4
            );
            this.ctx.fill();
            
            // Add white outline to make snake more visible
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw snake eyes on head
            if (index === 0) {
                this.ctx.fillStyle = '#fff';
                const eyeSize = 4;
                const eyeOffset = 5;
                
                // Left eye
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * GRID_SIZE + eyeOffset + eyeSize/2,
                    segment.y * GRID_SIZE + eyeOffset + eyeSize/2,
                    eyeSize/2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                
                // Right eye
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize/2,
                    segment.y * GRID_SIZE + eyeOffset + eyeSize/2,
                    eyeSize/2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                
                // Black pupils
                this.ctx.fillStyle = '#000';
                const pupilSize = 2;
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * GRID_SIZE + eyeOffset + eyeSize/2,
                    segment.y * GRID_SIZE + eyeOffset + eyeSize/2,
                    pupilSize/2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize/2,
                    segment.y * GRID_SIZE + eyeOffset + eyeSize/2,
                    pupilSize/2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        });
    }

    drawFood(food) {
        // Draw all food items
        console.log('Drawing foods:', food.foods);
        
        food.foods.forEach(foodItem => {
            const foodSize = GRID_SIZE * foodItem.scale;
            
            // Draw glowing effect
            const glowRadius = GRID_SIZE * 0.8;
            const gradient = this.ctx.createRadialGradient(
                foodItem.x * GRID_SIZE + GRID_SIZE/2,
                foodItem.y * GRID_SIZE + GRID_SIZE/2,
                0,
                foodItem.x * GRID_SIZE + GRID_SIZE/2,
                foodItem.y * GRID_SIZE + GRID_SIZE/2,
                glowRadius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                foodItem.x * GRID_SIZE - glowRadius/2,
                foodItem.y * GRID_SIZE - glowRadius/2,
                GRID_SIZE + glowRadius,
                GRID_SIZE + glowRadius
            );

            // Draw emoji
            this.ctx.font = `${foodSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            console.log('Drawing emoji:', foodItem.emoji, 'at position:', foodItem.x, foodItem.y);
            this.ctx.fillText(
                foodItem.emoji,
                foodItem.x * GRID_SIZE + GRID_SIZE/2,
                foodItem.y * GRID_SIZE + GRID_SIZE/2
            );

            // Draw food timer indicator
            const timerWidth = (foodItem.timeLeft / 125) * GRID_SIZE;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fillRect(
                foodItem.x * GRID_SIZE,
                foodItem.y * GRID_SIZE + GRID_SIZE - 3,
                timerWidth,
                3
            );
        });
    }

    drawPowerUp(powerUp) {
        if (!powerUp.active) return;

        const scale = 1 + Math.sin(this.animationFrame * 0.2) * 0.2;
        const size = GRID_SIZE * scale;
        const offset = (GRID_SIZE - size) / 2;
        
        // Draw glowing effect
        const glowRadius = GRID_SIZE;
        const gradient = this.ctx.createRadialGradient(
            powerUp.active.x * GRID_SIZE + GRID_SIZE/2,
            powerUp.active.y * GRID_SIZE + GRID_SIZE/2,
            0,
            powerUp.active.x * GRID_SIZE + GRID_SIZE/2,
            powerUp.active.y * GRID_SIZE + GRID_SIZE/2,
            glowRadius
        );
        gradient.addColorStop(0, powerUp.active.type.color + '80');
        gradient.addColorStop(1, powerUp.active.type.color + '00');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            powerUp.active.x * GRID_SIZE - glowRadius/2,
            powerUp.active.y * GRID_SIZE - glowRadius/2,
            GRID_SIZE + glowRadius,
            GRID_SIZE + glowRadius
        );
        
        // Draw power-up with white outline
        this.ctx.fillStyle = powerUp.active.type.color;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.roundRect(
            powerUp.active.x * GRID_SIZE + offset,
            powerUp.active.y * GRID_SIZE + offset,
            size - 1,
            size - 1,
            4
        );
        this.ctx.fill();
        this.ctx.stroke();

        // Draw power-up name with better visibility
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeText(
            powerUp.active.type.name,
            powerUp.active.x * GRID_SIZE + GRID_SIZE / 2,
            powerUp.active.y * GRID_SIZE - 5
        );
        this.ctx.fillText(
            powerUp.active.type.name,
            powerUp.active.x * GRID_SIZE + GRID_SIZE / 2,
            powerUp.active.y * GRID_SIZE - 5
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
