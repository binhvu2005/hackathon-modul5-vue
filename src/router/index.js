import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import ManagerUser from '../components/ManagerUser.vue';
import ManagerProduct from '../components/ManagerProduct.vue';

const routes = [
  { path: '/admin/dashboard', component: Dashboard },
  { path: '/admin/manager-user', component: ManagerUser },
  { path: '/admin/manager-product', component: ManagerProduct },
  { path: '/:pathMatch(.*)*', redirect: '/admin/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
