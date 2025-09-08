<template>
  <div
    class="min-h-screen bg-background text-foreground"
    :class="isDark ? 'dark' : ''"
  >
    <!-- Header -->
    <div class="border-b border-border bg-card">
      <div
        class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <!-- 검색 -->
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <input
              v-model="searchQuery"
              placeholder="템플릿 검색..."
              class="pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring w-64"
            />
          </div>

          <!-- 테마 전환 -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <component
              :is="isDark ? 'Sun' : 'Moon'"
              class="w-5 h-5 text-muted-foreground"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- 카테고리 -->
      <div class="mb-8">
        <h2
          class="bg-gray-700 text-lg font-semibold text-gray-100 mb-6 px-4 py-2 rounded-lg"
        >
          카테고리
        </h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600',
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 템플릿 리스트 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="bg-gray-700 border border-gray-600 rounded-xl p-6 hover:shadow-lg hover:bg-gray-650 transition-all cursor-pointer group"
          @click="selectTemplate(template)"
        >
          <!-- 아이콘 + 카테고리 -->
          <div class="flex items-center justify-between mb-4">
            <div :class="['p-3 rounded-lg', template.iconBg]">
              <component
                :is="template.icon"
                :class="['w-6 h-6', template.iconColor]"
              />
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getCategoryStyle(template.category),
              ]"
            >
              {{ getCategoryName(template.category) }}
            </span>
          </div>

          <!-- 제목/설명 -->
          <h3
            class="text-lg font-semibold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors"
          >
            {{ template.title }}
          </h3>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">
            {{ template.description }}
          </p>

          <!-- 기능 태그 -->
          <div class="mb-4 flex flex-wrap gap-1">
            <span
              v-for="feature in template.features.slice(0, 3)"
              :key="feature"
              class="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
            >
              {{ feature }}
            </span>
            <span
              v-if="template.features.length > 3"
              class="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
            >
              +{{ template.features.length - 3 }}
            </span>
          </div>

          <!-- 하단 액션 -->
          <div
            class="flex items-center justify-between pt-4 border-t border-gray-600"
          >
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <Clock class="w-4 h-4" />
              <span>{{ template.estimatedTime }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="openTemplateModal(template)"
                class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <Eye class="w-4 h-4" />
              </button>
              <button
                @click.stop="selectTemplate(template)"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                사용하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-if="filteredTemplates.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FileText class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-100 mb-2">
          템플릿을 찾을 수 없습니다
        </h3>
        <p class="text-gray-400">다른 검색어나 카테고리를 시도해보세요.</p>
      </div>
    </div>

    <!-- 프리뷰 모달 -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-card rounded-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div
          class="flex items-center justify-between p-6 border-b border-border"
        >
          <div>
            <h2 class="text-xl font-semibold text-card-foreground">
              {{ previewTemplateRef?.title }}
            </h2>
            <p class="text-muted-foreground text-sm mt-1">템플릿 미리보기</p>
          </div>
          <button
            @click="closePreview"
            class="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <article
            class="prose prose-invert max-w-none prose-pre:border prose-pre:border-white/10 prose-code:text-sky-300"
          >
            <div v-html="compiledPreview"></div>
          </article>
        </div>

        <div
          class="flex items-center justify-end gap-3 p-6 border-t border-border"
        >
          <button
            @click="closePreview"
            class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            닫기
          </button>
          <button
            @click="useTemplate(previewTemplate)"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            이 템플릿 사용하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import MarkdownIt from "markdown-it";
import { useModalStore } from "@/stores/modalStore";
import DocumentModal from "./DocumentModal.vue";
import {
  Search,
  Sun,
  Moon,
  Clock,
  Eye,
  X,
  FileText,
  ClipboardList,
  Code,
  Book,
  Settings,
  Users,
  BarChart3,
  Shield,
  Zap,
  Target,
} from "lucide-vue-next";

// Theme management
const isDark = ref(false);
const md = new MarkdownIt({ linkify: true, breaks: false });

const modalStore = useModalStore();

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// Search and filtering
const searchQuery = ref("");
const selectedCategory = ref("all");

// Modal state
const showPreview = ref(false);
const previewTemplateRef = ref(null);

// Categories
const categories = [
  { id: "all", name: "전체" },
  { id: "requirements", name: "요구사항" },
  { id: "api", name: "API" },
  { id: "technical", name: "기술문서" },
  { id: "project", name: "프로젝트" },
  { id: "user", name: "사용자" },
];

// Document templates
const templates = [
  {
    id: 1,
    title: "요구사항 명세서",
    description:
      "프로젝트의 기능적/비기능적 요구사항을 체계적으로 정리하는 문서입니다.",
    category: "requirements",
    icon: ClipboardList,
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    features: ["기능 요구사항", "비기능 요구사항", "제약사항", "인수기준"],
    estimatedTime: "30-60분",
    content: `# 요구사항 명세서

## 1. 프로젝트 개요
### 1.1 프로젝트 목적
-

### 1.2 프로젝트 범위
-

### 1.3 용어 정의
| 용어 | 정의 |
|------|------|
|      |      |

## 2. 기능 요구사항
### 2.1 사용자 관리
- **FR-001**: 사용자 등록
  - 설명:
  - 우선순위: 높음
  - 인수기준:

### 2.2 [기능명]
- **FR-002**:
  - 설명:
  - 우선순위:
  - 인수기준:

## 3. 비기능 요구사항
### 3.1 성능 요구사항
- **NFR-001**: 응답시간
  - 설명:
  - 측정기준:

### 3.2 보안 요구사항
- **NFR-002**: 데이터 암호화
  - 설명:
  - 측정기준:

## 4. 제약사항
### 4.1 기술적 제약사항
-

### 4.2 비즈니스 제약사항
-

## 5. 가정사항
-

## 6. 의존성
-

## 7. 위험요소
| 위험요소 | 확률 | 영향도 | 대응방안 |
|----------|------|--------|----------|
|          |      |        |          |`,
  },
  {
    id: 2,
    title: "API 명세서",
    description:
      "RESTful API의 엔드포인트, 요청/응답 형식을 상세히 문서화합니다.",
    category: "api",
    icon: Code,
    iconBg: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    features: ["엔드포인트", "요청/응답", "인증", "에러코드"],
    estimatedTime: "45-90분",
    content: `# API 명세서

## 1. API 개요
### 1.1 기본 정보
- **Base URL**: \`https://api.example.com/v1\`
- **Protocol**: HTTPS
- **Content-Type**: application/json
- **Character Encoding**: UTF-8

### 1.2 인증
- **Type**: Bearer Token
- **Header**: \`Authorization: Bearer {token}\`

## 2. 공통 응답 형식
### 2.1 성공 응답
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success"
}
\`\`\`

### 2.2 에러 응답
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
\`\`\`

## 3. API 엔드포인트

### 3.1 사용자 관리
#### GET /users
사용자 목록을 조회합니다.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | integer | No | 페이지 번호 (기본값: 1) |
| limit | integer | No | 페이지 크기 (기본값: 10) |

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "홍길동",
        "email": "hong@example.com",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
\`\`\`

#### POST /users
새 사용자를 생성합니다.

**Request Body:**
\`\`\`json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

## 4. 에러 코드
| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | 잘못된 요청 |
| UNAUTHORIZED | 401 | 인증 실패 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| INTERNAL_ERROR | 500 | 서버 오류 |

## 5. 예제 코드
### JavaScript (Fetch)
\`\`\`javascript
const response = await fetch('https://api.example.com/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
\`\`\``,
  },
  {
    id: 3,
    title: "기술 문서",
    description:
      "시스템 아키텍처, 기술 스택, 개발 가이드라인을 포함한 기술 문서입니다.",
    category: "technical",
    icon: Book,
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    features: ["아키텍처", "기술스택", "개발가이드", "배포"],
    estimatedTime: "60-120분",
    content: `# 기술 문서

## 1. 시스템 개요
### 1.1 시스템 목적
-

### 1.2 시스템 범위
-

## 2. 시스템 아키텍처
### 2.1 전체 아키텍처
\`\`\`
[Frontend] -> [API Gateway] -> [Backend Services] -> [Database]
\`\`\`

### 2.2 컴포넌트 구성
- **Frontend**: React.js, TypeScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ

## 3. 기술 스택
### 3.1 Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.x | UI 프레임워크 |
| TypeScript | 5.x | 타입 시스템 |
| Tailwind CSS | 3.x | 스타일링 |

### 3.2 Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 20.x | 런타임 |
| Express | 4.x | 웹 프레임워크 |
| Prisma | 5.x | ORM |

### 3.3 Infrastructure
| 기술 | 버전 | 용도 |
|------|------|------|
| Docker | 24.x | 컨테이너화 |
| Kubernetes | 1.28 | 오케스트레이션 |
| AWS | - | 클라우드 플랫폼 |

## 4. 개발 환경 설정
### 4.1 필수 요구사항
- Node.js 20.x 이상
- Docker Desktop
- Git

### 4.2 로컬 개발 환경
\`\`\`bash
# 저장소 클론
git clone https://github.com/company/project.git
cd project

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env

# 개발 서버 실행
npm run dev
\`\`\`

## 5. 코딩 컨벤션
### 5.1 네이밍 규칙
- **변수/함수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **컴포넌트**: PascalCase
- **파일명**: kebab-case

### 5.2 코드 스타일
- ESLint + Prettier 사용
- 함수는 화살표 함수 우선
- 타입 정의는 interface 사용

## 6. 배포 가이드
### 6.1 빌드 프로세스
\`\`\`bash
# 프로덕션 빌드
npm run build

# Docker 이미지 빌드
docker build -t app:latest .
\`\`\`

### 6.2 배포 절차
1. 코드 리뷰 완료
2. 테스트 통과 확인
3. 스테이징 환경 배포
4. 프로덕션 배포

## 7. 모니터링 및 로깅
### 7.1 모니터링 도구
- **APM**: New Relic
- **로그**: ELK Stack
- **메트릭**: Prometheus + Grafana

### 7.2 알림 설정
- 에러율 5% 초과시 알림
- 응답시간 2초 초과시 알림
- 서버 다운시 즉시 알림`,
  },
  {
    id: 4,
    title: "프로젝트 계획서",
    description:
      "프로젝트의 목표, 일정, 리소스, 위험관리 계획을 포함한 종합 계획서입니다.",
    category: "project",
    icon: Target,
    iconBg: "bg-orange-100 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    features: ["목표설정", "일정관리", "리소스", "위험관리"],
    estimatedTime: "90-150분",
    content: `# 프로젝트 계획서

## 1. 프로젝트 개요
### 1.1 프로젝트 명
-

### 1.2 프로젝트 목적
-

### 1.3 프로젝트 목표
- **주요 목표**:
- **성공 기준**:
- **측정 지표**:

### 1.4 프로젝트 범위
#### 포함 사항
-

#### 제외 사항
-

## 2. 프로젝트 조직
### 2.1 프로젝트 팀
| 역할 | 이름 | 책임사항 |
|------|------|----------|
| PM | | 프로젝트 전체 관리 |
| 개발팀장 | | 개발 총괄 |
| 디자이너 | | UI/UX 설계 |

### 2.2 이해관계자
| 이해관계자 | 역할 | 관심사항 |
|------------|------|----------|
| | | |

## 3. 프로젝트 일정
### 3.1 주요 마일스톤
| 마일스톤 | 예정일 | 산출물 |
|----------|--------|--------|
| 요구사항 분석 완료 | 2024-XX-XX | 요구사항 명세서 |
| 설계 완료 | 2024-XX-XX | 시스템 설계서 |
| 개발 완료 | 2024-XX-XX | 소스코드 |
| 테스트 완료 | 2024-XX-XX | 테스트 보고서 |
| 배포 완료 | 2024-XX-XX | 운영 시스템 |

### 3.2 상세 일정
#### Phase 1: 분석 및 설계 (4주)
- Week 1-2: 요구사항 분석
- Week 3-4: 시스템 설계

#### Phase 2: 개발 (8주)
- Week 5-8: 백엔드 개발
- Week 9-12: 프론트엔드 개발

#### Phase 3: 테스트 및 배포 (2주)
- Week 13: 통합 테스트
- Week 14: 배포 및 운영 이관

## 4. 리소스 계획
### 4.1 인력 리소스
| 역할 | 인원 | 투입기간 | 비용 |
|------|------|----------|------|
| PM | 1명 | 14주 | |
| 개발자 | 3명 | 10주 | |
| 디자이너 | 1명 | 4주 | |

### 4.2 기술 리소스
| 항목 | 수량 | 비용 |
|------|------|------|
| 개발 서버 | 2대 | |
| 라이선스 | | |

## 5. 위험 관리
### 5.1 위험 요소
| 위험 | 확률 | 영향도 | 대응방안 |
|------|------|--------|----------|
| 요구사항 변경 | 중 | 높음 | 변경관리 프로세스 수립 |
| 핵심 인력 이탈 | 낮음 | 높음 | 백업 인력 확보 |
| 기술적 난이도 | 중 | 중 | POC 수행 |

### 5.2 위험 모니터링
- 주간 위험 검토 회의
- 위험 지표 추적
- 대응 계획 업데이트

## 6. 품질 관리
### 6.1 품질 기준
- 코드 커버리지 80% 이상
- 버그 밀도 1개/KLOC 이하
- 사용자 만족도 4.0/5.0 이상

### 6.2 품질 활동
- 코드 리뷰
- 단위 테스트
- 통합 테스트
- 사용자 테스트

## 7. 의사소통 계획
### 7.1 회의 계획
| 회의 | 주기 | 참석자 | 목적 |
|------|------|--------|------|
| 킥오프 미팅 | 1회 | 전체 | 프로젝트 시작 |
| 주간 회의 | 주 1회 | 팀원 | 진행상황 점검 |
| 월간 보고 | 월 1회 | 이해관계자 | 진행상황 보고 |

### 7.2 보고 체계
- 주간 진행 보고서
- 월간 대시보드
- 이슈 에스컬레이션`,
  },
  {
    id: 5,
    title: "사용자 매뉴얼",
    description:
      "최종 사용자를 위한 시스템 사용법과 문제해결 가이드를 제공합니다.",
    category: "user",
    icon: Users,
    iconBg: "bg-teal-100 dark:bg-teal-900/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    features: ["사용법", "스크린샷", "FAQ", "문제해결"],
    estimatedTime: "60-90분",
    content: `# 사용자 매뉴얼

## 1. 시작하기
### 1.1 시스템 요구사항
- **운영체제**: Windows 10 이상, macOS 10.15 이상
- **브라우저**: Chrome 90+, Firefox 88+, Safari 14+
- **인터넷 연결**: 필수

### 1.2 계정 생성
1. 홈페이지 접속: https://example.com
2. "회원가입" 버튼 클릭
3. 필수 정보 입력
   - 이메일 주소
   - 비밀번호 (8자 이상, 영문+숫자+특수문자)
   - 이름
4. 이메일 인증 완료

### 1.3 로그인
1. "로그인" 버튼 클릭
2. 이메일과 비밀번호 입력
3. "로그인" 버튼 클릭

## 2. 주요 기능 사용법
### 2.1 대시보드
로그인 후 첫 화면에서 다음 정보를 확인할 수 있습니다:
- 최근 활동 내역
- 중요 알림
- 빠른 액션 버튼

### 2.2 [기능명] 사용하기
#### 2.2.1 새 항목 생성
1. 좌측 메뉴에서 "[메뉴명]" 클릭
2. "새로 만들기" 버튼 클릭
3. 필수 정보 입력:
   - 제목
   - 설명
   - 카테고리 선택
4. "저장" 버튼 클릭

#### 2.2.2 항목 편집
1. 편집할 항목 클릭
2. "편집" 버튼 클릭
3. 정보 수정
4. "저장" 버튼 클릭

#### 2.2.3 항목 삭제
1. 삭제할 항목 선택
2. "삭제" 버튼 클릭
3. 확인 대화상자에서 "확인" 클릭

### 2.3 검색 기능
1. 상단 검색창에 키워드 입력
2. Enter 키 또는 검색 버튼 클릭
3. 검색 결과에서 원하는 항목 선택

### 2.4 필터 및 정렬
- **필터**: 좌측 필터 패널에서 조건 선택
- **정렬**: 목록 상단의 정렬 옵션 선택
  - 이름순
  - 날짜순
  - 인기순

## 3. 설정 관리
### 3.1 프로필 설정
1. 우상단 프로필 아이콘 클릭
2. "설정" 메뉴 선택
3. 개인정보 탭에서 정보 수정
4. "저장" 버튼 클릭

### 3.2 알림 설정
1. 설정 페이지의 "알림" 탭 클릭
2. 원하는 알림 유형 선택:
   - 이메일 알림
   - 브라우저 알림
   - SMS 알림
3. "저장" 버튼 클릭

### 3.3 보안 설정
1. 설정 페이지의 "보안" 탭 클릭
2. 비밀번호 변경:
   - 현재 비밀번호 입력
   - 새 비밀번호 입력
   - 새 비밀번호 확인
3. 2단계 인증 설정 (권장)

## 4. 문제해결
### 4.1 자주 묻는 질문 (FAQ)

**Q: 비밀번호를 잊어버렸어요.**
A: 로그인 페이지에서 "비밀번호 찾기"를 클릭하고 이메일 주소를 입력하세요. 비밀번호 재설정 링크가 이메일로 발송됩니다.

**Q: 파일 업로드가 안 돼요.**
A: 다음 사항을 확인해주세요:
- 파일 크기가 10MB 이하인지 확인
- 지원되는 파일 형식인지 확인 (jpg, png, pdf, docx)
- 브라우저를 새로고침 후 다시 시도

**Q: 데이터가 저장되지 않아요.**
A:
- 인터넷 연결 상태 확인
- 필수 입력 항목이 모두 채워졌는지 확인
- 브라우저 캐시 삭제 후 다시 시도

### 4.2 오류 메시지 해결
| 오류 메시지 | 원인 | 해결방법 |
|-------------|------|----------|
| "세션이 만료되었습니다" | 로그인 시간 초과 | 다시 로그인 |
| "권한이 없습니다" | 접근 권한 부족 | 관리자에게 문의 |
| "서버 오류" | 시스템 문제 | 잠시 후 다시 시도 |

### 4.3 브라우저별 문제
#### Chrome
- 쿠키 및 캐시 삭제: Ctrl+Shift+Delete
- 확장 프로그램 비활성화 후 테스트

#### Firefox
- 개인정보 보호 모드에서 테스트
- 쿠키 설정 확인

#### Safari
- 개발자 메뉴에서 캐시 비우기
- 팝업 차단 해제

## 5. 고객 지원
### 5.1 지원 채널
- **이메일**: support@example.com
- **전화**: 1588-0000 (평일 9:00-18:00)
- **채팅**: 웹사이트 우하단 채팅 버튼
- **FAQ**: https://example.com/faq

### 5.2 지원 요청시 필요 정보
- 사용자 계정 정보
- 발생한 문제 상세 설명
- 오류 메시지 스크린샷
- 사용 중인 브라우저 및 버전
- 문제 발생 시간

### 5.3 응답 시간
- **긴급**: 2시간 이내
- **높음**: 4시간 이내
- **보통**: 1영업일 이내
- **낮음**: 3영업일 이내`,
  },
  {
    id: 6,
    title: "테스트 계획서",
    description:
      "체계적인 테스트 전략과 테스트 케이스를 포함한 품질보증 문서입니다.",
    category: "technical",
    icon: Shield,
    iconBg: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    features: ["테스트전략", "테스트케이스", "자동화", "품질기준"],
    estimatedTime: "75-120분",
    content: `# 테스트 계획서

## 1. 테스트 개요
### 1.1 테스트 목적
- 시스템의 기능적/비기능적 요구사항 검증
- 품질 기준 달성 확인
- 릴리즈 준비 상태 평가

### 1.2 테스트 범위
#### 포함 사항
- 기능 테스트
- 통합 테스트
- 성능 테스트
- 보안 테스트
- 사용성 테스트

#### 제외 사항
- 써드파티 라이브러리 내부 테스트
- 운영체제 레벨 테스트

### 1.3 테스트 접근법
- 위험 기반 테스트
- 요구사항 기반 테스트
- 탐색적 테스트

## 2. 테스트 전략
### 2.1 테스트 레벨
#### Unit Testing (단위 테스트)
- **목적**: 개별 컴포넌트 검증
- **도구**: Jest, Mocha
- **커버리지**: 80% 이상
- **책임자**: 개발자

#### Integration Testing (통합 테스트)
- **목적**: 컴포넌트 간 인터페이스 검증
- **유형**: API 테스트, 데이터베이스 연동 테스트
- **도구**: Postman, Newman
- **책임자**: QA 엔지니어

#### System Testing (시스템 테스트)
- **목적**: 전체 시스템 기능 검증
- **유형**: 기능 테스트, 성능 테스트
- **도구**: Selenium, JMeter
- **책임자**: QA 팀

#### Acceptance Testing (인수 테스트)
- **목적**: 비즈니스 요구사항 충족 확인
- **유형**: 사용자 인수 테스트 (UAT)
- **책임자**: 비즈니스 사용자

### 2.2 테스트 유형
#### 기능 테스트
- 로그인/로그아웃
- 데이터 CRUD 작업
- 비즈니스 로직 검증
- 워크플로우 테스트

#### 비기능 테스트
- **성능 테스트**
  - 응답시간: 2초 이내
  - 동시 사용자: 1000명
  - 처리량: 100 TPS

- **보안 테스트**
  - 인증/인가 검증
  - SQL 인젝션 방어
  - XSS 방어
  - 데이터 암호화

- **사용성 테스트**
  - 사용자 인터페이스 직관성
  - 접근성 (WCAG 2.1 AA)
  - 모바일 반응형

## 3. 테스트 환경
### 3.1 환경 구성
| 환경 | 목적 | URL | 데이터 |
|------|------|-----|-------|
| 개발 | 개발자 테스트 | dev.example.com | 개발 데이터 |
| 스테이징 | QA 테스트 | staging.example.com | 실제 유사 데이터 |
| 프로덕션 | 운영 | www.example.com | 실제 데이터 |

### 3.2 테스트 데이터
#### 마스터 데이터
- 사용자 계정 (관리자, 일반사용자)
- 기준 정보 (코드, 카테고리)
- 샘플 데이터

#### 테스트 시나리오별 데이터
- 정상 케이스 데이터
- 경계값 데이터
- 예외 케이스 데이터

## 4. 테스트 케이스
### 4.1 사용자 관리 테스트
#### TC-001: 사용자 등록
- **전제조건**: 등록되지 않은 이메일 주소
- **테스트 단계**:
  1. 회원가입 페이지 접속
  2. 필수 정보 입력 (이메일, 비밀번호, 이름)
  3. "가입하기" 버튼 클릭
- **예상결과**:
  - 가입 성공 메시지 표시
  - 이메일 인증 메일 발송
  - 사용자 데이터베이스에 저장

#### TC-002: 사용자 로그인
- **전제조건**: 등록된 사용자 계정
- **테스트 단계**:
  1. 로그인 페이지 접속
  2. 이메일과 비밀번호 입력
  3. "로그인" 버튼 클릭
- **예상결과**:
  - 대시보드 페이지로 이동
  - 사용자 세션 생성
  - 로그인 상태 유지

### 4.2 API 테스트
#### TC-API-001: 사용자 목록 조회
\`\`\`
GET /api/users
Authorization: Bearer {token}

Expected Response:
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {...}
  }
}
\`\`\`

### 4.3 성능 테스트
#### TC-PERF-001: 로그인 응답시간
- **목표**: 평균 응답시간 2초 이내
- **부하**: 동시 사용자 100명
- **측정 항목**: 응답시간, 처리량, 에러율

## 5. 테스트 자동화
### 5.1 자동화 범위
- **Unit Tests**: 100% 자동화
- **API Tests**: 80% 자동화
- **UI Tests**: 주요 시나리오 50% 자동화
- **Performance Tests**: 100% 자동화

### 5.2 자동화 도구
| 테스트 유형 | 도구 | 용도 |
|-------------|------|------|
| Unit | Jest | JavaScript 단위 테스트 |
| API | Newman | Postman 컬렉션 실행 |
| UI | Selenium | 웹 UI 자동화 |
| Performance | JMeter | 성능 테스트 |

### 5.3 CI/CD 통합
\`\`\`yaml
# GitHub Actions 예시
name: Test Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Unit Tests
        run: npm test
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Run E2E Tests
        run: npm run test:e2e
\`\`\`

## 6. 결함 관리
### 6.1 결함 분류
| 심각도 | 설명 | 대응시간 |
|--------|------|----------|
| Critical | 시스템 중단 | 즉시 |
| High | 주요 기능 장애 | 4시간 |
| Medium | 일반 기능 오류 | 1일 |
| Low | 사소한 문제 | 1주 |

### 6.2 결함 라이프사이클
1. **발견**: 테스터가 결함 발견
2. **등록**: 결함 추적 시스템에 등록
3. **할당**: 개발자에게 할당
4. **수정**: 개발자가 수정
5. **검증**: 테스터가 수정 확인
6. **종료**: 결함 해결 완료

## 7. 테스트 일정
### 7.1 테스트 단계별 일정
| 단계 | 기간 | 담당자 | 산출물 |
|------|------|--------|--------|
| 테스트 계획 | 1주 | QA 리드 | 테스트 계획서 |
| 테스트 케이스 작성 | 2주 | QA 팀 | 테스트 케이스 |
| 테스트 환경 구축 | 1주 | DevOps | 테스트 환경 |
| 테스트 실행 | 3주 | QA 팀 | 테스트 결과 |
| 결함 수정 | 2주 | 개발팀 | 수정된 코드 |
| 재테스트 | 1주 | QA 팀 | 최종 테스트 보고서 |

### 7.2 마일스톤
- **M1**: 테스트 준비 완료 (Week 4)
- **M2**: 기능 테스트 완료 (Week 6)
- **M3**: 성능 테스트 완료 (Week 7)
- **M4**: 최종 테스트 완료 (Week 10)

## 8. 품질 기준
### 8.1 통과 기준
- 모든 Critical/High 결함 해결
- 테스트 케이스 통과율 95% 이상
- 코드 커버리지 80% 이상
- 성능 기준 달성

### 8.2 릴리즈 기준
- 사용자 인수 테스트 완료
- 보안 테스트 통과
- 성능 테스트 기준 달성
- 문서화 완료

## 9. 위험 요소
| 위험 | 확률 | 영향 | 대응방안 |
|------|------|------|----------|
| 테스트 환경 불안정 | 중 | 높음 | 백업 환경 준비 |
| 테스트 데이터 부족 | 낮음 | 중 | 데이터 생성 도구 개발 |
| 일정 지연 | 높음 | 높음 | 우선순위 기반 테스트 |

## 10. 보고 및 의사소통
### 10.1 테스트 보고서
- **일일 보고**: 테스트 진행률, 발견 결함
- **주간 보고**: 테스트 현황, 위험 요소
- **최종 보고**: 테스트 완료 보고서

### 10.2 의사소통 채널
- 일일 스탠드업 미팅
- 주간 테스트 리뷰 미팅
- 결함 트리아지 미팅`,
  },
];

const openTemplateModal = async (template2) => {
  const result = await modalStore.openModal(DocumentModal, {
    size: "modal-lg",
    template: template2,
  });
  if (result?.selected) {
    console.log("템플릿 선택됨 모달:", result.template);
  } else {
    console.log("취소됨");
  }
};
// Computed properties
const filteredTemplates = computed(() => {
  let filtered = templates;

  // Category filter
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (template) => template.category === selectedCategory.value
    );
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (template) =>
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.features.some((feature) =>
          feature.toLowerCase().includes(query)
        )
    );
  }

  return filtered;
});

