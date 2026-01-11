# Mobile Application

Expo 기반 이커머스 모바일 애플리케이션

## 기능

- 상품 목록 조회
- 상품 상세 정보
- 장바구니 (예정)
- 주문 (예정)
- 사용자 계정 관리 (예정)

## 개발

```bash
# 개발 서버 실행
pnpm dev

# Android
pnpm android

# iOS
pnpm ios

# Web
pnpm web
```

## 빌드

```bash
# Android 빌드
pnpm build:android

# iOS 빌드
pnpm build:ios
```

## 환경 변수

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

## 주의사항

- iOS 빌드는 macOS에서만 가능합니다
- EAS Build를 사용하려면 Expo 계정이 필요합니다
