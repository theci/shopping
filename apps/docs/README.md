# React Native 프로젝트 설계 문서 모음

FastCampus React Native 커리큘럼을 기반으로 한 6개의 프로젝트 설계 문서입니다.

## 프로젝트 개요

### Expo 기반 프로젝트 (Part 1-3)

#### 1. [여행기록 및 경비 관리 앱](./01-travel-expense-app.md)
**난이도**: ⭐⭐
**주요 기술**: Expo Router, React Query, AsyncStorage, Expo Image Picker, Expo Location

사용자의 여행을 기록하고 경비를 관리하는 앱입니다.

**핵심 기능**:
- 여행 생성/수정/삭제
- 사진/위치/날씨를 포함한 여행 기록
- 경비 추적 및 통계
- 무한 스크롤
- 광고 연동

**학습 포인트**:
- Expo Router를 활용한 파일 기반 라우팅
- React Query로 서버 상태 관리
- AsyncStorage + Zustand 로컬 저장
- New Architecture 이해

---

#### 2. [로컬 트래블 가이드 앱](./02-local-travel-guide-app.md)
**난이도**: ⭐⭐⭐
**주요 기술**: Google Maps SDK, Background Location, Expo Notifications, Gemini API, Sentry

위치 기반으로 주변 맛집과 명소를 자동 추천하는 앱입니다.

**핵심 기능**:
- Google Maps 연동
- 포그라운드/백그라운드 위치 추적
- 로컬 푸시 알림
- 딥링크
- AI 해시태그 자동 생성
- 리워드 광고

**학습 포인트**:
- Expo Prebuild (CNG) 이해
- 위치 권한 관리 UX
- Background Task 구현
- 환경 변수 보안 전략
- EAS Update (OTA)

---

#### 3. [실전 회화 튜터 앱](./03-conversation-tutor-app.md)
**난이도**: ⭐⭐⭐⭐
**주요 기술**: Local Authentication, Expo Audio, OpenAI API, WebView, In-App Purchase, Reanimated

생체 인증과 AI 기반 영어 회화 학습 앱입니다.

**핵심 기능**:
- Face ID/Touch ID/Fingerprint 인증
- 음성 녹음 및 파형 그래프
- AI 회화 및 발음 평가
- TTS (Text-to-Speech)
- 토큰/구독 결제
- WebView ↔ Native 통신

**학습 포인트**:
- 생체 인증 보안 설계
- 고성능 애니메이션 (Reanimated)
- 오디오 파일 관리
- 인앱 결제 구현
- RN CLI 빌드 + CodePush

---

### React Native CLI 기반 프로젝트 (Part 5)

#### 4. [AI 식단 렌즈 앱](./04-ai-diet-lens-app.md)
**난이도**: ⭐⭐
**주요 기술**: React Native Vision Camera, GPT-4 Vision API, AdMob, SQLite

음식 사진을 촬영하면 AI가 칼로리와 영양 성분을 분석하는 앱입니다.

**핵심 기능**:
- 카메라 촬영
- GPT-4 Vision API로 음식 분석
- 영양 성분 시각화
- 식단 기록 관리
- 광고 연동

**학습 포인트**:
- React Native Vision Camera 사용
- AI Vision API 활용
- 로컬 빌드 (Gradle, Xcode)
- 스토어 배포

---

#### 5. [터보 만보기 앱](./05-turbo-pedometer-app.md)
**난이도**: ⭐⭐⭐
**주요 기술**: Native Module, Foreground Service, Core Motion, FCM, AdMob, In-App Purchase

네이티브 센서를 활용한 24시간 걸음 수 추적 앱입니다.

**핵심 기능**:
- Android Foreground Service
- iOS Core Motion
- AI 건강 코칭
- FCM 푸시 알림
- 광고 및 인앱 결제

**학습 포인트**:
- Native Module 개발 (Java, Objective-C)
- Foreground Service 구현
- 센서 데이터 처리
- 배터리 최적화
- 스토어 배포 전략

---

#### 6. [마이 헬스 플랫폼 앱](./06-my-health-platform-app.md)
**난이도**: ⭐⭐⭐⭐⭐
**주요 기술**: Monorepo (Turborepo), Firebase, AdMob, In-App Purchase, CI/CD, OTA

종합 건강 관리 플랫폼으로 모노레포 구조의 대규모 프로젝트입니다.