// Methods
const getCategoryName = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

const getCategoryStyle = (categoryId) => {
  const styles = {
    requirements:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    api: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    technical:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    project:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    user: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
  };
  return (
    styles[categoryId] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  );
};

const selectTemplate = (template) => {
  // Emit event to parent component or handle template selection
  console.log("[v0] Template selected:", template.title);
  // This would typically emit an event or call a callback
  // emit('template-selected', template)
};

const previewTemplate = (template) => {
  previewTemplateRef.value = template;
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
  previewTemplateRef.value = null;
};

const useTemplate = (template) => {
  closePreview();
  selectTemplate(template);
};

const compiledPreview = computed(() =>
  previewTemplateRef.value?.content
    ? md.render(previewTemplateRef.value.content)
    : ""
);
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Prose styles for template preview */
/* 프리뷰 타이포 최소 스타일 (fallback) */
.prose :where(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1rem;
}
.prose :where(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
}
.prose :where(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0.75rem;
}
.prose :where(p, ul, ol, table, pre) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.prose :where(code) {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: #0b1220;
}
.prose :where(pre) {
  background: #0b1220;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow: auto;
}
.prose :where(table) {
  border-collapse: collapse;
  width: 100%;
}
.prose :where(th, td) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.5rem 0.75rem;
}
</style>
