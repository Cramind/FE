<template>
  <div class="dashboard">
    <!-- 헤더 -->
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <button @click="goBack" class="back-btn">
            <svg viewBox="0 0 24 24" class="back-icon">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>

          <div class="project-info">
            <div class="project-title">
              <div class="project-icon">📊</div>
              <h1>{{ project.owner }}/{{ project.name }}</h1>
              <span class="visibility-tag">{{ project.visibility }}</span>
            </div>
            <p class="project-desc">{{ project.description }}</p>
          </div>
        </div>

        <div class="header-right">
          <div class="connection-status">
            <div class="status-dot"></div>
            <span>GitHub Connected</span>
          </div>

          <div class="team-members">
            <div
              v-for="member in project.members"
              :key="member.id"
              class="member-avatar"
              :title="`${member.name} (@${member.github})`"
            >
              <img
                :src="
                  member.avatar ||
                  `/placeholder.svg?height=32&width=32&text=${member.name.charAt(
                    0
                  )}`
                "
                :alt="member.name"
              />
              <div v-if="member.isOnline" class="online-dot"></div>
            </div>
          </div>

          <button
            @click="syncWithGitHub"
            :disabled="isSyncing"
            class="sync-btn"
            :class="{ syncing: isSyncing }"
          >
            <svg class="sync-icon" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            {{ isSyncing ? "Syncing..." : "Sync" }}
          </button>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main">
      <div class="main-container">
        <!-- 통계 카드 -->
        <!-- <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <h3>Open Issues</h3>
              </div>
              <div class="stat-number">{{ stats.openIssues }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <h3>Open PRs</h3>
              </div>
              <div class="stat-number">{{ stats.openPRs }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <h3>Total Commits</h3>
              </div>
              <div class="stat-number">{{ stats.totalCommits }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <h3>Code Reviews</h3>
              </div>
              <div class="stat-number">{{ stats.codeReviews }}</div>
            </div>
          </div>
        </section> -->

        <!-- 탭 네비게이션 -->
        <nav class="tabs">
          <div class="tab-list">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="tab"
              :class="{ active: activeTab === tab.id }"
            >
              <span class="tab-text">{{ tab.name }}</span>
              <span v-if="tab.count" class="tab-badge">{{ tab.count }}</span>
            </button>
          </div>
        </nav>

        <!-- 탭 컨텐츠 -->
        <section class="content">
          <!-- Issues 탭 -->
          <div v-if="activeTab === 'issues'" class="content-panel">
            <div class="panel-header">
              <div class="panel-title">
                <h2>Issues</h2>
                <span class="count-badge">{{ issues.length }}</span>
              </div>

              <div class="panel-actions">
                <select v-model="issueSortBy" class="sort-select">
                  <option value="created">Recently created</option>
                  <option value="updated">Recently updated</option>
                  <option value="comments">Most commented</option>
                </select>
              </div>
            </div>

            <div v-if="activeTab === 'issues'" class="panel-content">
              <ProjectIssueCard :issues="issues" />
            </div>
          </div>

          <!-- Pull Requests 탭 -->
          <div v-if="activeTab === 'prs'" class="content-panel">
            <div class="panel-header">
              <div class="panel-title">
                <h2>Pull Requests</h2>
                <span class="count-badge">{{ pullRequests.length }}</span>
              </div>

              <div class="panel-actions">
                <div class="filter-group">
                  <button
                    @click="prFilter = 'all'"
                    class="filter-btn"
                    :class="{ active: prFilter === 'all' }"
                  >
                    All
                  </button>
                  <button
                    @click="prFilter = 'open'"
                    class="filter-btn"
                    :class="{ active: prFilter === 'open' }"
                  >
                    Open
                  </button>
                  <button
                    @click="prFilter = 'merged'"
                    class="filter-btn"
                    :class="{ active: prFilter === 'merged' }"
                  >
                    Merged
                  </button>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'prs'" class="panel-content">
              <ProjectPrCard :prs="prs" />
            </div>
          </div>
          <div v-if="activeTab === 'reviews'">
            <ProjectReviewStatusCard
              :totalReviewStatsDto="totalReviewStatsDto"
              :userReviewStatsDtoList="userReviewStatsDtoList"
            />
            <ProjectReviewCard :comments="comments" />
          </div>

          <!-- Code Review 탭 -->
          <div v-if="activeTab === 'reviews'" class="content-panel">
            <div class="panel-header">
              <div class="panel-title">
                <h2>Code Review Dashboard</h2>
              </div>
            </div>
            <div>
              <div class="reviewer-section">
                <h3 class="section-title">Reviewer Activity</h3>
                <div class="reviewer-grid">
                  <div
                    v-for="reviewer in reviewerStats"
                    :key="reviewer.login"
                    class="reviewer-card"
                  >
                    <div class="reviewer-info">
                      <img
                        :src="reviewer.avatar_url"
                        :alt="reviewer.login"
                        class="reviewer-avatar"
                      />
                      <div class="reviewer-details">
                        <div class="reviewer-name">@{{ reviewer.login }}</div>
                        <div class="reviewer-activity">
                          {{ reviewer.reviews_count }} reviews this week
                        </div>
                      </div>
                    </div>
                    <div class="reviewer-metrics">
                      <span class="metric approved">{{
                        reviewer.approved
                      }}</span>
                      <span class="metric commented">{{
                        reviewer.commented
                      }}</span>
                      <span class="metric changes">{{
                        reviewer.changes_requested
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Commits 탭 -->
          <div v-if="activeTab === 'commits'" class="content-panel">
            <div class="panel-header">
              <div class="panel-title">
                <h2>Recent Commits</h2>
              </div>

              <div class="panel-actions">
                <select v-model="commitBranch" class="sort-select">
                  <option
                    v-for="branch in branches"
                    :key="branch"
                    :value="branch"
                  >
                    {{ branch }}
                  </option>
                </select>
              </div>
            </div>

            <div class="panel-content">
              <div class="commit-list">
                <div
                  v-for="commit in commits"
                  :key="commit.sha"
                  class="commit-item"
                >
                  <img
                    :src="commit.author.avatar_url"
                    :alt="commit.author.login"
                    class="commit-avatar"
                  />
                  <div class="commit-details">
                    <div class="commit-message">
                      {{ commit.commit.message.split("\n")[0] }}
                    </div>
                    <div class="commit-info">
                      <span class="commit-author"
                        >@{{ commit.author.login }}</span
                      >
                      <span class="commit-time">{{
                        formatTimeAgo(commit.commit.author.date)
                      }}</span>
                      <span class="commit-hash">{{
                        commit.sha.substring(0, 7)
                      }}</span>
                    </div>
                  </div>
                  <div class="commit-changes">
                    <span class="additions"
                      >+{{ commit.stats?.additions || 0 }}</span
                    >
                    <span class="deletions"
                      >-{{ commit.stats?.deletions || 0 }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 토스트 알림 -->
    <div v-if="showToast" class="toast">
      <div class="toast-icon">✅</div>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "@/axios";
import ProjectIssueCard from "./components/ProjectIssueCard.vue";
import ProjectPrCard from "./components/ProjectPrCard.vue";
import ProjectReviewCard from "./components/ProjectReviewCard.vue";
import ProjectReviewStatusCard from "./components/ProjectReviewStatusCard.vue";

// 상태 관리
const activeTab = ref("issues");
const isSyncing = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// 필터 상태
const issueFilter = ref("all");
const prFilter = ref("all");
const issueSortBy = ref("created");
const commitBranch = ref("main");

// 프로젝트 정보
const project = ref({
  id: 1,
  name: "awesome-project",
  owner: "dev-team",
  description: "🚀 Modern web application with Vue.js and Node.js",
  visibility: "public",
  members: [
    {
      id: 1,
      name: "Kim Cheolsu",
      github: "kimcs_dev",
      avatar: "/placeholder.svg?height=32&width=32&text=K",
      isOnline: true,
    },
    {
      id: 2,
      name: "Lee Younghee",
      github: "leeyh_frontend",
      avatar: "/placeholder.svg?height=32&width=32&text=L",
      isOnline: true,
    },
    {
      id: 3,
      name: "Park Minsu",
      github: "parkms_backend",
      avatar: "/placeholder.svg?height=32&width=32&text=P",
      isOnline: false,
    },
    {
      id: 4,
      name: "Choi Jieun",
      github: "choije_devops",
      avatar: "/placeholder.svg?height=32&width=32&text=C",
      isOnline: true,
    },
  ],
});

const issues = ref([]);
const prs = ref([]);
const comments = ref([]);
const totalReviewStatsDto = ref([]);
const userReviewStatsDtoList = ref([]);

onMounted(async () => {
  try {
    const [issuesRes, prsRes, commentsRes, reviewStatsRes] = await Promise.all([
      api.$get("api/todo/issues?owner=Cloudible&repo=GCP"),
      api.$get("api/todo/prs?owner=Cloudible&repo=GCP"),
      api.$get("api/todo/reviews?owner=Cloudible&repo=GCP"),
      api.$get("api/todo?owner=Cloudible&repo=GCP"),
    ]);
    issues.value = issuesRes;
    prs.value = prsRes;
    comments.value = commentsRes;
    totalReviewStatsDto.value = reviewStatsRes.totalReviewStatsDto;
    userReviewStatsDtoList.value = reviewStatsRes.userReviewStatsDtoList;
  } catch (error) {
    console.error("❌ 이슈 가져오기 실패:", error);
  }
});

// 탭 정의
const tabs = ref([
  {
    id: "issues",
    name: "Issues",
  },
  {
    id: "prs",
    name: "Pull Requests",
    count: computed(() => pullRequests.value.length),
  },
  {
    id: "reviews",
    name: "Code Review",
  },
  {
    id: "commits",
    name: "Commits",
  },
]);

// Pull Request 목록
const pullRequests = ref([
  {
    id: 1,
    number: 15,
    title: "Implement user authentication API",
    body: "This PR implements the JWT-based authentication system as requested in issue #42.\n\n## Changes\n- Added login/logout endpoints\n- Implemented JWT token generation\n- Added middleware for protected routes",
    state: "open",
    merged: false,
    user: {
      login: "kimcs_dev",
      avatar_url: "/placeholder.svg?height=20&width=20&text=K",
    },
    assignee: {
      login: "parkms_backend",
      avatar_url: "/placeholder.svg?height=20&width=20&text=P",
    },
    head: { ref: "feature/auth-system" },
    base: { ref: "main" },
    labels: [{ id: 1, name: "enhancement", color: "a2eeef" }],
    comments: 3,
    additions: 245,
    deletions: 12,
    changed_files: 8,
    created_at: "2024-01-16T08:30:00Z",
    updated_at: "2024-01-16T14:20:00Z",
    reviews: [
      {
        id: 1,
        user: {
          login: "parkms_backend",
          avatar_url: "/placeholder.svg?height=16&width=16&text=P",
        },
        state: "APPROVED",
      },
      {
        id: 2,
        user: {
          login: "choije_devops",
          avatar_url: "/placeholder.svg?height=16&width=16&text=C",
        },
        state: "COMMENTED",
      },
    ],
    checks: [
      { id: 1, name: "CI/CD Pipeline", status: "success" },
      { id: 2, name: "Code Quality", status: "success" },
      { id: 3, name: "Security Scan", status: "pending" },
    ],
  },
]);

// 리뷰어 통계
const reviewerStats = ref([
  {
    login: "parkms_backend",
    avatar_url: "/placeholder.svg?height=32&width=32&text=P",
    reviews_count: 8,
    approved: 6,
    commented: 2,
    changes_requested: 0,
  },
  {
    login: "kimcs_dev",
    avatar_url: "/placeholder.svg?height=32&width=32&text=K",
    reviews_count: 6,
    approved: 4,
    commented: 1,
    changes_requested: 1,
  },
  {
    login: "choije_devops",
    avatar_url: "/placeholder.svg?height=32&width=32&text=C",
    reviews_count: 4,
    approved: 2,
    commented: 2,
    changes_requested: 0,
  },
]);

// 브랜치 목록
const branches = ref([
  "main",
  "develop",
  "feature/auth-system",
  "fix/mobile-responsive",
]);

// 커밋 목록
const commits = ref([
  {
    sha: "a1b2c3d4e5f6",
    commit: {
      message:
        "feat: add JWT authentication middleware\n\nImplemented JWT token validation middleware for protected routes",
      author: { date: "2024-01-16T14:30:00Z" },
    },
    author: {
      login: "kimcs_dev",
      avatar_url: "/placeholder.svg?height=32&width=32&text=K",
    },
    stats: { additions: 45, deletions: 3 },
  },
  {
    sha: "b2c3d4e5f6g7",
    commit: {
      message: "fix: resolve mobile navigation issues",
      author: { date: "2024-01-16T12:15:00Z" },
    },
    author: {
      login: "leeyh_frontend",
      avatar_url: "/placeholder.svg?height=32&width=32&text=L",
    },
    stats: { additions: 23, deletions: 18 },
  },
  {
    sha: "c3d4e5f6g7h8",
    commit: {
      message: "docs: update API documentation",
      author: { date: "2024-01-16T10:45:00Z" },
    },
    author: {
      login: "parkms_backend",
      avatar_url: "/placeholder.svg?height=32&width=32&text=P",
    },
    stats: { additions: 67, deletions: 12 },
  },
]);

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// GitHub 연동 함수들
const syncWithGitHub = async () => {
  isSyncing.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showToastMessage("Successfully synced with GitHub!");
  } catch (error) {
    showToastMessage("Failed to sync with GitHub");
  } finally {
    isSyncing.value = false;
  }
};

const goBack = () => {
  alert("Navigate back to project list");
};
</script>

<style scoped>
/* 기본 설정 */
.dashboard {
  min-height: 100vh;
  background: #fafafa;
  color: #37352f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 헤더 */
.header {
  background: white;
  border-bottom: 1px solid #e9e9e7;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 6px;
  color: #9b9a97;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f1f1ef;
  color: #37352f;
}

.back-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.project-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.project-title h1 {
  font-size: 20px;
  font-weight: 600;
  color: #37352f;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.visibility-tag {
  padding: 2px 8px;
  background: #f1f1ef;
  color: #787774;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.project-desc {
  font-size: 14px;
  color: #787774;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f0f9f0;
  border: 1px solid #d3f5d3;
  border-radius: 6px;
  font-size: 13px;
  color: #2d7d32;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.team-members {
  display: flex;
  gap: -4px;
}

.member-avatar {
  position: relative;
  margin-left: -4px;
}

.member-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  display: block;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
}

.sync-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  color: #37352f;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sync-btn:hover:not(:disabled) {
  background: #f8f8f7;
  border-color: #d9d9d6;
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-btn.syncing .sync-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sync-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

/* 메인 */
.main {
  flex: 1;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

/* 통계 섹션 */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #d9d9d6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 20px;
}

.stat-header h3 {
  font-size: 14px;
  font-weight: 500;
  color: #787774;
  margin: 0;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #37352f;
  line-height: 1;
}

/* 탭 */
.tabs {
  margin-bottom: 32px;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid #e9e9e7;
  gap: 32px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #787774;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab:hover {
  color: #37352f;
}

.tab.active {
  color: #37352f;
  border-bottom-color: #37352f;
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  padding: 2px 8px;
  background: #f1f1ef;
  color: #787774;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tab.active .tab-badge {
  background: #37352f;
  color: white;
}

/* 컨텐츠 */
.content {
  min-height: 400px;
}

.content-panel {
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f1ef;
  background: #fafafa;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title h2 {
  font-size: 18px;
  font-weight: 600;
  color: #37352f;
  margin: 0;
}

.count-badge {
  padding: 4px 8px;
  background: #f1f1ef;
  color: #787774;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-select {
  padding: 6px 12px;
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  color: #37352f;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #37352f;
}

.filter-group {
  display: flex;
  background: #f8f8f7;
  border-radius: 6px;
  padding: 2px;
}

.filter-btn {
  padding: 6px 12px;
  background: none;
  border: none;
  border-radius: 4px;
  color: #787774;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: #37352f;
}

.filter-btn.active {
  background: white;
  color: #37352f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.panel-content {
  padding: 24px;
}

/* 리뷰 대시보드 */
.review-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.review-card {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  text-align: center;
}

.review-number {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.review-card.approved .review-number {
  color: #2d7d32;
}

.review-card.pending .review-number {
  color: #f57c00;
}

.review-card.changes .review-number {
  color: #d32f2f;
}

.review-label {
  font-size: 13px;
  color: #787774;
  font-weight: 500;
}

.reviewer-section {
  margin-top: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #37352f;
  margin: 0 0 20px 0;
}

.reviewer-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reviewer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 500;
  color: #37352f;
  margin-bottom: 2px;
}

.reviewer-activity {
  font-size: 12px;
  color: #787774;
}

.reviewer-metrics {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 500;
}

.metric.approved {
  color: #2d7d32;
}

.metric.commented {
  color: #f57c00;
}

.metric.changes {
  color: #d32f2f;
}

/* 커밋 리스트 */
.commit-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.commit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.commit-item:hover {
  background: #f1f1ef;
}

.commit-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.commit-details {
  flex: 1;
  min-width: 0;
}

.commit-message {
  font-size: 14px;
  font-weight: 500;
  color: #37352f;
  margin-bottom: 6px;
  line-height: 1.4;
}

.commit-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #787774;
}

.commit-author {
  color: #37352f;
  font-weight: 500;
}

.commit-hash {
  padding: 2px 6px;
  background: #e9e9e7;
  border-radius: 4px;
  font-family: "SF Mono", Monaco, monospace;
}

.commit-changes {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.additions {
  color: #2d7d32;
}

.deletions {
  color: #d32f2f;
}

/* 토스트 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  font-size: 14px;
  color: #37352f;
}

.toast-icon {
  font-size: 16px;
}

/* 반응형 */
@media (max-width: 768px) {
  .main-container {
    padding: 20px;
  }

  .header-container {
    padding: 0 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tab-list {
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 1px;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .commit-item {
    flex-direction: column;
    gap: 12px;
  }

  .commit-changes {
    align-self: flex-start;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
