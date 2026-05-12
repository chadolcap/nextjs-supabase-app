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
├── hooks/                      # React 커스텀 훅
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

### 환경 변수

프로젝트는 다음의 공개 환경 변수를 요구합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

이 값들은 Supabase 대시보드 > API Settings에서 확인할 수 있습니다.

## 주요 명령어

```bash
# 개발 서버 시작 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 시작
npm start

# ESLint 실행
npm run lint
```

## shadcn/ui 컴포넌트 추가

이 프로젝트는 shadcn/ui를 사용합니다. 새 컴포넌트를 추가하려면:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

설정 파일(`components.json`)에서 알리아스를 확인하세요:

- `@/components`: 컴포넌트 루트
- `@/components/ui`: shadcn/ui 컴포넌트
- `@/lib`: 유틸리티
- `@/hooks`: 커스텀 훅

## 개발 시 주의사항

### 서버 컴포넌트 vs 클라이언트 컴포넌트

- 기본값은 **서버 컴포넌트**입니다
- `"use client"` 지시문이 필요한 경우만 클라이언트 컴포넌트로 변환
- Supabase 쿼리는 서버 컴포넌트에서 수행하는 것이 권장됨

### Supabase 클라이언트 생성

서버 환경에서:
```typescript
import { createClient } from "@/lib/supabase/server";

export async function someServerAction() {
  const supabase = await createClient();
  // 사용
}
```

클라이언트 환경에서 (`"use client"`):
```typescript
import { createClient } from "@/lib/supabase/client";

export function SomeComponent() {
  const supabase = createClient();
  // 사용
}
```

### 타일윈드 CSS

- CSS 변수 기반 색상 시스템 사용 (다크 모드 지원)
- `app/globals.css`에서 CSS 변수 정의
- 커스텀 색상은 `tailwind.config.ts`의 `extend.colors`에 추가

## 배포

### Vercel 배포

이 프로젝트는 Vercel 배포에 최적화되었습니다:

1. GitHub 리포지토리 생성
2. Vercel 대시보드에서 새 프로젝트 생성
3. Supabase 마켓플레이스 통합으로 자동 환경 변수 설정 가능

```bash
npm i -g vercel
vercel
```

### 로컬 개발

Supabase 로컬 개발을 원하면:

```bash
# Supabase 클라이 설치
npm i -D supabase

# 로컬 스택 시작
supabase start

# 마이그레이션 생성/적용
supabase migration new migration_name
```

자세한 내용: https://supabase.com/docs/guides/local-development

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

## 문제 해결

### 환경 변수 오류

`.env.local` 파일이 올바른 Supabase 프로젝트 정보를 포함하는지 확인하세요. 로컬 개발 후 배포할 때 Vercel 환경 변수도 동일하게 설정해야 합니다.

### 쿠키 관련 문제

서버 컴포넌트의 쿠키 접근 권한 문제가 발생하면, `lib/supabase/server.ts`의 `setAll` 메서드의 에러 처리를 참고하세요. (프록시 새로고침이 있는 경우 무시 가능)

### 빌드 실패

최신 버전의 의존성을 설치했는지 확인:

```bash
npm install
npm run build
```

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
