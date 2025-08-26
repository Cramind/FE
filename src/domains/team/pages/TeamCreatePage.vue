<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">새 팀 만들기</h1>
        <p class="text-gray-600">팀을 설정하고 협업을 시작하세요</p>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center"
            :class="{ 'flex-1': index < steps.length - 1 }"
          >
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                :class="[
                  currentStep > index
                    ? 'bg-green-500 text-white'
                    : currentStep === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600',
                ]"
              >
                <CheckIcon v-if="currentStep > index" class="w-4 h-4" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span
                class="ml-2 text-sm font-medium text-gray-700 hidden sm:block"
              >
                {{ step.title }}
              </span>
            </div>
            <div
              v-if="index < steps.length - 1"
              class="flex-1 h-0.5 mx-4"
              :class="currentStep > index ? 'bg-green-500' : 'bg-gray-300'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 0" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >팀 이름</label
            >
            <input
              v-model="formData.teamName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: 개발팀, 마케팅팀"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >팀 설명</label
            >
            <textarea
              v-model="formData.teamDescription"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="팀의 목적과 역할을 간단히 설명해주세요"
            ></textarea>
          </div>
        </div>

        <!-- Step 2: Organization Integration -->
        <div v-if="currentStep === 1" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">조직 연동</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="org in organizations"
              :key="org.id"
              class="border rounded-lg p-4 cursor-pointer transition-all"
              :class="[
                formData.selectedOrganization === org.login
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
              @click="selectOrganization(org.login)"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <img
                    :src="
                      org.avatar_url ||
                      `/placeholder.svg?height=32&width=32&text=${(org.login,
                      'U')
                        .charAt(0)
                        .toUpperCase()}`
                    "
                  />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">
                    {{ org.login }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: GitHub Repository -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            GitHub 레포지토리
          </h2>

          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <input
                id="createRepo"
                v-model="formData.createGithubRepo"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="createRepo" class="text-sm font-medium text-gray-700">
                새 GitHub 레포지토리 생성
              </label>
            </div>

            <div v-if="formData.createGithubRepo" class="space-y-4 pl-7">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >레포지토리 이름</label
                >
                <input
                  v-model="formData.repoName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: team-project"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >레포지토리 설명</label
                >
                <input
                  v-model="formData.repoDescription"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="레포지토리에 대한 간단한 설명"
                />
              </div>

              <div class="flex items-center space-x-6">
                <div class="flex items-center space-x-2">
                  <input
                    id="public"
                    v-model="formData.repoVisibility"
                    type="radio"
                    value="false"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label for="public" class="text-sm text-gray-700">공개</label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    id="private"
                    v-model="formData.repoVisibility"
                    type="radio"
                    value="true"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label for="private" class="text-sm text-gray-700"
                    >비공개</label
                  >
                </div>
              </div>
            </div>

            <div v-if="!formData.createGithubRepo" class="pl-7">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >기존 레포지토리 URL</label
                >
                <input
                  v-model="formData.existingRepoUrl"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/repository"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Template Selection -->
        <div v-if="currentStep === 3" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Bug 템플릿</h2>

          <div class="border rounded-lg p-6">
            <label
              for="templateFile"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Bug 템플릿 파일 업로드 (.md)
            </label>

            <input
              id="templateFile"
              type="file"
              class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              @change="handleBugTemplate"
            />

            <div v-if="bugTemplate" class="mt-4 text-sm text-gray-600">
              선택된 파일:
              <strong>{{ bugTemplate.name }}</strong>
            </div>
          </div>

          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Feature 템플릿
          </h2>

          <div class="border rounded-lg p-6">
            <label
              for="templateFile"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Feature 템플릿 업로드 (.md)
            </label>

            <input
              id="templateFile"
              type="file"
              class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              @change="handleFeatureTemplate"
            />

            <div v-if="featTemplate" class="mt-4 text-sm text-gray-600">
              선택된 파일:
              <strong>{{ featTemplate.name }}</strong>
            </div>
          </div>
        </div>

        <!-- Step 6: Initial Settings -->
        <div v-if="currentStep === 4" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">초기 설정</h2>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 class="font-medium text-gray-900">이슈 트래킹</h3>
                <p class="text-sm text-gray-600">
                  GitHub Issues를 활성화합니다
                </p>
              </div>
              <input
                v-model="formData.settings.enableIssues"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 class="font-medium text-gray-900">위키</h3>
                <p class="text-sm text-gray-600">
                  프로젝트 문서화를 위한 위키를 활성화합니다
                </p>
              </div>
              <input
                v-model="formData.settings.enableWiki"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 class="font-medium text-gray-900">프로젝트 보드</h3>
                <p class="text-sm text-gray-600">
                  칸반 스타일의 프로젝트 관리 보드를 생성합니다
                </p>
              </div>
              <input
                v-model="formData.settings.enableProjects"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 class="font-medium text-gray-900">자동 배포</h3>
                <p class="text-sm text-gray-600">
                  GitHub Actions를 통한 CI/CD 파이프라인을 설정합니다
                </p>
              </div>
              <input
                v-model="formData.settings.enableCICD"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >추가 설정</label
            >
            <textarea
              v-model="formData.additionalNotes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="추가로 필요한 설정이나 요청사항을 입력하세요"
            ></textarea>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-6 border-t">
          <button
            v-if="currentStep > 0"
            type="button"
            @click="previousStep"
            class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            <span>이전</span>
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            @click="nextStep"
            :disabled="!canProceed"
            class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>다음</span>
            <ChevronRightIcon class="w-4 h-4" />
          </button>
          <button
            v-else
            type="button"
            @click="createTeam"
            :disabled="!canProceed"
            class="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>팀 생성</span>
            <CheckIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import { api } from "@/axios";

const currentStep = ref(0);
const organizations = ref([]);
const templateFiles = ref([]);

watch(currentStep, async (newVal) => {
  if (newVal === 1) {
    const orgRes = await api.$get("/api/todo/org");
    console.log(orgRes);
    organizations.value = orgRes.result;
  }
  console.log(organizations.value);
});

const showNewOrgForm = ref(false);

const steps = [
  { title: "기본 정보" },
  { title: "조직 연동" },
  { title: "GitHub 설정" },
  { title: "템플릿 선택" },
  { title: "초기 설정" },
];

const formData = reactive({
  teamName: "",
  teamDescription: "",
  selectedOrganization: "",
  createGithubRepo: true,
  repoName: "",
  repoDescription: "",
  repoVisibility: "true",
  existingRepoUrl: "",
  settings: {
    enableIssues: true,
    enableWiki: false,
    enableProjects: true,
    enableCICD: false,
  },
  additionalNotes: "",
});

watch(formData, (newVal, oldVal) => {
  console.log("변경됨:", oldVal, "→", newVal);
});
const newOrganization = ref({
  name: "",
  domain: "",
});

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return formData.teamName.trim() !== "" && formData.teamType !== "";
    case 1:
      return formData.selectedOrganization !== "";
    case 2:
      if (formData.createGithubRepo) {
        return (
          formData.repoName.trim() !== "" && formData.repoVisibility !== ""
        );
      }
      return formData.existingRepoUrl.trim() !== "";
    case 3:
    case 4:
      return true;
    default:
      return false;
  }
});

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const addMember = () => {
  formData.inviteMembers.push({ email: "", role: "member" });
};

