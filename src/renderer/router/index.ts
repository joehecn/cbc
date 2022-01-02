import { createRouter, createWebHashHistory } from 'vue-router';

const Home = () => import('../views/Home.vue');
const Github = () => import('../views/Github.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/github',
    name: 'github',
    component: Github
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
