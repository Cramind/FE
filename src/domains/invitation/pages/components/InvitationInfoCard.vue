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
        <!-- <div class="absolute -bottom-6 left-6">
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
        </div> -->
      </div>

      <!-- 온라인 상태 -->
      <div class="pt-8 px-6 pb-4">
        <div class="flex items-center gap-2 mb-2">
          <h1 class="text-white text-xl font-semibold">
            {{ teamInfo.teamName }}
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
            <span>{{ teamInfo.activeMemberCnt }} 명 접속 중</span>
          </div>
          <span class="text-gray-500">•</span>
          <span>{{ teamInfo.teamMemberCnt }} 명 참여</span>
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
            {{ teamInfo.invitor.charAt(0) }}
          </div>
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"
          ></div>
        </div>
        <div>
          <div class="text-gray-300 text-sm">
            <span class="text-white font-medium">{{ teamInfo.invitor }}</span
            >님이 초대했습니다
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
            {{
              teamInfo.teamDescription
                ? teamInfo.teamDescription
                : "팀 소개가 없습니다."
            }}
          </p>
        </div>
        <!-- 그룹 통계 -->
        <!-- <div>
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
        </div> -->

        <!-- 참여 중인 멤버들 -->
        <div>
          <h3 class="text-gray-300 text-sm font-medium mb-3">참여 멤버</h3>
          <div class="flex -space-x-2">
            <div
              v-for="(member, idx) in teamInfo.teamMembers.slice(0, 8)"
              :key="idx"
              class="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
              :style="{ backgroundColor: getMemberColor(idx) }"
              :title="member"
            >
              {{ member.charAt(0) }}
            </div>
            <div
              v-if="teamInfo.teamMembers.length > 8"
              class="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-gray-300 text-xs font-bold"
            >
              +{{ teamInfo.teamMembers.length - 8 }}
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
      </div>

      <div class="mt-4 text-center">
        <p class="text-gray-500 text-xs">초대 링크는 7일 후 만료됩니다</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/axios";

const route = useRoute();
const router = useRouter();

const inviteCode = route.query.code;
const teamInfo = ref({
  teamName: "",
  teamDescription: "",
  teamMemberCnt: 0,
  activeMemberCnt: 0,
  invitor: "",
  teamMembers: [],
});

const isLoading = ref(false);

onMounted(async () => {
  const teamInfoRes = await api.$get(`/api/team/info/${inviteCode}`);
  teamInfo.value = teamInfoRes.result;
});

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
  try {
    const res = await api.$post(`/api/teammembers/${inviteCode}`, null, {
      withCredentials: true,
    });
    router.push(`/team/${res.result}`);
  } catch {}
};
</script>

<style></style>
