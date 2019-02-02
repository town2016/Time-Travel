import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
const Home = resolve => { require(['views/home'], resolve) }
const Edit = resolve => { require(['views/edit'], resolve) }
const My = resolve => { require(['views/my'], resolve) }
const Signin = resolve => { require(['views/signin'], resolve) }
const Signup = resolve => { require(['views/signup'], resolve) }
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    }, {
      name: 'edit',
      path: '/edit',
      component: Edit
    }, {
      name: 'my',
      path: '/my',
      component: My
    }, {
      name: 'signin',
      path: '/signin',
      component: Signin
    }, {
      name: 'signup',
      path: '/signup',
      component: Signup
    }
  ]
})
export default router

router.beforeEach((to, from, next) => {
  if (!Cookies.get('user') && (to.name !== 'signin' && to.name !== 'signup')) {
    next({
      name: 'signin'
    })
  } else {
    next()
  }
})
