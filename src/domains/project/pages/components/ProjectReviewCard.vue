<template>
  <div class="review-comments">
    <div class="comments-header">
      <h3 class="comments-title">
        <span class="comments-icon">💬</span>
        Review Comments
        <span class="comments-count">{{ comments.length }}</span>
      </h3>
    </div>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-card">
        <!-- 코멘트 헤더 -->
        <div class="comment-header">
          <div class="author-info">
            <img
              :src="comment.user.avatar_url"
              :alt="comment.user.login"
              class="author-avatar"
            />
            <div class="author-details">
              <span class="author-name">@{{ comment.user.login }}</span>
              <div class="comment-meta">
                <span
                  class="author-role"
                  :class="getRoleClass(comment.author_association)"
                >
                  {{ formatRole(comment.author_association) }}
                </span>
                <span class="comment-time">{{
                  formatTimeAgo(comment.created_at)
                }}</span>
                <span
                  v-if="comment.updated_at !== comment.created_at"
                  class="edited-indicator"
                >
                  (edited)
                </span>
              </div>
            </div>
          </div>

          <div class="comment-actions">
            <a
              :href="comment.html_url"
              target="_blank"
              rel="noopener noreferrer"
              class="view-on-github"
              title="View on GitHub"
            >
              <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- 파일 정보 -->
        <div class="file-info">
          <div class="file-path">
            <span class="file-icon">📄</span>
            <span class="path-text">{{ comment.path }}</span>
          </div>
          <div class="line-info">
            <span class="line-number">Line {{ comment.position }}</span>
          </div>
        </div>

        <!-- 코드 diff (있는 경우) -->
        <div v-if="comment.diff_hunk" class="code-diff">
          <div class="diff-header">
            <span class="diff-icon">🔍</span>
            <span class="diff-label">Code Context</span>
            <button @click="toggleDiff(comment.id)" class="toggle-diff-btn">
              <span>{{ expandedDiffs[comment.id] ? "Hide" : "Show" }}</span>
              <svg
                class="toggle-icon"
                :class="{ rotated: expandedDiffs[comment.id] }"
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

          <div v-if="expandedDiffs[comment.id]" class="diff-content">
            <pre
              class="diff-code"
            ><code v-html="formatDiffHunk(comment.diff_hunk)"></code></pre>
          </div>
        </div>

        <!-- 코멘트 본문 -->
        <div class="comment-body">
          <div
            class="comment-content"
            :class="{ expanded: expandedComments[comment.id] }"
          >
            <div class="prose" v-html="formatMarkdown(comment.body)"></div>
          </div>

          <button
            v-if="isContentTruncated(comment.body)"
            @click="toggleComment(comment.id)"
            class="expand-button"
          >
            <span>{{
              expandedComments[comment.id] ? "Show less" : "Show more"
            }}</span>
            <svg
              class="expand-icon"
              :class="{ rotated: expandedComments[comment.id] }"
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

        <!-- 답글 표시 (있는 경우) -->
        <div v-if="comment.in_reply_to_id" class="reply-indicator">
          <span class="reply-icon">↳</span>
          <span class="reply-text">Reply to previous comment</span>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-if="!comments || comments.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <h3 class="empty-title">No review comments</h3>
      <p class="empty-description">
        There are no review comments for this pull request yet.
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});

// 확장 상태 관리
const expandedComments = reactive({});
const expandedDiffs = reactive({});

// 메서드
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const formatRole = (association) => {
  const roleMap = {
    OWNER: "Owner",
    MEMBER: "Member",
    COLLABORATOR: "Collaborator",
    CONTRIBUTOR: "Contributor",
    FIRST_TIME_CONTRIBUTOR: "First-time contributor",
    FIRST_TIMER: "First timer",
    NONE: "External",
  };
  return roleMap[association] || association;
};

const getRoleClass = (association) => {
  const classMap = {
    OWNER: "role-owner",
    MEMBER: "role-member",
    COLLABORATOR: "role-collaborator",
    CONTRIBUTOR: "role-contributor",
    FIRST_TIME_CONTRIBUTOR: "role-first-time",
    FIRST_TIMER: "role-first-time",
    NONE: "role-external",
  };
  return classMap[association] || "role-external";
};

const isContentTruncated = (content) => {
  if (!content) return false;
  const lines = content.split("\n").length;
  const length = content.length;
  return lines > 3 || length > 200;
};

const toggleComment = (commentId) => {
  expandedComments[commentId] = !expandedComments[commentId];
};

const toggleDiff = (commentId) => {
  expandedDiffs[commentId] = !expandedDiffs[commentId];
};

const formatMarkdown = (text) => {
  if (!text) return "";

  return (
    text
      // 코드 블록
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="code-block"><code>$2</code></pre>'
      )
      // 인라인 코드
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // 볼드
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // 이탤릭
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // 링크
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="link" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // 줄바꿈
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      // 전체를 p 태그로 감싸기
      .replace(/^(.*)$/, "<p>$1</p>")
  );
};

