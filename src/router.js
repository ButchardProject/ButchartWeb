import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

Vue.use(Router)

const router = new Router({
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
      component: () => import(/* webpackChunkName: "buy" */ './views/Buy.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'common') {
          next()
        } else {
          next('/')
        }
      }
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
      component: () => import(/* webpackChunkName: "manager" */ './views/Manager.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/location',
      name: 'location',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "location" */ './views/Location.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'express' || from.name === 'addlocation') {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/addlocation',
      name: 'addlocation',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "addlocation" */ './views/AddLocation.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'location') {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/mycart',
      name: 'mycart',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "mycart" */ './views/MyCart.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/confirmorder',
      name: 'confirmorder',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "confirmorder" */ './views/ConfirmOrder.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'buy' || from.name === 'express' || from.name === 'takeself') {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/pay',
      name: 'pay',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "confirmorder" */ './views/Pay.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'confirmorder') {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/takeself',
      name: 'takeself',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "takeself" */ './views/TakeSelf.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'confirmorder') {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/express',
      name: 'express',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "takeself" */ './views/Express.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'confirmorder' || from.name === 'location') {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/allorder',
      name: 'allorder',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "allOrder" */ './views/AllOrder.vue'),
      meta: {
        requireAuth: true
      },
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
    },
    {
      path: '/comment',
      name: 'comment',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "comment" */ './views/Comment.vue'),
      meta: {
        requireAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (from.name === 'allorder') {
          next()
        } else {
          next('/allorder?selected=5')
        }
      }

    }
  ]
})

export default router

// to:即将前往的页面,from:从哪个页面来,next:下一步操作
router.beforeEach((to, from, next) => {
  // console.log(from)
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('userInfo')) {
      //  通过封装好的cookies读取token，如果存在，name接下一步如果不存在，那跳转回登录页
      next() // 不要在next里面加"path:/",会陷入死循环
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})
