<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useWebSocketScore } from './composables/useWebSocketScore';

import './reset.css';

const BOARD_SIZE = 10;
const INITIAL_SPEED = 500;
const SPEED_INCREMENT = 20;
const INITIAL_SNAKE = () => [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
];
const DIRECTIONS = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

const snakeGameBoard = ref([]);
const snake = ref(INITIAL_SNAKE());
const direction = ref('right');
const food = ref()
const interval = ref(null);
const speed = ref(INITIAL_SPEED);
const score = ref(0);
const isGameOver = ref(false);
const clientId = uuidv4();

const { competitorScore } = useWebSocketScore(score);

const moveSnake = () => {
  const head = snake.value[snake.value.length - 1];
  const move = DIRECTIONS[direction.value];
  const newHead = { x: head.x + move.x, y: head.y + move.y };

  snake.value.push(newHead);
  snake.value.shift();
}

const changeDirection = (newDirection) => {
  const opposite = {
    right: 'left',
    left: 'right',
    up: 'down',
    down: 'up',
  };

  if (opposite[newDirection] !== direction.value) {
    direction.value = newDirection;
  }
}

const handleKeyDown = (event) => {
  console.log(event.key);
  if (event.key === 'ArrowRight') {
    changeDirection('right');
  } else if (event.key === 'ArrowLeft') {
    changeDirection('left');
  } else if (event.key === 'ArrowUp') {
    changeDirection('up');
  } else if (event.key === 'ArrowDown') {
    changeDirection('down');
  }
}

const detectBoardCollision = () => {
  const head = snake.value.at(-1);
  return (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= BOARD_SIZE ||
    head.y >= BOARD_SIZE
  );
}

const detectFoodCollision = () => {
  if (snake.value[snake.value.length - 1].x === food.value.x && snake.value[snake.value.length - 1].y === food.value.y) {
    score.value++;
    return true;
  }
  return false;
}

const detectSnakeCollision = () => {
  const snakeBody = snake.value.slice(0, -1);
  if (snakeBody.some(item => item.x === snake.value[snake.value.length - 1].x && item.y === snake.value[snake.value.length - 1].y)) {
    return true;
  }
  return false;
}

const generateFood = () => {
  while (true) {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
    if (!snake.value.some(p => p.x === newFood.x && p.y === newFood.y)) {
      return newFood;
    }
  }
};

const initGame = () => {
  snakeGameBoard.value = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => 0));
  snake.value = INITIAL_SNAKE();
  food.value = generateFood();
  score.value = 0;
  isGameOver.value = false;
  speed.value = INITIAL_SPEED;
  direction.value = 'right';
  if (interval.value) {
    clearInterval(interval.value);
  }
}

const speedUpGame = () => {
  clearInterval(interval.value);
  speed.value -= SPEED_INCREMENT;
  interval.value = setInterval(() => {
    startGame()
  }, speed.value);
}

const startGame = () => {
  isGameOver.value = false;
  moveSnake();
  if (detectBoardCollision() || detectSnakeCollision()) {
    clearInterval(interval.value);
    alert(`Game Over, your score is ${score.value}`);
    isGameOver.value = true;
  }
  if (detectFoodCollision()) {
    food.value = generateFood();
    snake.value.push(snake.value[snake.value.length - 1]);
    speedUpGame();
  }
}

const restartGame = () => {
  initGame();
  interval.value = setInterval(() => {
    startGame()
  }, speed.value);
}

onMounted(() => {
  initGame();
  interval.value = setInterval(() => {
    startGame()
  }, speed.value);

  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

</script>

<template>
  <div class="snake-game-container">
    <div class="snake-game-score">
      <span v-if="!isGameOver">MY SCORE: {{ score }}</span>
      <button v-else class="snake-game-start-button" @click="restartGame">Restart</button>
    </div>
    <div class="snake-game-board">
      <div class="snake-game-board-row" v-for="row, rowIndex in snakeGameBoard" :key="`row-${rowIndex}`">
        <div
          v-for="col, colIndex in row"
          class="snake-game-board-cell"
          :class="{
            'snake-game-board-cell-snake': snake.some(item => item.x === colIndex && item.y === rowIndex),
            'snake-game-board-cell-food': food.x === colIndex && food.y === rowIndex,
          }"
          :key="`row-${rowIndex}-col-${colIndex}`"
        ></div>
      </div>
    </div>
    <span>COMPETITOR SCORE: {{ competitorScore }}</span>
  </div>
</template>

<style scoped>
.snake-game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.snake-game-board {
  width: 500px;
  height: 500px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #000;
}
.snake-game-board-row {
  width: 100%;
  height: 50px;
  display: flex;
}
.snake-game-board-cell {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.snake-game-board-cell + .snake-game-board-cell {
  border-left: 1px solid #000;
}
.snake-game-board-row + .snake-game-board-row {
  border-top: 1px solid #000;
}
.snake-game-board-cell-snake {
  background-color: rgba(255, 0, 0, 0.716);
}
.snake-game-board-cell-food {
  background-color: greenyellow;
}
.snake-game-score {
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
}
.snake-game-start-button {
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  background-color: greenyellow;
  color: red;
}
</style>
