<template>
  <div
    :class="isDark ? 'dark' : ''"
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors"
  >
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <!-- Logo -->
      <div
        class="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div
          class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>
        </div>
        <span class="ml-3 text-xl font-semibold text-gray-900 dark:text-white"
          >ProjectHub</span
        >
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <button
            @click="activeSection = 'dashboard'"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              activeSection === 'dashboard'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            대시보드
          </button>
          <button
            @click="activeSection = 'docs'"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              activeSection === 'docs'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            문서
          </button>
          <button
            @click="activeSection = 'kanban'"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              activeSection === 'kanban'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            칸반
          </button>
        </div>
      </nav>

      <!-- Theme Toggle -->
      <div class="absolute bottom-6 left-6 right-6">
        <button
          @click="toggleTheme"
          class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg
            v-if="isDark"
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          {{ isDark ? "라이트 모드" : "다크 모드" }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Header -->
      <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ activeTitle }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ activeDesc }}
            </p>
          </div>

          <!-- Team Selector (Dashboard only) -->
          <div
            v-if="activeSection === 'dashboard'"
            class="flex items-center space-x-4"
          >
            <select
              v-model="selectedTeam"
              class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main v-if="activeSection === 'dashboard'" class="p-6">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ stat.label }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 dark:text-white mt-1"
                >
                  {{ stat.value }}
                </p>
              </div>
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  stat.bgColor,
                ]"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  v-html="stat.icon"
                ></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- GitHub Issues -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  GitHub 이슈
                </h3>
                <button
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  전체 보기
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-if="issues.length === 0"
                  class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-center"
                >
                  <p
                    class="text-base font-medium text-gray-600 dark:text-gray-300"
                  >
                    아직 등록된 이슈가 없어요 🎉
                  </p>
                  <p class="text-sm text-gray-400 mt-1">
                    새로운 이슈가 등록되면 여기에서 확인할 수 있습니다.
                  </p>
                </div>
                <div
                  v-for="issue in issues"
                  :key="issue.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    :class="[
                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                      issue.state === 'close' ? 'bg-red-500' : 'bg-green-500',
                    ]"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                      {{ issue.title }}
                    </p>
                    <div class="flex items-center mt-1 space-x-2">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          issue.state === 'open'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                        ]"
                      >
                        {{ issue.state }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        #{{ issue.number }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pull Requests -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  요청받은 PR
                </h3>
                <button
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  전체 보기
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-if="pullRequests.length === 0"
                  class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-center"
                >
                  <p
                    class="text-base font-medium text-gray-600 dark:text-gray-300"
                  >
                    아직 리뷰 요청된 PR이 없어요 🎉
                  </p>
                  <p class="text-sm text-gray-400 mt-1">
                    새로운 PR이 등록되면 여기에서 확인할 수 있습니다.
                  </p>
                </div>
                <div
                  v-for="pr in pullRequests"
                  :key="pr.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    :class="[
                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                      pr.status === 'approved'
                        ? 'bg-green-500'
                        : pr.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                      {{ pr.title }}
                    </p>
                    <div class="flex items-center mt-1 space-x-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ pr.author }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        +{{ pr.additions }} -{{ pr.deletions }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Repository Events -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <!-- 헤더 -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  레포지토리 이벤트
                </h3>
                <button
                  @click="refreshEvents"
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  새로고침
                </button>
              </div>
            </div>

            <!-- 이벤트 리스트 -->
            <div class="p-6">
              <ul class="space-y-4">
                <li
                  v-for="event in events"
                  :key="event.id"
                  class="flex items-start space-x-3"
                >
                  <!-- 이벤트 타입칩 -->
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold',
                      event.type === 'PullRequestEvent'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : event.type === 'IssuesEvent'
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                        : event.type === 'PullRequestReviewEvent'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                    ]"
                  >
                    {{
                      event.type === "PullRequestEvent"
                        ? "PR"
                        : event.type === "IssuesEvent"
                        ? "ISSUE"
                        : event.type === "PullRequestReviewEvent"
                        ? "REVIEW"
                        : "COMMENT"
                    }}
                  </div>

                  <!-- 이벤트 본문 -->
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <img
                        :src="event.actor.avatar_url"
                        class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                      />
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ event.actor.login }}
                      </span>
                      <span
                        :class="[
                          'text-sm',
                          event.payload.action === 'opened'
                            ? 'dark:text-green-400'
                            : event.payload.action === 'closed'
                            ? 'text-yellow-600'
                            : 'text-gray-600 dark:text-gray-300',
                        ]"
                      >
                        {{ event.payload.action }}
                      </span>
                    </div>

                    <!-- 제목 + 저장소 -->
                    <p class="text-sm text-gray-900 dark:text-white mt-1">
                      <span class="font-medium">
                        {{
                          event.type === "PullRequestEvent"
                            ? event.payload.pull_request.title
                            : event.type === "IssuesEvent"
                            ? event.payload.issue.title
                            : event.type === "PullRequestReviewEvent"
                            ? "리뷰를 남겼습니다"
                            : event.payload.comment.body
                        }}
                      </span>
                      <span class="text-gray-500"> in </span>
                      <span class="font-semibold">{{ event.repo.name }}</span>
                    </p>

                    <!-- 날짜 -->
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {{
                        new Date(event.created_at).toLocaleString("ko-KR", {
                          timeZone: "Asia/Seoul",
                        })
                      }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                성과 지표
              </h3>
            </div>

            <div class="p-6">
              <ul class="space-y-5">
                <li
                  v-for="metric in commitShare"
                  :key="metric.label"
                  class="grid gap-y-2 md:grid-cols-[1fr,110px,70px] md:items-center md:gap-x-4"
                >
                  <!-- 1행: 라벨 / 카운트 / 퍼센트 -->
                  <div class="truncate">
                    <span
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{ metric.label }}
                    </span>
                  </div>
                  <div
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 text-right"
                  >
                    {{ metric.myCount }} / {{ metric.totalCount }}
                  </div>
                  <div
                    class="text-sm font-bold text-gray-900 dark:text-white text-right"
                  >
                    {{ Math.round(metric.sharePercent) }}%
                  </div>

                  <!-- 2행: 프로그레스바 (3열 전체 너비 차지) -->
                  <div class="col-span-full">
                    <div
                      class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                    >
                      <div
                        class="h-2 rounded-full transition-all duration-300 bg-emerald-500 dark:bg-emerald-400"
                        :style="{
                          width:
                            Math.max(0, Math.min(100, metric.sharePercent)) +
                            '%',
                        }"
                      ></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <!-- Documentation Content -->
      <main v-if="activeSection === 'docs'" class="p-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div class="p-8 text-center">
            <svg
              class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              문서 섹션
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              프로젝트 문서와 가이드가 여기에 표시됩니다.
            </p>
          </div>
        </div>
      </main>
      <main v-if="activeSection === 'kanban'">
        <KanvanBoard />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { api } from "@/axios";
