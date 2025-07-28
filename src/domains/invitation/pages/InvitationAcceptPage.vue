<template>
  <div class="min-h-screen bg-gray-700 flex items-center justify-center p-4">
    <!-- 메인 초대 카드 -->
    <InvitationInfoCard />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import InvitationInfoCard from "./components/InvitationInfoCard.vue";

// 상태 관리
const isLoading = ref(false);
const showSuccessModal = ref(false);

// 초대자 정보
const inviter = ref({
  name: "김민수",
  invitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
});

// 그룹 정보
const groupInfo = ref({
  name: "토익 900점 도전 그룹",
  description:
    "3개월 안에 토익 900점을 목표로 하는 스터디 그룹입니다. 매일 2시간씩 함께 공부하며 서로 동기부여하고 있어요! 📚✨",
  onlineMembers: 5,
  totalMembers: 12,
  totalStudyTime: "247시간",
  averageDaily: "2.3시간",
  members: [
    { id: 1, name: "김민수" },
    { id: 2, name: "이지은" },
    { id: 3, name: "박준호" },
    { id: 4, name: "최유진" },
    { id: 5, name: "정수현" },
    { id: 6, name: "한소영" },
    { id: 7, name: "윤태호" },
    { id: 8, name: "강미래" },
    { id: 9, name: "조현우" },
    { id: 10, name: "신예린" },
    { id: 11, name: "오준석" },
    { id: 12, name: "임하늘" },
  ],
});

// 최근 활동
const recentActivities = ref([
  {
    id: 1,
    user: "이지은",
    action: "토익 모의고사 완료",
    timeAgo: "15분 전",
  },
  {
    id: 2,
    user: "박준호",
    action: "단어 암기 100개 달성",
    timeAgo: "32분 전",
  },
  {
    id: 3,
    user: "최유진",
    action: "2시간 집중 학습 완료",
    timeAgo: "1시간 전",
  },
]);

// 멤버 색상 생성
const getMemberColor = (id) => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#eab308",
  ];
  return colors[id % colors.length];
};

// 시간 포맷팅
const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  }
};

// 초대 수락
const acceptInvite = async () => {
  isLoading.value = true;

  // 실제로는 API 호출
  await new Promise((resolve) => setTimeout(resolve, 2000));

  isLoading.value = false;
  showSuccessModal.value = true;
};

// 초대 거절
const declineInvite = () => {
  // 실제로는 이전 페이지로 이동하거나 홈으로 리다이렉트
  alert("초대를 거절했습니다.");
};

// 성공 모달 닫기
const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

// 스터디룸으로 이동
const goToStudyRoom = () => {
  // 실제로는 스터디룸 페이지로 라우팅
  alert("스터디룸으로 이동합니다!");
  showSuccessModal.value = false;
};

// 페이지 로드 시 애니메이션
onMounted(() => {
  // 카드 등장 애니메이션 등을 추가할 수 있음
});
</script>

<style scoped>
/* 커스텀 배경색 */
.bg-gray-750 {
  background-color: #374151;
}

.bg-gray-850 {
  background-color: #1f2937;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-gray-800 {
  animation: fadeIn 0.5s ease-out;
}

/* 호버 효과 */
.hover\:bg-green-700:hover {
  background-color: #15803d;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-gray-600:hover {
  background-color: #4b5563;
}

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
