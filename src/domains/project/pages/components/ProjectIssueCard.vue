<template>
  <div class="issue-list">
    <div v-for="issue in props.issues" :key="issue.id" class="issue-card">
      <div class="issue-header">
        <div class="issue-status">
          <div
            class="status-dot"
            :class="{
              open: issue.state === 'open',
              closed: issue.state === 'closed',
            }"
          ></div>
        </div>

        <div class="issue-content">
          <div class="issue-title-section">
            <div class="issue-main-info">
              <h3 class="issue-title" @click="openIssueDetail(issue)">
                {{ issue.title }}
              </h3>
              <div class="issue-meta">
                <span class="issue-number">#{{ issue.number }}</span>
                <span class="issue-action">opened</span>
                <span class="issue-time">{{
                  formatTimeAgo(issue.created_at)
                }}</span>
                <span class="issue-author">by @{{ issue.user.login }}</span>
              </div>
            </div>

            <div class="issue-assignee-labels">
              <div v-if="issue.assignee" class="assignee">
                <img
                  :src="issue.assignee.avatar_url"
                  :alt="issue.assignee.login"
                  class="assignee-avatar"
                />
                <span class="assignee-name">@{{ issue.assignee.login }}</span>
              </div>

              <div
                v-if="issue.labels && issue.labels.length > 0"
                class="labels"
              >
                <span
                  v-for="label in issue.labels"
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

          <!-- 이슈 본문 -->
          <div v-if="issue.body && issue.body.trim()" class="issue-description">
            <div
              class="description-content"
              :class="{ expanded: expandedIssues[issue.id] }"
            >
              <div class="prose" v-html="formatMarkdown(issue.body)"></div>
            </div>

            <button
              v-if="isContentTruncated(issue.body)"
              @click="toggleExpanded(issue.id)"
              class="expand-button"
            >
              <span>{{
                expandedIssues[issue.id] ? "Show less" : "Show more"
              }}</span>
              <svg
                class="expand-icon"
                :class="{ rotated: expandedIssues[issue.id] }"
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

          <!-- 이슈 메타 정보 -->
          <div class="issue-stats">
            <div class="stat-item">
              <span class="stat-icon">💬</span>
              <span class="stat-value">{{ issue.comments || 0 }}</span>
            </div>

            <div v-if="issue.milestone" class="stat-item">
              <span class="stat-icon">🎯</span>
              <span class="stat-value">{{ issue.milestone.title }}</span>
            </div>

            <div class="stat-item">
              <span class="stat-icon">🕒</span>
              <span class="stat-value"
                >Updated {{ formatTimeAgo(issue.updated_at) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-if="!props.issues || props.issues.length === 0" class="empty-state">
      <div class="empty-icon">🔴</div>
      <h3 class="empty-title">No issues found</h3>
      <p class="empty-description">
        There are no issues matching your current filters.
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
  issues: {
    type: Array,
    required: true,
  },
});

const expandedIssues = reactive({});

const toggleExpanded = (issueId) => {
  expandedIssues[issueId] = !expandedIssues[issueId];
};
</script>

<style scoped>
/* 이슈 리스트 */
.issue-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 이슈 카드 */
.issue-card {
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.issue-card:hover {
  border-color: #d9d9d6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 이슈 헤더 */
.issue-header {
  display: flex;
  gap: 16px;
}

.issue-status {
  flex-shrink: 0;
  padding-top: 2px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.open {
  background: #22c55e;
}

.status-dot.closed {
  background: #ef4444;
}

/* 이슈 컨텐츠 */
.issue-content {
  flex: 1;
  min-width: 0;
}

.issue-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.issue-main-info {
  flex: 1;
  min-width: 0;
}

.issue-title {
  font-size: 16px;
  font-weight: 600;
  color: #37352f;
  margin: 0 0 8px 0;
  cursor: pointer;
  transition: color 0.2s ease;
  line-height: 1.4;
}

.issue-title:hover {
  color: #2563eb;
}

.issue-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #787774;
  flex-wrap: wrap;
}

.issue-number {
  color: #37352f;
  font-weight: 500;
  font-family: "SF Mono", Monaco, monospace;
}

.issue-author {
  color: #2563eb;
  font-weight: 500;
}

/* 담당자 및 라벨 */
.issue-assignee-labels {
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

/* 이슈 설명 */
.issue-description {
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

/* 이슈 통계 */
.issue-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #787774;
}

.stat-icon {
  font-size: 14px;
}

.stat-value {
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
  .issue-card {
    padding: 16px;
  }

  .issue-header {
    gap: 12px;
  }

  .issue-title-section {
    flex-direction: column;
    gap: 12px;
  }

  .issue-assignee-labels {
    align-items: flex-start;
  }

  .issue-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .issue-stats {
    gap: 12px;
  }
}
</style>
