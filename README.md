# Web Worker

![Event model for web workers](image.png)

由於 Javascript 和 UI 事件在單一執行緒中運行，因此如果 js 方法過於肥大執行時間較長，UI 將無法更新並卡頓。

## 本範例的 web worker Event model for web workers

### worker_fibonacci
```sequence
Note left of Main Thread: Listening for message event
Note left of Main Thread: Processing message 
Main Thread->worker_fibonacci: Send message to worker
Note right of Main Thread: message event
Note right of worker_fibonacci: Processing message
Note right of worker_fibonacci: message event
worker_fibonacci->Main Thread: Send message to worker
Note right of Main Thread: Listening for message event
```

### worker_heavyTask
```sequence
Note left of Main Thread: Listening for message event
Note left of Main Thread: Processing message 
Main Thread->worker_heavyTask: Send message to worker
Note right of Main Thread: message event
Note right of worker_heavyTask: Processing message
Note right of worker_heavyTask: message event
worker_heavyTask->Main Thread: Send message to worker
Note right of Main Thread: Listening for message event
```

## worker1 - Web Workers API

使用 web API 來實作

[MDN-Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

## worker2 - VueUse - useWebWorker

用起來跟用 web API 很像，只是多封裝成方法

[VueUse - useWebWorker](https://vueuse.org/core/useWebWorker/)

## worker3 - VueUse - useWebWorkerFn

封裝成更好用的方法，也是三種裡最簡化的寫法，也有狀態可以使用，
worker terminate 之後也不會有 worker1、worker2 的問題 (無法再次使用)

[VueUse - useWebWorkerFn](https://vueuse.org/core/useWebWorkerFn/)

## 補充 
這邊使用 postMessage、onmessage 來傳遞資料
也許之後可以用 [comlink](https://github.com/GoogleChromeLabs/comlink) 寫寫看，看[鐵人賽](https://ithelp.ithome.com.tw/articles/10337926) 感覺可以更方便，只是看起來只能搭配 Web Workers API

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---
## 參考資料 reference
[An Introduction to Web Workers](https://medium.com/@siobhanpmahoney/a-brief-introduction-to-web-workers-e5d6e39d9d28)

[封裝 Web worker 的套件 - Comlink](https://ithelp.ithome.com.tw/articles/10337926)