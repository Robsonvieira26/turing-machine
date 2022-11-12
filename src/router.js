import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";

const routes = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("./pages/Turing.vue"),
      },
      {
        path: "/sobre",
        name: "sobre",
        component: () => import("./pages/Sobre.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
