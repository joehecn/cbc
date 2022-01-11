import { createRouter, createWebHashHistory } from 'vue-router';

const Home = () => import('../views/Home.vue');
const OtaConfig = () => import('../views/OtaConfig.vue');
const OtaTransfer = () => import('../views/OtaTransfer.vue');
const Github = () => import('../views/Github.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/ota_config',
    name: 'otaConfig',
    component: OtaConfig
  },
  {
    path: '/ota_transfer',
    name: 'otaTransfer',
    component: OtaTransfer
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
