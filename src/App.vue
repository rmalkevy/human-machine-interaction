<script setup>
import './reset.css';

import { defineModel, computed, watch, ref, onMounted, onUnmounted } from 'vue';

const snakeGameBoard = ref([]);
const snake = ref([])
const direction = ref('right');

const moveSnake = () => {
  if (direction.value === 'right') {
    snake.value.push({ x: snake.value[snake.value.length - 1].x + 1, y: snake.value[snake.value.length - 1].y });
    snake.value.shift();
  } else if (direction.value === 'left') {
    snake.value.push({ x: snake.value[snake.value.length - 1].x - 1, y: snake.value[snake.value.length - 1].y });
    snake.value.shift();
  } else if (direction.value === 'up') {
    snake.value.push({ x: snake.value[snake.value.length - 1].x, y: snake.value[snake.value.length - 1].y - 1 });
    snake.value.shift();
  } else if (direction.value === 'down') {
    snake.value.push({ x: snake.value[snake.value.length - 1].x, y: snake.value[snake.value.length - 1].y + 1 });
    snake.value.shift();
  }
}

const changeDirection = (newDirection) => {
  direction.value = newDirection;
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
  if (
    snake.value[snake.value.length - 1].x < 0 ||
    snake.value[snake.value.length - 1].x > snakeGameBoard.value[0].length - 1 ||
    snake.value[snake.value.length - 1].y < 0 ||
    snake.value[snake.value.length - 1].y > snakeGameBoard.value.length - 1) {
    return true;
  }
  return false;
}

onMounted(() => {
  snakeGameBoard.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0));
  snake.value = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  console.log(snakeGameBoard.value);

  const interval =setInterval(() => {
    moveSnake();
    if (detectBoardCollision()) {
      clearInterval(interval);
      alert('Game Over');
    }
  }, 500);

  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

</script>

<template>
  <div class="snake-game-container">
    <div class="snake-game-board">
      <div class="snake-game-board-row" v-for="row, rowIndex in snakeGameBoard" :key="`row-${rowIndex}`">
        <div
          v-for="col, colIndex in row"
          class="snake-game-board-cell"
          :class="{ 'snake-game-board-cell-snake': snake.some(item => item.x === colIndex && item.y === rowIndex) }"
          :key="`row-${rowIndex}-col-${colIndex}`"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snake-game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
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
</style>
