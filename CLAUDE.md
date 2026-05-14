# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js와 Supabase를 활용한 풀스택 웹 애플리케이션 스타터 키트입니다. App Router 기반으로 구성되었으며, 쿠키 기반 인증 및 서버 컴포넌트를 지원합니다.

## 기술 스택

- **프레임워크**: Next.js 15+ (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: shadcn/ui (Radix UI 기반)
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (SSR 쿠키 기반)
- **아이콘**: Lucide React
- **테마**: next-themes (다크 모드 지원)

## 프로젝트 구조

```
nextjs-supabase-app/
├── app/                        # Next.js App Router
│   ├── auth/                   # 인증 관련 페이지
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── update-password/
│   │   └── error/
│   ├── protected/              # 인증 필요 페이지
│   ├── instruments/            # 대시보드 페이지
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 홈페이지
│   └── globals.css            # 전역 스타일
├── components/                 # React 컴포넌트
│   ├── ui/                    # shadcn/ui 컴포넌트
│   ├── auth-button.tsx        # 인증 상태 버튼
│   ├── login-form.tsx         # 로그인 폼
│   ├── sign-up-form.tsx       # 회원가입 폼
│   ├── profile-form.tsx       # 프로필 폼
│   ├── theme-switcher.tsx     # 테마 전환기
│   └── tutorial/              # 튜토리얼 컴포넌트
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # 브라우저 Supabase 클라이언트
│   │   ├── server.ts          # 서버 Supabase 클라이언트
│   │   └── proxy.ts           # 인증 프록시
│   └── utils.ts               # 유틸리티 함수
├── components.json             # shadcn/ui 설정
├── tailwind.config.ts         # Tailwind CSS 설정
├── tsconfig.json              # TypeScript 설정
└── next.config.ts             # Next.js 설정
```

## 핵심 아키텍처 패턴

### Supabase 클라이언트 분리

프로젝트는 **클라이언트**와 **서버** 환경을 위한 별도의 Supabase 클라이언트를 제공합니다:

- **`lib/supabase/client.ts`**: 브라우저에서 실행되는 클라이언트 컴포넌트용. `createBrowserClient` 사용
- **`lib/supabase/server.ts`**: 서버 컴포넌트 및 Route Handler용. `createServerClient` 사용하며, 쿠키를 통해 세션 관리

**중요**: 서버 클라이언트는 **함수 내에서만 생성**해야 하며, 전역 변수로 저장하면 안 됩니다. (Fluid Compute 환경에서의 메모리 누수 방지)

### 인증 흐름

1. 사용자가 회원가입/로그인
2. Supabase가 쿠키에 세션 저장
3. 서버 컴포넌트에서 쿠키를 통해 세션 확인
4. 프로텍트된 페이지(`app/protected/`)는 인증 필요

### 라우트 및 레이아웃 구조

```
app/
├── page.tsx                 # 홈페이지 (인증 필요 없음)
├── auth/
│   ├── login/              # 로그인 페이지
│   ├── sign-up/            # 회원가입 페이지
│   ├── sign-up-success/    # 회원가입 성공 페이지
│   ├── forgot-password/    # 비밀번호 재설정 요청
│   ├── update-password/    # 비밀번호 변경
│   └── error/              # 인증 오류 페이지
├── protected/
│   ├── layout.tsx          # 인증 필요 레이아웃 (미들웨어)
│   └── page.tsx            # 대시보드 (인증된 사용자만 접근)
└── instruments/            # 대시보드 페이지 (인증 필요)
```

**protected 레이아웃**: `app/protected/layout.tsx`는 서버 컴포넌트에서 세션을 확인하여 미인증 사용자를 로그인 페이지로 리다이렉트합니다.

### 환경 변수

프로젝트는 다음의 공개 환경 변수를 요구합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

이 값들은 Supabase 대시보드 > 프로젝트 설정 > API에서 확인할 수 있습니다.

## 주요 명령어

### 개발 및 빌드
```bash
# 개발 서버 시작 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 시작
npm start
```

### 코드 품질
```bash
# ESLint 체크
npm run lint

# ESLint 자동 수정
npm run lint:fix

# Prettier 포맷팅
npm run format

# Prettier 포맷 체크
npm run format:check

# TypeScript 타입 체크
npm run type-check
```

**참고**: Git 커밋 시 Husky 및 lint-staged가 자동으로 TypeScript 타입 체크와 ESLint/Prettier를 실행합니다.

### 커밋 메시지 컨벤션

Conventional Commits 규칙 (commitlint 자동 검증):

```
<type>(<scope>): <subject>

feat(auth): 구글 로그인 추가
fix(components): 폼 검증 오류 수정
refactor(lib): Supabase 클라이언트 로직 정리
docs(readme): 설치 가이드 업데이트
```

**지원 타입**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `ci`

**커밋이 실패하면**:
```bash
# 변경사항 확인
npm run type-check
npm run lint
npm run format

# 다시 커밋
git add .
git commit -m "feat: 설명"
```

## shadcn/ui 컴포넌트

### 새 컴포넌트 추가

```bash
npx shadcn-ui@latest add [component-name]
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

### 경로 설정 (components.json)
- `@/components/ui`: shadcn/ui 컴포넌트 자동 설치 경로
- `@/components`: 커스텀 컴포넌트 루트
- `@/lib`: 유틸리티 함수
- `@/hooks`: React 커스텀 훅

### 스타일 커스터마이징
- shadcn/ui 컴포넌트는 `components/ui/` 디렉토리의 individual `.tsx` 파일
- 스타일 변경 시 해당 파일을 직접 수정하세요 (업스트림 변경에 영향 없음)
- 색상은 `tailwind.config.ts`의 theme 변수를 사용합니다

## 개발 워크플로우

### TypeScript 규칙
- **Strict 모드 활성화**: `tsconfig.json`의 `strict: true` 설정으로 타입 안전성 강제
- **경로 알리아스**: `@/` 접두어로 절대 경로 사용 (`@/components`, `@/lib` 등)
- **타입 체크**: 커밋 전 `npm run type-check` 실행

### ESLint 및 Prettier
- **ESLint**: Next.js 권장 규칙 + TypeScript ESLint 플러그인
- **Prettier**: Tailwind CSS 플러그인으로 클래스 자동 정렬
- **자동 포맷팅**: Husky 훅이 커밋 시 lint-staged를 실행하여 변경 파일 자동 포맷

## 개발 시 주의사항

### 서버 컴포넌트 vs 클라이언트 컴포넌트

- 기본값은 **서버 컴포넌트**입니다
- `"use client"` 지시문이 필요한 경우만 클라이언트 컴포넌트로 변환
- 상호작용이 필요한 부분(폼, 이벤트 리스너)만 클라이언트 컴포넌트로 만듭니다

### Supabase 클라이언트 생성

**서버 컴포넌트 또는 Route Handler:**
```typescript
import { createClient } from "@/lib/supabase/server";

export async function someServerAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("table").select();
  // 사용
}
```

**클라이언트 컴포넌트** (`"use client"`):
```typescript
import { createClient } from "@/lib/supabase/client";

