<template>
  <nav>
    <RouterLink to="/">Web Worker</RouterLink>|
    <RouterLink to="/worker2">useWebWorker</RouterLink>|
    <RouterLink to="/worker3">useWebWorkerFn</RouterLink>
  </nav>
  <main>
    <h2 class="title">現在時間 (Current Time): {{ computedTime }}</h2>
    <RouterView />
  </main>
</template>

<script setup>
import { useDateFormat, useTimestamp } from '@vueuse/core'

const time = useTimestamp()
const computedTime = useDateFormat(time, 'YYYY-MM-DD HH:mm:ss SSS')


</script>