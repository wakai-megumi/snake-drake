# Modern Snake Game

A modern implementation of the classic Snake game with additional features and power-ups.

## Features

- 🐍 Smooth snake movement with arrow key controls
- 🍎 Multiple food types with different points:
  - Red (10 points)
  - Yellow (20 points)
  - Purple (30 points)
- ⚡ Power-ups:
  - Speed Boost (Blue)
  - Ghost Mode (White) - Pass through walls
  - Double Points (Orange)
  - Shield (Cyan) - Protect from self-collision
- 🎮 Game Controls:
  - Arrow Keys: Move snake
  - Enter: Pause/Resume
  - Space: Restart after game over
- 🎨 Modern UI:
  - Animated grid background
  - Score display
  - Game over screen
  - Pause overlay
  - Visual effects for power-ups

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/snake-game.git
```

2. Open the project directory:
```bash
cd snake-game
```

3. Start a local server (using Python or any other method):
```bash
python -m http.server 8000
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

## Technologies Used

- HTML5 Canvas
- Modern JavaScript (ES6+)
- CSS3

## Project Structure

```
snake-game/
├── src/
│   ├── entities/
│   │   ├── Snake.js
│   │   ├── Food.js
│   │   └── PowerUp.js
│   ├── game.js
│   ├── renderer.js
│   └── config.js
├── index.html
└── README.md
```

## License

MIT License - feel free to use this project for learning and development purposes.
