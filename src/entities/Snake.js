export class Snake {
    constructor(startX, startY) {
        this.segments = [{ x: startX, y: startY }];
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
    }

    move(head) {
        // Apply buffered direction change if not moving into self
        if ((this.nextDx !== 0 || this.nextDy !== 0) && 
            !(this.nextDx === -this.dx && this.nextDy === -this.dy)) {
            this.dx = this.nextDx;
            this.dy = this.nextDy;
            this.nextDx = 0;
            this.nextDy = 0;
        }
        this.segments.unshift(head);
    }

    removeTail() {
        return this.segments.pop();
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

        // Set the direction
        this.nextDx = dx;
        this.nextDy = dy;
        
        // Return true if direction was set
        return true;
    }

    checkCollision(x, y) {
        return this.segments.some(segment => segment.x === x && segment.y === y);
    }

    reset(startX, startY) {
        this.segments = [{ x: startX, y: startY }];
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
    }
}
