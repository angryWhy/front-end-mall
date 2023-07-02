import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: "/about",
  },
  {
    path: '/about',
    name: 'about',

    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/category',
    name: 'categoryView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/category/category.vue')
  },
  {
    path: '/brand',
    name: 'brandView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/brand/brand.vue')
  },
  {
    path: '/attr',
    name: 'attrView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/attr/attr.vue')
  },
  {
    path: '/login',
    name: 'login-admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/login-admin.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
