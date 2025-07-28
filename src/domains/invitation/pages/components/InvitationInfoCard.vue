<template>
  <div
    class="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
  >
    <!-- 헤더 -->
    <div class="relative">
      <!-- 배너 이미지 -->
      <div
        class="h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative"
      >
        <div class="absolute inset-0 bg-black/20"></div>
        <!-- 그룹 아바타 -->
        <div class="absolute -bottom-6 left-6">
          <div
            class="w-16 h-16 bg-blue-500 rounded-full border-4 border-gray-800 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 온라인 상태 -->
      <div class="pt-8 px-6 pb-4">
        <div class="flex items-center gap-2 mb-2">
          <h1 class="text-white text-xl font-semibold">
            {{ groupInfo.name }}
          </h1>
          <svg
            class="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-300">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{{ groupInfo.onlineMembers }} 명 접속 중</span>
          </div>
          <span class="text-gray-500">•</span>
          <span>{{ groupInfo.totalMembers }} 명 참여</span>
        </div>
      </div>
    </div>

    <!-- 초대자 정보 -->
    <div class="px-6 py-4 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div
            class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold"
          >
            {{ inviter.name.charAt(0) }}
          </div>
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"
          ></div>
        </div>
        <div>
          <div class="text-gray-300 text-sm">
            <span class="text-white font-medium">{{ inviter.name }}</span
            >님이 초대했습니다
          </div>
          <div class="text-gray-400 text-xs">
            {{ formatTime(inviter.invitedAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 그룹 정보 -->
    <div class="px-6 py-4">
      <div class="space-y-4">
        <!-- 그룹 설명 -->
        <div>
          <h3 class="text-gray-300 text-sm font-medium mb-2">그룹 소개</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            {{ groupInfo.description }}
          </p>
        </div>

        <!-- 현재 활동 -->
        <div>
          <h3 class="text-gray-300 text-sm font-medium mb-3">현재 활동</h3>
          <div class="space-y-2">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center gap-3 p-2 bg-gray-750 rounded"
            >
              <div
                class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {{ activity.user.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-gray-300 text-sm">
                  <span class="font-medium">{{ activity.user }}</span>
                  <span class="text-gray-400 ml-1">{{ activity.action }}</span>
                </div>
                <div class="text-gray-500 text-xs">
                  {{ activity.timeAgo }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 그룹 통계 -->
        <div>
          <h3 class="text-gray-300 text-sm font-medium mb-3">그룹 통계</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-750 rounded p-3 text-center">
              <div class="text-white text-lg font-bold">
                {{ groupInfo.totalStudyTime }}
              </div>
              <div class="text-gray-400 text-xs">총 학습시간</div>
            </div>
            <div class="bg-gray-750 rounded p-3 text-center">
              <div class="text-white text-lg font-bold">
                {{ groupInfo.averageDaily }}
              </div>
              <div class="text-gray-400 text-xs">일평균 학습</div>
            </div>
          </div>
        </div>

        <!-- 참여 중인 멤버들 -->
        <div>
          <h3 class="text-gray-300 text-sm font-medium mb-3">참여 멤버</h3>
          <div class="flex -space-x-2">
            <div
              v-for="member in groupInfo.members.slice(0, 8)"
              :key="member.id"
              class="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
              :style="{ backgroundColor: getMemberColor(member.id) }"
              :title="member.name"
            >
              {{ member.name.charAt(0) }}
            </div>
            <div
              v-if="groupInfo.members.length > 8"
              class="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-gray-300 text-xs font-bold"
            >
              +{{ groupInfo.members.length - 8 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 액션 버튼들 -->
    <div class="px-6 py-4 bg-gray-750">
      <div class="space-y-3">
        <button
          @click="acceptInvite"
          :disabled="isLoading"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <svg
            v-if="!isLoading"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <div
            v-else
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
          {{ isLoading ? "참여 중..." : "그룹 참여하기" }}
        </button>

        <button
          @click="declineInvite"
          :disabled="isLoading"
          class="w-full bg-transparent hover:bg-gray-600 disabled:opacity-50 text-gray-300 font-medium py-3 px-4 rounded border border-gray-600 transition-colors"
        >
          나중에 하기
        </button>
      </div>

      <div class="mt-4 text-center">
        <p class="text-gray-500 text-xs">초대 링크는 7일 후 만료됩니다</p>
      </div>
    </div>
  </div>

  <!-- 성공 모달 -->
  <div
    v-if="showSuccessModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    @click="closeSuccessModal"
  >
    <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full" @click.stop>
      <div class="text-center">
        <div
          class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3 class="text-white text-lg font-semibold mb-2">참여 완료!</h3>
        <p class="text-gray-400 text-sm mb-4">
          {{ groupInfo.name }}에 성공적으로 참여했습니다.
        </p>
        <button
          @click="goToStudyRoom"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          스터디룸 입장하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
</script>

<style></style>
