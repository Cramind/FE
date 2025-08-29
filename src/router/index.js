import { createRouter, createWebHistory } from "vue-router";

import StudyRoomPage from "@/domains/studyroom/pages/StudyRoomPage.vue";
import InvitationAcceptPage from "@/domains/invitation/pages/InvitationAcceptPage.vue";
import LoginPage from "@/domains/auth/pages/LoginPage.vue";
import SignUpPage from "@/domains/auth/pages/SignUpPage.vue";
import ProjectDashBoardPage from "@/domains/project/pages/ProjectDashBoardPage.vue";
import TeamDashBoardPage from "@/domains/team/pages/TeamDashBoardPage.vue";
import TeamCreatePage from "@/domains/team/pages/TeamCreatePage.vue";

const routes = [
  {
    path: "/",
    component: LoginPage,
    name: "LoginPage",
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
  {
    path: "/team/:teamId",
    component: TeamDashBoardPage,
    name: "TeamDashBoardPage",
  },
  {
    path: "/team/create",
    component: TeamCreatePage,
    name: "TeamCreatePage",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
