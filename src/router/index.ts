import { createWebHistory, createRouter, type RouterOptions, type Router, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'worker',
    component: () => import('@/views/WorkerView.vue'),
  },
  {
    path: '/worker2',
    name: 'useWebWorker',
    component: () => import('@/views/UseWebWorkerView.vue'),
  },
  {
    path: '/worker3',
    name: 'useWebWorkerFn',
    component: () => import('@/views/UseWebWorkerFnView.vue'),
  },
]

const optons: RouterOptions = {
  history: createWebHistory(),
  routes,
}

const router: Router = createRouter(optons)

export default router;