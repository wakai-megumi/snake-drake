import { FOOD_TYPES } from '../config.js';

export class Food {
    constructor(tileCount) {
        this.tileCount = tileCount;
        this.generate();
    }

    generate() {
        const selectedType = this.selectRandomType();
        this.x = Math.floor(Math.random() * this.tileCount);
        this.y = Math.floor(Math.random() * this.tileCount);
        this.type = selectedType;
        this.scale = 1;
        this.timeLeft = Math.floor(Math.random() * 50) + 75;
    }

    selectRandomType() {
        const rand = Math.random();
        let cumProb = 0;
        
        for (const type of FOOD_TYPES) {
            cumProb += type.probability;
            if (rand <= cumProb) {
                return type;
            }
        }
        return FOOD_TYPES[0];
    }

    update() {
        this.timeLeft--;
        return this.timeLeft <= 0;
    }

    checkCollision(x, y) {
        return this.x === x && this.y === y;
    }
}
