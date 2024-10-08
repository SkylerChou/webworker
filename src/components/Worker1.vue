<!-- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API -->
<template>
  <label for="fib">費氏數列: </label>
  <input id="fib" type="number" v-model="term" min="1" />

  <div class="btn__wrap">
    <button class="btn btn-main" @click="baseFn">Run on Main Thread</button>
    <button v-if="!isHaveWoker" class="btn btn-worker" @click="workerFn">
      Start Worker
    </button>
    <button v-else class="btn btn-danger" @click="workerTerminate">
      Terminate Worker
    </button>
  </div>

  <h2>執行續 (Thread): {{ runner }}</h2>
  <h2>排序結果 (Result): {{ sortValue }}</h2>
  <h2>費氏數列 (Result): {{ fibonnaciValue }}</h2>
</template>
<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";

const worker_fibonacci: Worker = new Worker(
  new URL("../worker_fibonacci.ts", import.meta.url)
);

const worker_heavyTask: Worker = new Worker(
  new URL("../worker_heavyTask.ts", import.meta.url)
);

/** 是否有開 worker */
const isHaveWoker = ref(false);

/** 目前執行序 */
const runner = ref<string>("");
/** 排序結果 */
const sortValue = ref<number[] | null>(null);
/** 費氏數列結果 */
const fibonnaciValue = ref<number | null>();
/** inputValue */
let term = ref<number | null>();

// WORKER onmessage
worker_fibonacci.onmessage = (event) => {
  fibonnaciValue.value = event.data;
};
worker_heavyTask.onmessage = (event) => {
  sortValue.value = event.data;
};

/** @func 模擬大量排序-給主執行續使用邏輯的方法(跟worker的邏輯一樣的)*/
function heavyTask() {
  const randomNumber = () => Math.trunc(Math.random() * 5_000_00);
  const numbers: number[] = Array(5_000_000).fill(undefined).map(randomNumber);
  numbers.sort();
  return numbers.slice(0, 5);
}

/** @func 費氏數列-給主執行續使用邏輯的方法(跟worker的邏輯一樣的)*/
function fibonacci(num: number): number {
  if (num === 1) return 0;
  if (num === 2) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

/** @func 點擊方法-在主執行序執行 */
async function baseFn() {
  sortValue.value = null;
  fibonnaciValue.value = null;
  await nextTick();
  sortValue.value = heavyTask();
  if (term.value) {
    fibonnaciValue.value = fibonacci(term.value);
  }
  runner.value = "Main";
}

/** @func 點擊方法-開Work執行 */
async function workerFn() {
  sortValue.value = null;
  fibonnaciValue.value = null;
  isHaveWoker.value = true;
  await nextTick();
  /**
   * WORKER postMessage
   * 因為無法直接使用，需要用 postMessage、onmessage 溝通
   */
  worker_heavyTask.postMessage("start");
  if (term.value) {
    worker_fibonacci.postMessage(term.value);
  }
  runner.value = "Worker";
}

/**
 * @func 終止/移除執行序
 * 如果呼叫這個方法後續就無法使用 web worker
 */
function workerTerminate() {
  worker_fibonacci.terminate();
  worker_heavyTask.terminate();
  isHaveWoker.value = false;
}

onUnmounted(() => {
  workerTerminate();
});
</script>