const removeMember = (index) => {
  if (formData.inviteMembers.length > 1) {
    formData.inviteMembers.splice(index, 1);
  }
};

const createOrganization = () => {
  if (newOrganization.value.name.trim()) {
    const newOrg = {
      id: Date.now().toString(),
      name: newOrganization.value.name,
      members: 1,
    };
    organizations.value.push(newOrg);
    formData.selectedOrganization = newOrg.id;
    newOrganization.value = { name: "", domain: "" };
    showNewOrgForm.value = false;
  }
};

const selectOrganization = (org) => {
  formData.selectedOrganization = org;
};

const handleBugTemplate = (event) => {
  const file = event.target?.files?.[0];
  if (file) {
    templateFiles.value.push({
      file: file,
      category: "bug",
    });
    console.log("선택된 파일:", file.name);
  }
};

const handleFeatureTemplate = (event) => {
  const file = event.target?.files?.[0];
  if (file) {
    templateFiles.value.push({
      file: file,
      category: "feat",
    });
  }
};

const createTeam = async () => {
  alert("팀이 성공적으로 생성되었습니다!");

  const teamCreateDto = {
    teamName: formData.teamName?.trim() ?? "",
    teamDescription: formData.teamDescription?.trim() ?? "",
    selectedOrganization: formData.selectedOrganization?.trim() ?? "",
  };

  await api.$post("/api/team", teamCreateDto, { withCredentials: true });

  console.log(templateFiles.value);
  await api.$post("/api/todo/org/repo", {
    orgName: formData.selectedOrganization,
    repoName: formData.repoName,
    isPrivate: formData.repoVisibility,
  });

  const form = new FormData();

  // 파일과 메타데이터를 배열에 저장
  const metadataArray = [];

  templateFiles.value.forEach((template) => {
    form.append("files", template.file);
    metadataArray.push({
      category: template.category,
      fileName: template.file.name,
      owner: formData.selectedOrganization,
      repo: formData.repoName,
    });
  });

  // metadataList를 JSON 배열로 한 번에 append
  form.append(
    "metadataList",
    new Blob([JSON.stringify(metadataArray)], {
      type: "application/json",
    })
  );

  await api.$post("/api/todo/org/repo/template", form);
  await api.$post(`/api/todo/org/invite/${formData.selectedOrganization}`, {
    email: formData.inviteMembers.map((m) => m.email),
  });
};
</script>