export function SomeComponent() {
  const supabase = createClient();
  // 사용
}
```

**중요**: 서버 클라이언트는 반드시 **함수 내에서 생성**하세요. 전역 변수로 선언하면 메모리 누수 및 세션 혼용 문제가 발생할 수 있습니다.

### 라우트 보호 (Protected Routes)

`app/protected/layout.tsx`에서 사용자 세션을 확인:

```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
```

이 패턴으로 `app/protected/*` 하의 모든 페이지는 인증이 필수입니다.

### CSS 스타일링

- **Tailwind CSS**: 유틸리티 우선 방식
- **CSS 변수**: `app/globals.css`에서 다크 모드 색상 정의
- **커스텀 색상**: `tailwind.config.ts`의 `extend.colors`에만 추가
- **클래스 정렬**: Prettier의 Tailwind 플러그인이 자동 정렬 (커밋 시)

## 환경 변수 설정

### 필수 환경 변수 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- `NEXT_PUBLIC_*`: 클라이언트에서 접근 가능한 공개 변수
- `.env.local`에서만 관리 (Git에 커밋하지 않음)
- Supabase 대시보드 > 프로젝트 설정 > API에서 확인 가능

## 배포

### Vercel 배포

프로젝트는 Vercel 배포에 최적화되었습니다:

```bash
npm i -g vercel
vercel
```

**Supabase 통합 자동 환경 변수 설정:**
1. Vercel 대시보드 > 프로젝트 > Integrations
2. Supabase 마켓플레이스 통합 추가
3. 환경 변수 자동 할당

**수동 환경 변수 설정:**
- Vercel 대시보드 > Settings > Environment Variables
- 동일한 키와 값 입력

### 로컬 Supabase 개발 (선택사항)

```bash
# Supabase CLI 설치
npm i -D supabase

# 로컬 스택 시작 (Docker 필요)
supabase start

# 로컬 URL 및 키는 terminal 출력 확인
# .env.local 업데이트

# 마이그레이션 생성
supabase migration new add_users_table

# 마이그레이션 적용
supabase migration up
```

**로컬 개발 팁**: `supabase start` 후 Supabase Studio (localhost:54323)에서 데이터베이스 관리 가능

## 커스타마이제이션 가이드

### 테마 변경

`tailwind.config.ts`와 `app/globals.css`에서 CSS 변수를 수정합니다.

### UI 스타일 변경

shadcn/ui 스타일은 `components.json`에서 설정할 수 있습니다. 다른 스타일로 변경하려면:

```bash
rm components.json
npx shadcn-ui@latest init
```

### 인증 커스터마이징

- Supabase 인증 설정: https://supabase.com/docs/guides/auth
- RLS 정책 설정: https://supabase.com/docs/guides/auth/row-level-security

## 성능 최적화

### Next.js 기능
- **Caching Components**: `next.config.ts`의 `cacheComponents: true` 활성화 (Cache 컴포넌트 사용)
- **Dynamic Imports**: 큰 컴포넌트는 `dynamic()` 함수로 lazy loading
- **Image Optimization**: `next/image`로 이미지 자동 최적화

### 데이터 페칭
- **Server Components**: Supabase 쿼리는 서버 컴포넌트에서 (클라이언트 번들 감소)
- **Revalidation**: ISR 또는 on-demand revalidation 활용
- **캐싱**: 자주 변경되지 않는 데이터는 캐시 설정

## 문제 해결

### 환경 변수 오류
```
Error: NEXT_PUBLIC_SUPABASE_URL is required
```
- `.env.local` 파일 존재 확인
- Supabase 대시보드에서 올바른 값 복사
- Vercel 배포 시 환경 변수 동일하게 설정

### TypeScript 오류
```bash
npm run type-check
```
- 타입 오류 상세 확인 가능
- ESLint 경고도 함께 확인 (`npm run lint`)

### 쿠키 관련 문제
- 서버 컴포넌트의 쿠키 접근: `lib/supabase/server.ts` 참고
- 클라이언트 컴포넌트에서 쿠키 읽기 불가능 (서버 액션 사용)

### 빌드 실패

의존성 최신화:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

Next.js 캐시 초기화:
```bash
rm -rf .next
npm run build
```

### 인증 토큰 만료
- 서버 컴포넌트는 쿠키의 세션 토큰 자동 갱신
- Route Handler에서 수동 갱신: Supabase SSR 패키지의 `getSession()` 사용

## 데이터베이스 및 인증

### Supabase 테이블 작업

**데이터베이스 테이블 생성** (Supabase Dashboard):
1. Supabase 대시보드 > SQL Editor
2. 새 쿼리 작성
3. 마이그레이션이 필요한 경우 로컬에서 `supabase migration new`로 관리

**RLS (Row Level Security) 정책**:
```sql
-- 예: users 테이블은 자신의 데이터만 조회 가능
create policy "Users can view own data"
on users
for select
using (auth.uid() = id);
```

### 인증 설정

**이메일 인증** (기본):
- Supabase가 회원가입/로그인 이메일 자동 전송

**소셜 로그인** (Google, GitHub 등):
1. Supabase Dashboard > Authentication > Providers
2. 소셜 플랫폼에서 OAuth 설정 (클라이언트 ID, 시크릿)
3. 대시보드에 입력

프로젝트에 `google-login-button.tsx` 컴포넌트 예제 있음.

## 일반적인 개발 패턴

### 새 페이지 추가
```
app/new-feature/
├── page.tsx           # 서버 컴포넌트
├── layout.tsx         # 해당 경로 레이아웃
└── client-component.tsx  # 필요시 클라이언트 컴포넌트
```

### 새 API Route 추가
```
app/api/endpoint/route.ts
```

```typescript
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("table").select();
  
  if (error) return Response.json({ error }, { status: 400 });
  return Response.json(data);
}
```

### 폼 컴포넌트 만들기
```typescript
"use client";

import { useState } from "react";

export function MyForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    // 서버 액션 또는 API 호출
    setLoading(false);
  }

  return (
    <form action={handleSubmit}>
      {/* 폼 필드 */}
    </form>
  );
}
```

### 서버 액션 사용
```typescript
// app/actions.ts
"use server";

