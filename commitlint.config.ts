import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 새 기능
        "fix", // 버그 수정
        "docs", // 문서 변경
        "style", // 코드 스타일 (기능 변경 없음)
        "refactor", // 리팩터링
        "perf", // 성능 개선
        "test", // 테스트 추가/수정
        "build", // 빌드 시스템/외부 의존성
        "ci", // CI 설정
        "chore", // 기타 유지보수
        "revert", // 커밋 되돌리기
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "subject-case": [2, "never", ["upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
  },
};

export default config;
