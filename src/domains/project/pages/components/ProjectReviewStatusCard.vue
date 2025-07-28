<template>
  <div class="content-panel">
    <div class="panel-header">
      <div class="panel-title">
        <h2>Code Review Dashboard</h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- 리뷰 통계 카드 -->
      <div class="review-stats">
        <div class="review-card approved">
          <div class="review-number">
            {{ props.totalReviewStatsDto.approved }}
          </div>
          <div class="review-label">Approved</div>
        </div>
        <div class="review-card pending">
          <div class="review-number">
            {{ props.totalReviewStatsDto.commented }}
          </div>
          <div class="review-label">Commented</div>
        </div>
        <div class="review-card changes">
          <div class="review-number">
            {{ props.totalReviewStatsDto.changesRequested }}
          </div>
          <div class="review-label">Changes Requested</div>
        </div>
      </div>

      <!-- 사용자별 리뷰 통계 -->
      <div
        v-if="
          props.userReviewStatsDtoList &&
          props.userReviewStatsDtoList.length > 0
        "
        class="reviewer-section"
      >
        <h3 class="section-title">Reviewer Activity</h3>
        <div class="reviewer-grid">
          <div
            v-for="reviewer in props.userReviewStatsDtoList"
            :key="reviewer.login || reviewer.id"
            class="reviewer-card"
          >
            <div class="reviewer-info">
              <img
                :src="
                  reviewer.avatarUrl ||
                  `/placeholder.svg?height=32&width=32&text=${(reviewer.reviewerName,
                  'U')
                    .charAt(0)
                    .toUpperCase()}`
                "
                :alt="reviewer.login || reviewer.name"
                class="reviewer-avatar"
              />
              <div class="reviewer-details">
                <div class="reviewer-name">@{{ reviewer.reviewerName }}</div>
                <div class="reviewer-activity">
                  {{
                    reviewer.approved +
                    reviewer.commented +
                    reviewer.changesRequested
                  }}
                  reviews this week
                </div>
              </div>
            </div>
            <div class="reviewer-metrics">
              <span class="metric approved">{{ reviewer.approved || 0 }}</span>
              <span class="metric commented">{{
                reviewer.commented || 0
              }}</span>
              <span class="metric changes">{{
                reviewer.changesRequested || 0
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="empty-state">
        <div class="empty-icon">👀</div>
        <h3 class="empty-title">No reviewer activity</h3>
        <p class="empty-description">
          There are no reviewer statistics available at the moment.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps } from "vue";

const props = defineProps({
  totalReviewStatsDto: {
    type: Object,
    default: () => ({
      approved: 0,
      pending: 0,
      changesRequested: 0,
      commented: 0,
    }),
  },
  userReviewStatsDtoList: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  console.log("Total Review Stats:", props.totalReviewStatsDto);
  console.log("User Review Stats:", props.userReviewStatsDtoList);
});
</script>

<style scoped>
/* 기본 폰트 설정 */
* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

/* 컨텐츠 패널 */
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

.panel-title h2 {
  font-size: 18px;
  font-weight: 600;
  color: #37352f;
  margin: 0;
  font-family: inherit;
}

.panel-content {
  padding: 24px;
}

/* 리뷰 통계 */
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
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-number {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  font-family: inherit;
}

.review-card.approved {
  border-color: #d4edda;
}

.review-card.approved .review-number {
  color: #2d7d32;
}

.review-card.pending {
  border-color: #fff3cd;
}

.review-card.pending .review-number {
  color: #f57c00;
}

.review-card.changes {
  border-color: #f8d7da;
}

.review-card.changes .review-number {
  color: #d32f2f;
}

.review-label {
  font-size: 13px;
  color: #787774;
  font-weight: 500;
  font-family: inherit;
}

/* 리뷰어 섹션 */
.reviewer-section {
  margin-top: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #37352f;
  margin: 0 0 20px 0;
  font-family: inherit;
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
  border: 1px solid #f1f1ef;
  transition: all 0.2s ease;
}

.reviewer-card:hover {
  border-color: #e9e9e7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reviewer-details {
  flex: 1;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 500;
  color: #37352f;
  margin-bottom: 2px;
  font-family: inherit;
}

.reviewer-activity {
  font-size: 12px;
  color: #787774;
  font-family: inherit;
}

.reviewer-metrics {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
}

.metric {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
  font-family: inherit;
}

.metric.approved {
  background: #d4edda;
  color: #2d7d32;
}

.metric.commented {
  background: #fff3cd;
  color: #f57c00;
}

.metric.changes {
  background: #f8d7da;
  color: #d32f2f;
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
  font-family: inherit;
}

.empty-description {
  font-size: 14px;
  color: #787774;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
  font-family: inherit;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .panel-content {
    padding: 16px;
  }

  .review-stats {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .reviewer-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .reviewer-info {
    width: 100%;
  }

  .reviewer-metrics {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .panel-header {
    padding: 16px;
  }

  .panel-content {
    padding: 12px;
  }

  .review-card {
    padding: 16px;
  }

  .review-number {
    font-size: 24px;
  }

  .reviewer-card {
    padding: 12px;
  }
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reviewer-card {
  animation: fadeIn 0.3s ease-out;
}

.review-card {
  animation: fadeIn 0.3s ease-out;
}

/* 포커스 상태 */
.reviewer-card:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
