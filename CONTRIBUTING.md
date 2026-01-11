# 기여 가이드

이 프로젝트에 기여해 주셔서 감사합니다!

## 개발 워크플로우

1. 이슈를 생성하거나 기존 이슈를 선택합니다
2. 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 코딩 스타일

### Frontend (TypeScript/React)
- Prettier를 사용하여 자동 포맷팅
- ESLint 규칙 준수
- 컴포넌트는 함수형으로 작성
- Props 타입은 명시적으로 정의

### Backend (Java/Spring Boot)
- Google Java Style Guide 준수
- Lombok 적극 활용
- DDD 계층 구조 유지
- 테스트 코드 작성

## 커밋 메시지

다음 형식을 따라주세요:

```
<type>: <subject>

<body>
```

### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정 등

## Pull Request

- 명확한 제목과 설명 작성
- 관련 이슈 링크
- 스크린샷 첨부 (UI 변경 시)
- 테스트 통과 확인
