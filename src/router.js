import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/buy',
      name: 'buy',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "buy" */ './views/Buy.vue')
    },
    {
      path: '/common',
      name: 'common',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "common" */ './views/Common.vue')
    },
    {
      path: '/manager',
      name: 'manager',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "manager" */ './views/Manager.vue')
    },
    {
      path: '/location',
      name: 'location',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "location" */ './views/Location.vue')
    },
    {
      path: '/addlocation',
      name: 'addlocation',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "addlocation" */ './views/AddLocation.vue')
    },
    {
      path: '/confirmorder',
      name: 'confirmorder',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "confirmorder" */ './views/ConfirmOrder.vue')
    },
    {
      path: '/takeself',
      name: 'takeself',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "takeself" */ './views/TakeSelf.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/express',
      name: 'express',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "takeself" */ './views/Express.vue')
    },
    {
      path: '/allorder',
      name: 'allorder',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "allOrder" */ './views/AllOrder.vue'),
      children: [
        {
          path: 'waitpay',
          name: 'waitpay',
          component: () => import(/* webpackChunkName: "waitPay" */ './components/WaitPay.vue')
        },
        {
          path: 'waitdelivery',
          name: 'waitdelivery',
          component: () => import(/* webpackChunkName: "waitdelivery" */ './components/WaitDelivery.vue')
        },
        {
          path: 'waitreceive',
          name: 'waitreceive',
          component: () => import(/* webpackChunkName: "waitreceive" */ './components/WaitReceive.vue')
        },
        {
          path: 'completed',
          name: 'completed',
          component: () => import(/* webpackChunkName: "completed" */ './components/Completed.vue')
        }
      ]
    }
  ]
})