export async function updateUser(formData: FormData) {
  const supabase = await createClient();
  // 데이터베이스 업데이트
}
```

```typescript
// 컴포넌트에서 사용
import { updateUser } from "@/app/actions";

export function EditForm() {
  return <form action={updateUser}>{/* ... */}</form>;
}
```

## 커스터마이징

### 환경별 설정
- `.env.local`: 로컬 개발
- `.env.production`: 프로덕션 (Vercel에서 관리)
- 빌드 시 `NEXT_PUBLIC_*` 변수만 포함

### 개발자 경험 개선
- **VSCode Extension**: ESLint, Prettier, Tailwind CSS IntelliSense 설치
- **Git Hooks**: Husky가 자동으로 커밋 전 린트/포맷 실행
- **Type Checking**: IDE에서 실시간 타입 오류 표시

## 주의사항 & 자주 하는 실수

### ❌ 서버 클라이언트를 전역으로 생성
```typescript
// 🚫 잘못된 패턴
const supabase = await createClient();

export async function getUser() {
  // 매 요청마다 같은 인스턴스 재사용
  const { data } = await supabase.auth.getUser();
}
```

```typescript
// ✅ 올바른 패턴
export async function getUser() {
  const supabase = await createClient(); // 함수 내에서 매번 생성
  const { data } = await supabase.auth.getUser();
}
```

### ❌ 클라이언트 컴포넌트에서 Supabase 쿼리
```typescript
// 🚫 잘못된 패턴
export function MyComponent() {
  const supabase = createClient();
  
  useEffect(() => {
    supabase.from("users").select(); // 클라이언트 로직
  }, []);
}
```

```typescript
// ✅ 올바른 패턴
// 서버 컴포넌트 또는 서버 액션에서 쿼리
export async function MyComponent() {
  const supabase = await createClient();
  const { data } = await supabase.from("users").select();
  
  return <div>{/* 데이터 렌더링 */}</div>;
}
```

### ❌ .env.local을 Git에 커밋
```
.env.local이 .gitignore에 포함되어 있습니다. 
환경 변수는 로컬에서만 관리하고, 배포 시 Vercel 대시보드에서 설정하세요.
```

### ❌ shadcn/ui 컴포넌트를 node_modules에서 수정
```typescript
// 🚫 node_modules/@shadcn/ui/button/... 수정
// ✅ components/ui/button.tsx 수정
```

shadcn/ui 컴포넌트는 `components/ui/`에 복사되므로 여기만 수정하세요.

### ❌ "use client"를 루트에 추가
```typescript
// 🚫 app/layout.tsx
"use client"; // 전체 앱이 클라이언트 컴포넌트가 됨

