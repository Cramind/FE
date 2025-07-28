import { createRouter, createWebHistory } from "vue-router";

import StudyRoomPage from "@/domains/studyroom/pages/StudyRoomPage.vue";
import InvitationAcceptPage from "@/domains/invitation/pages/InvitationAcceptPage.vue";
import LoginPage from "@/domains/auth/pages/LoginPage.vue";
import SignUpPage from "@/domains/auth/pages/SignUpPage.vue";
import ProjectDashBoardPage from "@/domains/project/pages/ProjectDashBoardPage.vue";

const routes = [
  {
    path: "/",
    component: LoginPage,
    name: "LoginPage",
  },
  {
    path: "/studyroom/:studyroomId",
    component: StudyRoomPage,
    name: "StudyRoomPage",
  },
  {
    path: "/invite/:inviteCode",
    component: InvitationAcceptPage,
    name: "InvitationAcceptPage",
  },
  {
    path: "/signup",
    component: SignUpPage,
    name: "SignUpPage",
  },
  {
    path: "/project/main",
    component: ProjectDashBoardPage,
    name: "ProjectDashBoardPage",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