**핵심 기능**:
- 식단 분석 + 만보기 + AI 코칭 통합
- 체중/혈압 기록
- 운동 추적
- 구독 결제 및 관리
- 자동 배포 시스템

**학습 포인트**:
- Monorepo 설계 (RN CLI + Expo)
- 구독 결제 구현
- GitHub Actions CI/CD
- OTA 업데이트 (S3 + CodePush)
- 프로덕션 운영 시나리오

---

## 기술 스택 비교표

| 프로젝트 | Framework | 주요 라이브러리 | 수익화 | 난이도 |
|---------|-----------|--------------|--------|--------|
| 여행기록 | Expo | React Query, Expo Router | AdMob | ⭐⭐ |
| 트래블 가이드 | Expo (Prebuild) | Google Maps, Gemini API | AdMob (Rewarded) | ⭐⭐⭐ |
| 회화 튜터 | Expo | OpenAI, Reanimated | IAP (토큰/구독) | ⭐⭐⭐⭐ |
| 식단 렌즈 | RN CLI | Vision Camera, GPT-4 Vision | AdMob | ⭐⭐ |
| 만보기 | RN CLI | Native Module, FCM | AdMob + IAP | ⭐⭐⭐ |
| 헬스 플랫폼 | RN CLI (Monorepo) | Firebase, Turborepo | AdMob + IAP (구독) | ⭐⭐⭐⭐⭐ |

---

## 학습 로드맵 추천

### 초급 (React Native 입문자)
1. **여행기록 앱** → Expo 기본, 라우팅, 상태 관리 학습
2. **식단 렌즈 앱** → RN CLI 전환, 카메라/AI 활용

### 중급 (기본 앱 개발 경험자)
3. **트래블 가이드 앱** → 위치 기반 서비스, 백그라운드 작업
4. **만보기 앱** → Native Module 개발, 센서 활용

### 고급 (프로덕션 앱 개발 목표)
5. **회화 튜터 앱** → 생체 인증, 고성능 애니메이션, 결제
6. **헬스 플랫폼 앱** → 모노레포, CI/CD, 운영 전략

---

## 공통 학습 주제

### 1. 상태 관리
- Zustand + AsyncStorage
- React Query (서버 상태)
- Redux Toolkit (선택적)

### 2. 수익화
- Google AdMob (배너, 전면, 리워드 광고)
- In-App Purchase (토큰, 구독)
- 광고 노출 전략

### 3. AI 연동
- OpenAI GPT-4 (텍스트, 비전)
- Google Gemini API
- 프롬프트 엔지니어링

### 4. 배포
- EAS Build (Expo)
- 로컬 빌드 (Gradle, Xcode)
- Google Play Store / App Store
- OTA 업데이트

### 5. 성능 최적화
- FlatList 최적화
- 이미지 캐싱
- 애니메이션 최적화
- 배터리 최적화

---

## 각 문서 구조

각 설계 문서는 다음과 같은 섹션으로 구성되어 있습니다:

1. **프로젝트 개요** - 앱 설명 및 기술 스택
2. **아키텍처 설계** - 앱 구조, 데이터 모델, 상태 관리
3. **주요 기능 명세** - 상세 구현 방법 및 코드 예시
4. **UI/UX 플로우** - 화면 흐름 및 인터랙션
5. **성능 최적화** - 성능 개선 전략
6. **빌드 및 배포** - 빌드 방법 및 배포 전략
7. **테스트 시나리오** - 기능 테스트 체크리스트
8. **향후 확장 가능성** - 추가 기능 아이디어

---

## 시작하기

1. 관심 있는 프로젝트 설계 문서를 선택하세요
2. 기술 스택을 확인하고 개발 환경을 세팅하세요
3. 데이터 모델부터 시작하여 점진적으로 기능을 구현하세요
4. 각 문서의 코드 예시를 참고하세요
5. 테스트 시나리오를 확인하며 품질을 검증하세요

---

## 리소스

### 공식 문서
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query)

### 필수 라이브러리
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Firebase](https://rnfirebase.io/)
- [React Native IAP](https://github.com/dooboolab/react-native-iap)

### AI API
- [OpenAI API](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/)

---

## 라이센스

이 설계 문서는 FastCampus 커리큘럼을 기반으로 작성되었습니다.
교육 및 학습 목적으로 자유롭게 사용할 수 있습니다.

---

**작성일**: 2025-12-31
**버전**: 1.0.0
