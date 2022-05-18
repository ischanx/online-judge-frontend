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
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register/index.vue'),
  },
  {
    path: '/forgetpassword',
    name: 'ForgetPassword',
    component: () => import('@/views/ForgetPassword/index.vue'),
  },
  {
    path: '/profile',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'PersonPage',
        component: () => import('@/views/PersonPage/index.vue'),
      },
    ],
  },
  {
    path: '/user-rank',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'UserRank',
        component: () => import('@/views/Rank/index.vue'),
      },
    ],
  },
  {
    path: '/submission',
    component: () => import('@/views/Layout/BaseLayout.vue'),
    children: [
      {
        path: ':id',
        name: 'Submission',
        component: () => import('@/views/SubmissionDetail/index.vue'),
      },
    ],
  },
  {
    path: '/problem/:problemId(\\d+)',
    name: 'Problem',
    component: () => import('@/views/Problem/index.vue'),
  },
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
  {
    path: '/admin/',
    component: () => import('@/views/Layout/AdminLayout.vue'),
    children: [
      {
        path: 'user',
        name: 'AdminUser',
        component: () => import('@/views/Admin/User/index.vue'),
      },
      {
        path: 'problem-list',
        name: 'AdminProblem',
        component: () => import('@/views/Admin/Problem/index.vue'),
      },
      {
        path: 'problem-detail/:action(show|add|edit)/:problemId(\\d+)?',
        name: 'AdminProblemDetail',
        component: () => import('@/views/Admin/Problem/Detail/index.vue'),
      },
      {
        path: 'contest',
        name: 'AdminContest',
        component: () => import('@/views/Admin/Contest/index.vue'),
      },
      {
        path: 'contest-detail/:action(show|add|edit)/:contestId(\\d+)?',
        name: 'AdminContestDetail',
        component: () => import('@/views/Admin/Contest/Detail/index.vue'),
      },
      {
        path: 'statistics',
        name: 'AdminStatistics',
        component: () => import('@/views/Admin/Statistics/index.vue'),
      },
      {
        path: 'judge',
        name: 'AdminJudge',
        component: () => import('@/views/Admin/Judge/index.vue'),
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
