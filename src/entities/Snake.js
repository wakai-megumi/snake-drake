export class Snake {
    constructor(startX, startY) {
        this.segments = [{ x: startX, y: startY }];
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
        this.growing = false;
        console.log('Snake initialized at:', startX, startY);
    }

    move(nextX, nextY) {
        // Apply buffered direction change
        if (this.nextDx !== 0 || this.nextDy !== 0) {
            this.dx = this.nextDx;
            this.dy = this.nextDy;
            console.log('Applied buffered direction:', this.dx, this.dy);
        }
        
        // Add new head position
        this.segments.unshift({ x: nextX, y: nextY });
        console.log('Added new head at:', nextX, nextY);
        
        // Remove tail unless we're growing
        if (!this.growing) {
            this.segments.pop();
        } else {
            this.growing = false;
            console.log('Snake grew! New length:', this.segments.length);
        }
    }

    grow() {
        this.growing = true;
        console.log('Snake will grow on next move');
    }

    getHead() {
        return this.segments[0];
    }

    setDirection(dx, dy) {
        // Don't allow moving in opposite direction of current movement
        if (this.segments.length > 1 && 
            ((dx !== 0 && dx === -this.dx) || 
             (dy !== 0 && dy === -this.dy))) {
            return false;
        }

        // Set the next direction to be applied on the next move
        this.nextDx = dx;
        this.nextDy = dy;
        console.log('Direction buffered:', dx, dy);
        
        // Start moving if we're not already
        if (this.dx === 0 && this.dy === 0) {
            this.dx = dx;
            this.dy = dy;
            console.log('Initial direction set:', dx, dy);
        }
        
        return true;
    }

    checkCollision(x, y) {
        return this.segments.some((segment, index) => {
            // Skip checking the tail when moving
            if (this.dx !== 0 || this.dy !== 0) {
                if (index === this.segments.length - 1) return false;
            }
            return segment.x === x && segment.y === y;
        });
    }

    reset(startX, startY) {
        this.segments = [{ x: startX, y: startY }];
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
        this.growing = false;
        console.log('Snake reset to:', startX, startY);
    }
}
