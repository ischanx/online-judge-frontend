import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/views/Home/index.vue') },
  { path: '/login', component: () => import('@/views/Login/Login.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/404/index.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
