---
name: git:commit
description: 이모지와 컨벤셔널 커밋 메시지로 잘 포맷된 커밋을 생성합니다
metadata:
  type: git
  keywords:
    - git
    - commit
    - conventional commits
    - message generation
---

# git:commit 스킬

Conventional Commits 규칙을 따르는 잘 포맷된 커밋 메시지를 생성하고 자동으로 커밋하는 스킬입니다.

## 기능

이 스킬은 다음을 수행합니다:

1. **변경사항 분석**: `git status`와 `git diff`를 통해 변경된 파일과 내용 분석
2. **타입 결정**: 변경 내용에 맞는 커밋 타입 선택
   - `feat`: 새로운 기능
   - `fix`: 버그 수정
   - `refactor`: 코드 리팩토링
   - `docs`: 문서 변경
   - `style`: 코드 스타일 변경 (기능 변화 없음)
   - `test`: 테스트 추가/수정
   - `chore`: 빌드, 의존성 등 기타 변경
   - `ci`: CI/CD 설정 변경

3. **메시지 작성**: 한국어로 작성된 명확한 커밋 메시지 생성
4. **커밋 실행**: 변경사항을 커밋하고 자동으로 Husky 훅 실행

## 사용법

### 기본 사용
```bash
/git:commit
```

스킬이 변경사항을 분석하고 제안된 커밋 메시지를 표시합니다.

### 메시지 커스터마이징
스킬 실행 후 생성된 메시지가 마음에 들지 않으면, 다음과 같이 커스터마이징할 수 있습니다:

```bash
/git:commit "feat(auth): 구글 로그인 추가"
```

## 컨벤션

프로젝트는 다음 컨벤션을 따릅니다:

### 커밋 메시지 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 규칙

- **Type**: 필수, 소문자
- **Scope**: 선택사항, 변경 영역 (auth, components, db 등)
- **Subject**: 필수, 명령형, 한국어, 마침표 없음, 50자 이내
- **Body**: 선택사항, 한국어, 상세 설명 (72자 줄바꿈)
- **Footer**: 선택사항, 관련 이슈 참조

### 예시

**올바른 커밋 메시지:**
```
feat(auth): 구글 로그인 추가

Supabase OAuth를 활용하여 구글 로그인 기능을 구현했습니다.
- Google OAuth 제공자 추가
- login-form에 구글 로그인 버튼 추가
- 리다이렉트 URL 설정

Closes #42
```

```
fix(components): 폼 검증 오류 수정

로그인 폼에서 이메일 검증이 작동하지 않는 문제를 수정했습니다.
```

## Git 훅 (Husky)

커밋 시 다음 검사가 자동으로 실행됩니다:

1. **commitlint**: 커밋 메시지 형식 검증
2. **lint-staged**: 변경된 파일에 대해:
   - TypeScript 타입 체크
   - ESLint 실행
   - Prettier 포맷팅

### 커밋 실패 시

```bash
# 변경사항 확인
npm run type-check
npm run lint
npm run format

# 다시 커밋
git add .
git commit -m "feat: 설명"
```

## 주의사항

- ❌ Husky 훅 우회 (`--no-verify`) 금지
- ❌ 여러 관심사를 하나의 커밋에 혼합하지 말 것
- ✅ 하나의 커밋은 하나의 논리적 변경사항
- ✅ 커밋 메시지는 "무엇을" 했는지보다 "왜" 했는지 설명

## 관련 명령어

```bash
# 최근 커밋 수정 (주의!)
git commit --amend

# 커밋 히스토리 확인
git log --oneline

# 커밋 메시지 형식 확인
npm run lint-commit
```

## 참고

- [Conventional Commits](https://www.conventionalcommits.org/)
- [commitlint 문서](https://commitlint.js.org/)
- [프로젝트 CLAUDE.md](../../CLAUDE.md)
