import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
// import {
//   removeObserver
// } from '../utils/functions'
import store from '../store/store'

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/compiler",
    name: "compiler",
    component: () =>
      import( /* webpackChunkName: "compiler" */ "../views/PythonCompilerView.vue"),
    meta: {
      authRequired: true, // change it to true later on
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import( /* webpackChunkName: "login" */ "../user/login-component.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import( /* webpackChunkName: "signup" */ "../user/register-component.vue"),
  }, {
    path: "/logout",
    name: "logout",
    component: () =>
      import( /* webpackChunkName: "logout" */ "../user/logout-component.vue"),
    meta: {
      authRequired: true, // change it to true later on
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});



router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    const data = store.state.currentUser
    if (data) {
      next();
    } else {
      alert('You must be logged in to see this page');
      next({
        path: '/',
      });
    }
  } else {
    next();
  }
});

export default router;