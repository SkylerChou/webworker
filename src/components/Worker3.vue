<!-- https://vueuse.org/core/useWebWorkerFn/ -->

<template>
  <label for="fib">費氏數列: </label>
  <input id="fib" type="number" v-model="term" min="1" />

  <div class="btn__wrap">
    <button class="btn btn-main" @click="baseFunc">Run on Main Thread</button>
    <button
      v-if="(!fib_running || !term) && !heavy_running"
      class="btn btn-worker"
      @click="workerFunc"
    >
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
import { useWebWorkerFn } from "@vueuse/core/index.cjs";
import { ref, nextTick, computed } from "vue";

const {
  workerFn: fib_workerFn,
  workerStatus: fib_workerStatus,
  workerTerminate: fib_workerTerminate,
} = useWebWorkerFn(fibonacci);

const {
  workerFn: heavy_workerFn,
  workerStatus: heavy_workerStatus,
  workerTerminate: heavy_workerTerminate,
} = useWebWorkerFn(heavyTask);

/** 目前執行序 */
const runner = ref<string>("");
/** 排序結果 */
const sortValue = ref<number[] | null>(null);
/** 費氏數列結果 */
const fibonnaciValue = ref<number | null>();
/** inputValue */
let term = ref<number | null>();
/** 目前 worker 執行狀態 */
const fib_running = computed(() => fib_workerStatus.value === "RUNNING");
const heavy_running = computed(() => heavy_workerStatus.value === "RUNNING");

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
async function baseFunc() {
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
async function workerFunc() {
  sortValue.value = null;
  fibonnaciValue.value = null;
  sortValue.value = await heavy_workerFn();
  if (term.value) {
    fibonnaciValue.value = await fib_workerFn(term.value);
  }
}

/** 
 * @func 終止/移除執行序
 * 如果呼叫這個方法就需要重新註冊才可以用 web worker
 */
function workerTerminate() {
  fib_workerTerminate("PENDING");
  heavy_workerTerminate("PENDING");
}
</script>
