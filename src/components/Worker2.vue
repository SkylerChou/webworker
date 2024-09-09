<!-- https://vueuse.org/core/useWebWorker/ -->
<template>
  <label for="fib">費氏數列: </label>
  <input id="fib" type="number" v-model="term" min="1" />

  <div class="btn__wrap">
    <button class="btn btn-main" @click="baseFn">Main Thread</button>
    <button class="btn btn-worker" @click="workerFn">Worker</button>
  </div>

  <h2>執行續 (Thread): {{ runner }}</h2>
  <h2>排序結果 (Result): {{ sortValue }}</h2>
  <h2>費氏數列 (Result): {{ fibonnaciValue }}</h2>
</template>
<script setup lang="ts">
import { useWebWorker } from "@vueuse/core";
import { ref, watch, nextTick } from "vue";

/** 輸入worker路徑時，注意要用絕對路徑 */
const {
  data: fib_data,
  post: fib_post,
  worker: fib_worker,
} = useWebWorker("/src/worker_fibonacci.ts");
const {
  data: heavy_data,
  post: heavy_post,
  worker: heavy_worker,
} = useWebWorker("src/worker_heavyTask.ts");

/** 目前執行序 */
const runner = ref<string>("");
/** 排序結果 */
const sortValue = ref<number[] | null>(null);
/** 費氏數列結果 */
const fibonnaciValue = ref<number | null>();
/** inputValue */
let term = ref<number | null>();

// WORKER onmessage - 要 watch 回傳結果
watch(fib_data, (value) => {
  fibonnaciValue.value = value;
});
watch(heavy_data, (value) => {
  sortValue.value = value;
});

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
  await nextTick();
  sortValue.value = heavyTask();
  if (term.value) {
    fibonnaciValue.value = fibonacci(term.value);
  }
  runner.value = "Main";
}

// WORKER onmessage - 方法一
// fib_worker.value!.onmessage = (event) => {
//   fibonnaciValue.value = event.data;
// };
heavy_worker.value!.onmessage = (event) => {
  sortValue.value = event.data;
};

async function workerFn() {
  fibonnaciValue.value = null;
  sortValue.value = null;
  await nextTick();
  if (term.value) {
    // WORKER postMessage - 方法一
    // fib_worker.value!.postMessage(term.value);
    // useUse - useWebWorker 包好的方法 - 方法二
    fib_post(term.value);
  }
  // WORKER postMessage - 方法一
  heavy_worker.value!.postMessage("start");
  // useUse - useWebWorker 包好的方法 - 方法二
  // heavy_post("start");
  runner.value = "Worker";
}
</script>
