import Vue from 'vue'
import Router from 'vue-router'
import Login from "../views/Login";

Vue.use(Router)


const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/",
    component: () => import("../layout"),
    redirect: "/home",
    // 子路由
    children: [
      {
        name: "Home",
        path: "/home",
        component: () => import("../views/Home")
      },
      {
        name: "Category",
        path: "/category",
        component: () => import("../views/Category")
      },
      {
        name: "User",
        path: "/user",
        component: () => import("../views/User")
      },
      {
        name: "Product",
        path: "/product",
        component: () => import("../views/Product")
      },
    ]
  }
]

const router = new Router({
  routes
})

export default router