const formatDiffHunk = (diffHunk) => {
  if (!diffHunk) return "";

  return diffHunk
    .split("\n")
    .map((line) => {
      if (line.startsWith("+")) {
        return `<span class="diff-addition">${line}</span>`;
      } else if (line.startsWith("-")) {
        return `<span class="diff-deletion">${line}</span>`;
      } else if (line.startsWith("@@")) {
        return `<span class="diff-header-line">${line}</span>`;
      } else {
        return `<span class="diff-context">${line}</span>`;
      }
    })
    .join("\n");
};
</script>

<style scoped>
/* 메인 컨테이너 */
.review-comments {
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  overflow: hidden;
}

/* 헤더 */
.comments-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f1ef;
  background: #fafafa;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #37352f;
  margin: 0;
}

.comments-icon {
  font-size: 20px;
}

.comments-count {
  padding: 4px 8px;
  background: #f1f1ef;
  color: #787774;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 코멘트 리스트 */
.comments-list {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 코멘트 카드 */
.comment-card {
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.comment-card:hover {
  border-color: #d9d9d6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 코멘트 헤더 */
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #37352f;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  font-size: 12px;
  color: #787774;
  flex-wrap: wrap;
}

.author-role {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-owner {
  background: #e3f2fd;
  color: #1976d2;
}

.role-member {
  background: #f3e5f5;
  color: #7b1fa2;
}

.role-collaborator {
  background: #e8f5e8;
  color: #388e3c;
}

.role-contributor {
  background: #fff3e0;
  color: #f57c00;
}

.role-first-time {
  background: #fce4ec;
  color: #c2185b;
}

.role-external {
  background: #f5f5f5;
  color: #616161;
}

.edited-indicator {
  font-style: italic;
  color: #9ca3af;
}

.comment-actions {
  flex-shrink: 0;
}

.view-on-github {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #787774;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.view-on-github:hover {
  background: #f1f1ef;
  color: #37352f;
}

.github-icon {
  width: 16px;
  height: 16px;
}

/* 파일 정보 */
.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 12px;
}

.file-path {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #37352f;
  font-weight: 500;
  font-family: "SF Mono", Monaco, monospace;
}

.file-icon {
  font-size: 14px;
}

.path-text {
  color: #2563eb;
}

.line-info {
  color: #787774;
  font-family: "SF Mono", Monaco, monospace;
}

.line-number {
  background: #f1f1ef;
  padding: 2px 6px;
  border-radius: 4px;
}

/* 코드 diff */
.code-diff {
  margin-bottom: 12px;
}

.diff-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8f8f7;
  border: 1px solid #e9e9e7;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  font-size: 12px;
}

.diff-header > div:first-child {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #787774;
  font-weight: 500;
}

.diff-icon {
  font-size: 14px;
}

.toggle-diff-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toggle-diff-btn:hover {
  background: #f1f1ef;
}

.toggle-icon {
  width: 10px;
  height: 10px;
  transition: transform 0.2s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.diff-content {
  border: 1px solid #e9e9e7;
  border-top: none;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}

.diff-code {
  margin: 0;
  padding: 12px;
  background: #f8f8f7;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
}

.diff-code :deep(.diff-addition) {
  background: #d4edda;
  color: #155724;
  display: block;
  padding: 0 4px;
}

.diff-code :deep(.diff-deletion) {
  background: #f8d7da;
  color: #721c24;
  display: block;
  padding: 0 4px;
}

.diff-code :deep(.diff-header-line) {
  background: #e2e3e5;
  color: #495057;
  display: block;
  padding: 0 4px;
  font-weight: 600;
}

.diff-code :deep(.diff-context) {
  color: #37352f;
  display: block;
  padding: 0 4px;
}

/* 코멘트 본문 */
.comment-body {
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  padding: 12px;
}

.comment-content {
  font-size: 14px;
  color: #37352f;
  line-height: 1.5;
  overflow: hidden;
  transition: all 0.3s ease;
}

.comment-content:not(.expanded) {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 4.5rem;
}

.comment-content.expanded {
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

/* 답글 표시 */
.reply-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 6px 8px;
  background: #f1f1ef;
  border-radius: 4px;
  font-size: 11px;
  color: #787774;
}

.reply-icon {
  color: #9ca3af;
}

/* 프로즈 스타일 */
.prose {
  max-width: none;
}

.prose :deep(p) {
  margin-bottom: 8px;
  line-height: 1.5;
}

.prose :deep(.code-block) {
  background: #f8f8f7;
  border: 1px solid #e9e9e7;
  border-radius: 4px;
  padding: 8px;
  margin: 8px 0;
  overflow-x: auto;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 12px;
}

.prose :deep(.inline-code) {
  background: #f1f1ef;
  color: #37352f;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  font-family: "SF Mono", Monaco, monospace;
}

.prose :deep(.link) {
  color: #2563eb;
  text-decoration: underline;
}

.prose :deep(strong) {
  font-weight: 600;
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
  .comments-list {
    padding: 16px;
  }

  .comment-card {
    padding: 12px;
  }

  .comment-header {
    flex-direction: column;
    gap: 8px;
  }

  .file-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .comment-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
