<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
  >
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                DevCollab
              </h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg
                v-if="!isDarkMode"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <img
                class="h-8 w-8 rounded-full"
                :src="user.avatar"
                :alt="user.name"
              />
              <span
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{ user.name }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <CommonSidebar :activeTab="activeTab" @tab-change="activeTab = $event" />

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Dashboard -->
          <DashBoard
            v-if="activeTab === 'dashboard'"
            :teams="teams"
            :repositories="repositories"
          />

          <!-- GitHub Integration -->
          <GitHubIntegration
            v-if="activeTab === 'github'"
            :githubConnected="githubConnected"
            :organizations="organizations"
            @connect-github="connectGitHub"
            @select-org="selectOrganization"
          />

          <!-- Repository Management -->
          <RepositoryManagement
            v-if="activeTab === 'repositories'"
            :repositories="repositories"
            :selectedOrg="selectedOrg"
            @create-repo="createRepository"
            @delete-repo="deleteRepository"
          />

          <!-- Issue Templates -->
          <IssueTemplates
            v-if="activeTab === 'templates'"
            :templates="issueTemplates"
            :repositories="repositories"
            @create-template="createIssueTemplate"
            @update-template="updateIssueTemplate"
            @delete-template="deleteIssueTemplate"
            @deploy-template="deployTemplate"
          />

          <!-- Team Management -->
          <TeamManagement
            v-if="activeTab === 'team'"
            :teams="teams"
            :selectedOrg="selectedOrg"
            @create-team="createTeam"
            @invite-member="inviteMember"
            @remove-member="removeMember"
          />
        </div>
      </main>
    </div>

    <!-- Notifications -->
    <div v-if="notification" class="fixed bottom-4 right-4 z-50">
      <div class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ notification }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

import CommonSidebar from "../components/CommonSidebar.vue";
import DashBoard from "../components/DashBoard.vue";
import RepositoryManagement from "../components/RepoManagement.vue";
import IssueTemplates from "../components/IssueTemplate.vue";
import TeamManagement from "../components/TeamManagement.vue";

// State
const activeTab = ref("dashboard");
const isDarkMode = ref(false);
const githubConnected = ref(false);
const notification = ref("");

const user = reactive({
  name: "John Doe",
  avatar: "/placeholder.svg?height=32&width=32",
});

const selectedOrg = ref(null);
const organizations = ref([]);
const teams = ref([]);
const repositories = ref([]);
const issueTemplates = ref([]);

// Methods
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle("dark", isDarkMode.value);
};

const connectGitHub = async () => {
  // GitHub OAuth 연동 로직
  try {
    // 실제로는 GitHub OAuth API를 호출
    githubConnected.value = true;
    organizations.value = [
      {
        id: 1,
        login: "my-company",
        name: "My Company",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        login: "open-source-org",
        name: "Open Source Org",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    ];
    showNotification("GitHub 연동이 완료되었습니다!");
  } catch (error) {
    showNotification("GitHub 연동에 실패했습니다.");
  }
};

const selectOrganization = (org) => {
  selectedOrg.value = org;
  loadRepositories(org.login);
  showNotification(`${org.name} 조직이 선택되었습니다.`);
};

const loadRepositories = async (orgLogin) => {
  // GitHub API를 통해 조직의 레포지토리 목록 가져오기
  repositories.value = [
    {
      id: 1,
      name: "frontend-app",
      description: "Main frontend application",
      language: "Vue.js",
      stars: 45,
      private: false,
    },
    {
      id: 2,
      name: "backend-api",
      description: "REST API backend",
      language: "Node.js",
      stars: 23,
      private: true,
    },
    {
      id: 3,
      name: "mobile-app",
      description: "Mobile application",
      language: "React Native",
      stars: 12,
      private: false,
    },
  ];
};

const createRepository = async (repoData) => {
  try {
    // GitHub API를 통해 레포지토리 생성
    const newRepo = {
      id: Date.now(),
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      stars: 0,
      private: repoData.private,
    };
    repositories.value.push(newRepo);
    showNotification(`레포지토리 '${repoData.name}'이 생성되었습니다!`);
  } catch (error) {
    showNotification("레포지토리 생성에 실패했습니다.");
  }
};

const deleteRepository = async (repoId) => {
  try {
    repositories.value = repositories.value.filter(
      (repo) => repo.id !== repoId
    );
    showNotification("레포지토리가 삭제되었습니다.");
  } catch (error) {
    showNotification("레포지토리 삭제에 실패했습니다.");
  }
};

const createIssueTemplate = (template) => {
  const newTemplate = {
    id: Date.now(),
    ...template,
  };
  issueTemplates.value.push(newTemplate);
  showNotification(`이슈 템플릿 '${template.name}'이 생성되었습니다!`);
};

const updateIssueTemplate = (templateId, updatedTemplate) => {
  const index = issueTemplates.value.findIndex((t) => t.id === templateId);
  if (index !== -1) {
    issueTemplates.value[index] = {
      ...issueTemplates.value[index],
      ...updatedTemplate,
    };
    showNotification("이슈 템플릿이 업데이트되었습니다!");
  }
};

const deleteIssueTemplate = (templateId) => {
  issueTemplates.value = issueTemplates.value.filter(
    (t) => t.id !== templateId
  );
  showNotification("이슈 템플릿이 삭제되었습니다.");
};

const deployTemplate = async (templateId, repositoryId) => {
  try {
    // GitHub API를 통해 이슈 템플릿을 레포지토리에 배포
    showNotification("이슈 템플릿이 레포지토리에 배포되었습니다!");
  } catch (error) {
    showNotification("이슈 템플릿 배포에 실패했습니다.");
  }
};

const createTeam = (teamData) => {
  const newTeam = {
    id: Date.now(),
    ...teamData,
    members: [],
  };
  teams.value.push(newTeam);
  showNotification(`팀 '${teamData.name}'이 생성되었습니다!`);
};

const inviteMember = (teamId, memberEmail) => {
  const team = teams.value.find((t) => t.id === teamId);
  if (team) {
    team.members.push({
      id: Date.now(),
      email: memberEmail,
      status: "pending",
      avatar: "/placeholder.svg?height=32&width=32",
    });
    showNotification(`${memberEmail}에게 초대장을 보냈습니다.`);
  }
};

const removeMember = (teamId, memberId) => {
  const team = teams.value.find((t) => t.id === teamId);
  if (team) {
    team.members = team.members.filter((m) => m.id !== memberId);
    showNotification("팀 멤버가 제거되었습니다.");
  }
};

const showNotification = (message) => {
  notification.value = message;
  setTimeout(() => {
    notification.value = "";
  }, 3000);
};

// Initialize
onMounted(() => {
  // 초기 데이터 로드
  issueTemplates.value = [
    {
      id: 1,
      name: "Bug Report",
      description: "Template for reporting bugs",
      content: `---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.`,
    },
  ];
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