export default function Layout({ children }) {
  return <html>{children}</html>;
}
```

필요한 컴포넌트에만 추가하세요. 기본은 서버 컴포넌트입니다.

## 추가 개발 팁

### 폼 유효성 검사
- `components/login-form.tsx`, `components/sign-up-form.tsx` 참고
- HTML5 기본 검증 + Supabase 에러 처리

### 에러 처리
- `app/auth/error/page.tsx`: 인증 오류 표시
- API Route에서는 적절한 HTTP 상태 코드 반환

### 테마 시스템
- `next-themes` 사용 (다크/라이트 모드)
- `theme-switcher.tsx` 컴포넌트 참고
- CSS 변수로 색상 정의 (`app/globals.css`)

### 페이지 성능 최적화
- **이미지**: `next/image`로 자동 최적화
- **폰트**: `next/font`로 로컬 폰트 로드
- **번들 크기**: 큰 라이브러리는 동적 임포트 고려

### 디버깅 팁
```bash
# Next.js 빌드 상세 분석
npm run build -- --debug

# TypeScript 오류 상세 보기
npm run type-check

# ESLint 상세 리포트
npm run lint -- --format=compact
```

### 배포 전 체크리스트
- [ ] `npm run type-check` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공
- [ ] 환경 변수 확인 (Vercel)
- [ ] 데이터베이스 마이그레이션 완료
- [ ] RLS 정책 설정 완료

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Supabase SSR 가이드](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js App Router 마이그레이션 가이드](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
