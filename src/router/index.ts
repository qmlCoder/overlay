import { createRouter, createWebHashHistory } from "vue-router";
import HelpPage from "../pages/HelpPage.vue";
import HomePage from "../pages/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/help",
    name: "HelpPage",
    component: HelpPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
