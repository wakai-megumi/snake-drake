import { FOOD_TYPES } from '../config.js';

export class Food {
    constructor(tileCount) {
        this.tileCount = tileCount;
        this.foods = [];  // Initialize empty array
        console.log('Food constructor called, FOOD_TYPES:', FOOD_TYPES);
        // Generate initial food in constructor
        this.generate();
    }

    generate() {
        if (!FOOD_TYPES || FOOD_TYPES.length === 0) {
            console.error('No FOOD_TYPES available in generate!');
            return;
        }

        const selectedType = this.selectRandomType();
        console.log('Selected food type:', selectedType);
        
        if (!selectedType || !selectedType.emoji) {
            console.error('Invalid food type selected:', selectedType);
            return;
        }

        const newFood = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount),
            type: selectedType,
            scale: 1,
            timeLeft: Math.floor(Math.random() * 50) + 75,
            emoji: selectedType.emoji
        };

        // Check if the position is already occupied
        while (this.foods.some(food => food.x === newFood.x && food.y === newFood.y)) {
            newFood.x = Math.floor(Math.random() * this.tileCount);
            newFood.y = Math.floor(Math.random() * this.tileCount);
        }

        this.foods.push(newFood);
        console.log('Generated new food:', newFood);
        console.log('Current foods:', this.foods);
    }

    selectRandomType() {
        if (!FOOD_TYPES || FOOD_TYPES.length === 0) {
            console.error('No food types available!');
            return null;
        }

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
        const oldLength = this.foods.length;
        // Update each food's timer and remove expired ones
        this.foods = this.foods.filter(food => {
            food.timeLeft--;
            return food.timeLeft > 0;
        });

        // Return true if all food is gone (to trigger new food generation)
        const foodsRemoved = oldLength > this.foods.length;
        console.log('Foods update - old length:', oldLength, 'new length:', this.foods.length);
        return this.foods.length === 0;
    }

    checkCollision(x, y) {
        // Find the food item that was collided with
        const collidedFoodIndex = this.foods.findIndex(food => food.x === x && food.y === y);
        
        if (collidedFoodIndex !== -1) {
            const collidedFood = this.foods[collidedFoodIndex];
            // Remove the eaten food
            this.foods.splice(collidedFoodIndex, 1);
            console.log('Food collision detected, remaining foods:', this.foods);
            return collidedFood;
        }
        
        return false;
    }

    // Check if any food exists at the given coordinates without removing it
    hasCollision(x, y) {
        return this.foods.some(food => food.x === x && food.y === y);
    }
}
