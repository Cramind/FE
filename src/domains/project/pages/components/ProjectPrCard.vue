<template>
  <div class="pr-list">
    <div v-for="pr in props.prs" :key="pr.id" class="pr-card">
      <div class="pr-header">
        <div class="pr-status">
          <div
            class="status-dot"
            :class="{
              merged: pr.merged,
              open: pr.state === 'open' && !pr.merged,
              closed: pr.state === 'closed' && !pr.merged,
            }"
          ></div>
        </div>

        <div class="pr-content">
          <div class="pr-title-section">
            <div class="pr-main-info">
              <h3 class="pr-title" @click="openPrDetail(pr)">
                {{ pr.title }}
              </h3>
              <div class="pr-meta">
                <span class="pr-number">#{{ pr.number }}</span>
                <span class="pr-action">{{
                  pr.merged ? "merged" : "opened"
                }}</span>
                <span class="pr-time">{{ formatTimeAgo(pr.created_at) }}</span>
                <span class="pr-author">by @{{ pr.user.login }}</span>
                <div class="branch-info">
                  <span class="branch">{{ pr.head.ref }}</span>
                  <span class="arrow">→</span>
                  <span class="branch">{{ pr.base.ref }}</span>
                </div>
              </div>
            </div>

            <div class="pr-assignee-labels">
              <div v-if="pr.assignee" class="assignee">
                <img
                  :src="pr.assignee.avatar_url"
                  :alt="pr.assignee.login"
                  class="assignee-avatar"
                />
                <span class="assignee-name">@{{ pr.assignee.login }}</span>
              </div>

              <div v-if="pr.labels && pr.labels.length > 0" class="labels">
                <span
                  v-for="label in pr.labels"
                  :key="label.id"
                  class="label"
                  :style="{
                    backgroundColor: `#${label.color}15`,
                    color: `#${label.color}`,
                    borderColor: `#${label.color}30`,
                  }"
                >
                  {{ label.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- PR 본문 -->
          <div v-if="pr.body && pr.body.trim()" class="pr-description">
            <div
              class="description-content"
              :class="{ expanded: expandedPrs[pr.id] }"
            >
              <div class="prose" v-html="formatMarkdown(pr.body)"></div>
            </div>

            <button
              v-if="isContentTruncated(pr.body)"
              @click="toggleExpanded(pr.id)"
              class="expand-button"
            >
              <span>{{ expandedPrs[pr.id] ? "Show less" : "Show more" }}</span>
              <svg
                class="expand-icon"
                :class="{ rotated: expandedPrs[pr.id] }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- PR 통계 -->
          <div class="pr-stats">
            <div class="stat-item additions">
              <span class="stat-icon">+</span>
              <span class="stat-value">{{ pr.additions || 0 }}</span>
            </div>
            <div class="stat-item deletions">
              <span class="stat-icon">−</span>
              <span class="stat-value">{{ pr.deletions || 0 }}</span>
            </div>
            <div class="stat-item files">
              <span class="stat-icon">📄</span>
              <span class="stat-value">{{ pr.changed_files || 0 }} files</span>
            </div>
            <div class="stat-item comments">
              <span class="stat-icon">💬</span>
              <span class="stat-value">{{ pr.comments || 0 }}</span>
            </div>
          </div>

          <!-- 리뷰 상태 -->
          <div v-if="pr.reviews && pr.reviews.length > 0" class="reviews">
            <div
              v-for="review in pr.reviews"
              :key="review.id"
              class="review-item"
            >
              <img
                :src="review.user.avatar_url"
                :alt="review.user.login"
                class="reviewer-avatar"
              />
              <span
                class="review-status"
                :class="{
                  approved: review.state === 'APPROVED',
                  changes: review.state === 'CHANGES_REQUESTED',
                  commented: review.state === 'COMMENTED',
                }"
              >
                {{ getReviewStatusText(review.state) }}
              </span>
            </div>
          </div>

          <!-- CI/CD 상태 -->
          <div v-if="pr.checks && pr.checks.length > 0" class="checks">
            <div v-for="check in pr.checks" :key="check.id" class="check-item">
              <div
                class="check-status"
                :class="{
                  success: check.status === 'success',
                  failure: check.status === 'failure',
                  pending: check.status === 'pending',
                  neutral: check.status === 'neutral',
                }"
              ></div>
              <span class="check-name">{{ check.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-if="!props.prs || props.prs.length === 0" class="empty-state">
      <div class="empty-icon">🔀</div>
      <h3 class="empty-title">No pull requests found</h3>
      <p class="empty-description">
        There are no pull requests matching your current filters.
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import {
  formatTimeAgo,
  isContentTruncated,
  formatMarkdown,
} from "@/utils/format";

const props = defineProps({
  prs: {
    type: Array,
    required: true,
  },
});

const expandedPrs = reactive({});

const toggleExpanded = (prId) => {
  expandedPrs[prId] = !expandedPrs[prId];
};

const getReviewStatusText = (state) => {
  const statusMap = {
    APPROVED: "approved",
    CHANGES_REQUESTED: "changes requested",
    COMMENTED: "commented",
  };
  return statusMap[state] || state.toLowerCase();
};

const openPrDetail = (pr) => {
  // PR 상세 페이지로 이동하는 로직
  console.log("Open PR detail:", pr);
};
</script>

<style scoped>
/* PR 리스트 */
.pr-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* PR 카드 */
.pr-card {
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.pr-card:hover {
  border-color: #d9d9d6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* PR 헤더 */
.pr-header {
  display: flex;
  gap: 16px;
}

.pr-status {
  flex-shrink: 0;
  padding-top: 2px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.merged {
  background: #8b5cf6;
}

.status-dot.open {
  background: #22c55e;
}

.status-dot.closed {
  background: #ef4444;
}

/* PR 컨텐츠 */
.pr-content {
  flex: 1;
  min-width: 0;
}

.pr-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.pr-main-info {
  flex: 1;
  min-width: 0;
}

.pr-title {
  font-size: 16px;
  font-weight: 600;
  color: #37352f;
  margin: 0 0 8px 0;
  cursor: pointer;
  transition: color 0.2s ease;
  line-height: 1.4;
}

.pr-title:hover {
  color: #2563eb;
}

.pr-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #787774;
  flex-wrap: wrap;
}

.pr-number {
  color: #37352f;
  font-weight: 500;
  font-family: "SF Mono", Monaco, monospace;
}

.pr-author {
  color: #2563eb;
  font-weight: 500;
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #f1f1ef;
  border-radius: 4px;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 12px;
}

.branch {
  color: #37352f;
}

.arrow {
  color: #787774;
}

/* 담당자 및 라벨 */
.pr-assignee-labels {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #787774;
}

.assignee-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.assignee-name {
  color: #2563eb;
  font-weight: 500;
}

.labels {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.label {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
  white-space: nowrap;
}

/* PR 설명 */
.pr-description {
  margin-bottom: 16px;
}

.description-content {
  font-size: 14px;
  color: #787774;
  line-height: 1.5;
  overflow: hidden;
  transition: all 0.3s ease;
}

.description-content:not(.expanded) {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 4.5rem;
}

.description-content.expanded {
  max-height: none;
}

.expand-button {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 0;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.expand-button:hover {
  color: #1d4ed8;
}

.expand-icon {
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* PR 통계 */
.pr-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #787774;
}

.stat-item.additions {
  color: #22c55e;
}

.stat-item.deletions {
  color: #ef4444;
}

.stat-icon {
  font-weight: 600;
}

.stat-value {
  font-weight: 500;
}

/* 리뷰 상태 */
.reviews {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.review-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f8f8f7;
  border-radius: 6px;
}

.reviewer-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.review-status {
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.review-status.approved {
  color: #22c55e;
}

.review-status.changes {
  color: #ef4444;
}

.review-status.commented {
  color: #f59e0b;
}

/* CI/CD 상태 */
.checks {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #787774;
}

.check-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.check-status.success {
  background: #22c55e;
}

.check-status.failure {
  background: #ef4444;
}

.check-status.pending {
  background: #f59e0b;
}

.check-status.neutral {
  background: #9ca3af;
}

.check-name {
  font-weight: 500;
}

/* 프로즈 스타일 */
.prose {
  max-width: none;
  color: #787774;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  color: #37352f;
  font-weight: 600;
  margin: 16px 0 8px 0;
}

.prose :deep(.heading-1) {
  font-size: 20px;
}

.prose :deep(.heading-2) {
  font-size: 18px;
}

.prose :deep(.heading-3) {
  font-size: 16px;
}

.prose :deep(p) {
  margin-bottom: 8px;
  line-height: 1.5;
}

.prose :deep(.code-block) {
  background: #f8f8f7;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
  overflow-x: auto;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 13px;
}

.prose :deep(.code-block code) {
  background: none;
  padding: 0;
  color: #37352f;
}

.prose :deep(.inline-code) {
  background: #f1f1ef;
  color: #37352f;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  font-family: "SF Mono", Monaco, monospace;
}

.prose :deep(.link) {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.prose :deep(.link:hover) {
  color: #1d4ed8;
}

.prose :deep(.list-item) {
  margin-left: 16px;
  list-style-type: disc;
  list-style-position: inside;
  margin-bottom: 4px;
}

.prose :deep(strong) {
  color: #37352f;
  font-weight: 600;
}

.prose :deep(em) {
  color: #37352f;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #37352f;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #787774;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
}

/* 반응형 */
@media (max-width: 768px) {
  .pr-card {
    padding: 16px;
  }

  .pr-header {
    gap: 12px;
  }

  .pr-title-section {
    flex-direction: column;
    gap: 12px;
  }

  .pr-assignee-labels {
    align-items: flex-start;
  }

  .pr-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .pr-stats {
    gap: 12px;
  }

  .reviews {
    gap: 6px;
  }

  .checks {
    gap: 8px;
  }
}
</style>
