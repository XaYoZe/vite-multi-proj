import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@layouts/404.vue')
    }
  ]
});

export default router;
