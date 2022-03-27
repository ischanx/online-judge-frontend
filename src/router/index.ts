import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/views/Home/index.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/Login/Login.vue') },
  { path: '/problem/:problemId(\\d+)', name: 'Problem', component: () => import('@/views/Problem/index.vue') },
  { path: '/problem/', name: 'ProblemList', component: () => import('@/views/ProblemList/index.vue') },
  {
    path: '/contest/:contestId(\\d+)/:problemNumber(\\d+)',
    name: 'ContestProblem',
    component: () => import('@/views/Problem/index.vue'),
  },
  { path: '/contest/:contestId(\\d+)', name: 'Contest', component: () => import('@/views/Contest/index.vue') },
  { path: '/contest/', name: 'ContestList', component: () => import('@/views/ContestList/index.vue') },
  { path: '/status/', name: 'Status', component: () => import('@/views/Status/index.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/404/index.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