import KanvanBoard from "../components/KanbanBoard.vue";

// Theme management
const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const TITLES = {
  dashboard: "팀 대시보드",
  docs: "문서",
  kanban: "칸반 보드",
};

const DESCS = {
  dashboard: "팀의 프로젝트 현황을 한눈에 확인하세요",
  docs: "프로젝트 문서와 가이드를 관리하세요",
  kanban: "작업을 칸반 보드에서 시각화하고 우선순위를 관리하세요",
};

// Navigation
const activeSection = ref("");
const activeTitle = computed(
  () => TITLES[activeSection.value] ?? TITLES["dashboard"]
);
const activeDesc = computed(
  () => DESCS[activeSection.value] ?? DESCS["dashboard"]
);

// Team management
const selectedTeam = ref("frontend");
const teams = reactive([
  { id: "frontend", name: "Frontend Team" },
  { id: "backend", name: "Backend Team" },
  { id: "devops", name: "DevOps Team" },
  { id: "design", name: "Design Team" },
]);

// Dashboard data
const stats = computed(() => [
  { label: "Issues", value: issuesCount.value },
  { label: "Pull Requests", value: prsCount.value },
  { label: "Events", value: eventsCount.value },
]);

const issues = ref([]);
const issuesCount = ref(0);

const pullRequests = ref([]);
const prsCount = ref(0);

const events = ref([]);
const eventsCount = ref(0);

const commitShare = ref([]);

onMounted(async () => {
  const issueRes = await api.$get("/api/todo/issues/24");
  const prRes = await api.$get("/api/todo/prs/my/24");
  const eventRes = await api.$get("/api/todo/event/24");
  const statusRes = await api.$get("/api/todo/stat/24");

  issuesCount.value = issueRes.result.count;
  issues.value = issueRes.result.items;

  prsCount.value = prRes.result.count;
  pullRequests.value = prRes.result.items;

  eventsCount.value = eventRes.result.count;
  events.value = eventRes.result.items;

  commitShare.value = statusRes.result.items;
});

const refreshEvents = () => {
  console.log("이벤트 새로고침");
};

const getEventIcon = (type) => {
  const icons = {
    commit: '<path d="M9 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M9 12h12"/>',
    merge: '<path d="M8 17l4 4 4-4m-4-5v9"/>',
    release:
      '<path d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h3a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8H4a1 1 0 01-1-1V5a1 1 0 011-1h3z"/>',
  };
  return icons[type] || icons.commit;
};
</script>
