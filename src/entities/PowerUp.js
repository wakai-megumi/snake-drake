import { POWER_UP_TYPES, POWER_UP_DURATION } from '../config.js';

export class PowerUp {
    constructor(tileCount) {
        this.tileCount = tileCount;
        this.active = null;
    }

    generate() {
        const selectedType = this.selectRandomType();
        this.active = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount),
            type: selectedType,
            scale: 1
        };
    }

    selectRandomType() {
        const rand = Math.random();
        let cumProb = 0;
        
        for (const type of POWER_UP_TYPES) {
            cumProb += type.probability;
            if (rand <= cumProb) {
                return type;
            }
        }
        return POWER_UP_TYPES[0];
    }

    checkCollision(x, y) {
        return this.active && this.active.x === x && this.active.y === y;
    }

    collect(game) {
        if (this.active) {
            this.activate(this.active.type, game);
            this.active = null;
        }
    }

    activate(type, game) {
        // Clear existing timer if any
        if (game.activeTimers[type.name]) {
            clearTimeout(game.activeTimers[type.name]);
        }

        // Apply effect
        type.effect(game);

        // Set timer to reset effect
        game.activeTimers[type.name] = setTimeout(() => {
            type.reset(game);
            delete game.activeTimers[type.name];
        }, POWER_UP_DURATION);
    }
}
