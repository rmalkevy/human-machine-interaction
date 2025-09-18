<script setup>
import './reset.css';

import { defineModel, computed, watch, ref, onMounted, onUnmounted } from 'vue';

const counterModel = defineModel('counterModel', { type: Number, default: 0 });
const tempRef = ref(0);

const handleClick = () => {
  counterModel.value++;
};

const computedLabel = computed(() => `Counter: ${counterModel.value}`);

watch(counterModel, (newVal) => {
  localStorage.setItem('counterModel', newVal);
  console.log('counterModel changed = ', newVal, 'tempRef = ', tempRef.value);
});

onMounted(() => {
  counterModel.value = Number(localStorage.getItem('counterModel'));
})

onUnmounted(() => {
  console.log('onUnmounted');
})
</script>

<template>
  <div class="kai-container">
    <button class="kai-button" @click="handleClick">{{ computedLabel }}</button>
    <input type="number" class="kai-input" v-model="counterModel" id="kai-input" />
  </div>
</template>

<style scoped>
.kai-button {
  background-color: blue;
  color: #fff;
  height: 30px;
  border-radius: 5px;
  width: 100px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0 10px;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
  }
}

.kai-input {
  width: 100px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 0 10px;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    border: 1px solid blue;
  }
}

.kai-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
}
</style>
