import { createRouter, createWebHistory } from "vue-router";

import StudyRoomPage from "@/domains/studyroom/pages/StudyRoomPage.vue";

const routes = [
  {
    path: "/",
    component: StudyRoomPage,
    name: "StudyRoomPage",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
