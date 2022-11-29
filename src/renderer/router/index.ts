import { createRouter, createWebHashHistory } from 'vue-router';

const Home = () => import('../views/Home.vue');
const ZionOtaConfig = () => import('../views/ZionOtaConfig.vue');
const ZionOtaTransfer = () => import('../views/ZionOtaTransfer.vue');
const TereoOtaConfig = () => import('../views/TereoOtaConfig.vue');
const TereoOta = () => import('../views/TereoOta.vue');
const Github = () => import('../views/Github.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/zion_ota_config',
    name: 'zionOtaConfig',
    component: ZionOtaConfig
  },
  {
    path: '/zion_ota_transfer',
    name: 'zionOtaTransfer',
    component: ZionOtaTransfer
  },
  {
    path: '/tereo_ota_config',
    name: 'tereoOtaConfig',
    component: TereoOtaConfig
  },
  {
    path: '/tereo_ota',
    name: 'tereoOta',
    component: TereoOta
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
