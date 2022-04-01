import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
      },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('@/views/Login/Login.vue') },
  { path: '/problem/:problemId(\\d+)', name: 'Problem', component: () => import('@/views/Problem/index.vue') },
  {
    path: '/contest/:contestId(\\d+)/:problemNumber(\\d+)',
    name: 'ContestProblem',
    component: () => import('@/views/Problem/index.vue'),
  },
  {
    path: '/problem/',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'ProblemList',
        component: () => import('@/views/ProblemList/index.vue'),
      },
    ],
  },
  {
    path: '/contest/',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'ContestList',
        component: () => import('@/views/ContestList/index.vue'),
      },
      { path: ':contestId(\\d+)', name: 'Contest', component: () => import('@/views/Contest/index.vue') },
    ],
  },
  {
    path: '/status/',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Status',
        component: () => import('@/views/Status/index.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/404/index.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
