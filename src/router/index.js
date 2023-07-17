import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: "/category",
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
    path: '/attrgroup',
    name: 'attrGroupView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/attr/attr.vue')
  },
  {
    path: '/attr',
    name: 'attrView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/baseAttr/attr.vue')
  },
  {
    path: '/saleattr',
    name: 'saleAttrView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/saleAttr/saleAttr.vue')
  },
  {
    path: '/login',
    name: 'loginView',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/loginView.vue')
  },
  {
    path: '/release',
    name: 'releaseView',
    component: () => import(/* webpackChunkName: "about" */ '../views/product/release/release.vue')
  },
  {
    path: '/viplevel',
    name: 'vipLevelView',
    component: () => import(/* webpackChunkName: "about" */ '../views/vip/vipLevel/vipLevel.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
