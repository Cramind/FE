<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          팀 관리
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          팀을 생성하고 멤버를 관리하세요
        </p>
      </div>
      <button
        @click="showCreateTeamModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        새 팀 생성
      </button>
    </div>

    <!-- Teams List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="team in teams"
        :key="team.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ team.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ team.description }}
              </p>
            </div>
            <span
              class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded"
            >
              {{ team.members.length }} 멤버
            </span>
          </div>
        </div>
        <div class="p-6">
          <!-- Team Members -->
          <div class="space-y-3 mb-4">
            <div
              v-for="member in team.members"
              :key="member.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="member.avatar"
                  :alt="member.email"
                  class="h-8 w-8 rounded-full"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ member.email }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ member.status === "pending" ? "초대 대기중" : "활성" }}
                  </p>
                </div>
              </div>
              <button
                @click="removeMemberFromTeam(team.id, member.id)"
                class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Add Member -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex space-x-2">
              <input
                v-model="newMemberEmail[team.id]"
                type="email"
                placeholder="이메일 주소"
                class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                @click="inviteMemberToTeam(team.id)"
                class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                초대
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="teams.length === 0" class="col-span-2 text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          팀이 없습니다
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          첫 번째 팀을 생성해보세요.
        </p>
      </div>
    </div>

    <!-- Create Team Modal -->
    <div
      v-if="showCreateTeamModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            새 팀 생성
          </h3>
        </div>
        <form @submit.prevent="createNewTeam" class="p-6 space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >팀 이름</label
            >
            <input
              v-model="newTeam.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Frontend Team"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >설명</label
            >
            <textarea
              v-model="newTeam.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="프론트엔드 개발을 담당하는 팀"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showCreateTeamModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  teams: Array,
  selectedOrg: Object,
});

const emit = defineEmits(["create-team", "invite-member", "remove-member"]);

const showCreateTeamModal = ref(false);
const newMemberEmail = reactive({});

const newTeam = reactive({
  name: "",
  description: "",
});

const createNewTeam = () => {
  emit("create-team", { ...newTeam });
  Object.assign(newTeam, {
    name: "",
    description: "",
  });
  showCreateTeamModal.value = false;
};

const inviteMemberToTeam = (teamId) => {
  const email = newMemberEmail[teamId];
  if (email && email.trim()) {
    emit("invite-member", teamId, email.trim());
    newMemberEmail[teamId] = "";
  }
};

const removeMemberFromTeam = (teamId, memberId) => {
  if (confirm("정말로 이 멤버를 팀에서 제거하시겠습니까?")) {
    emit("remove-member", teamId, memberId);
  }
};
</script>
