# React Native (Expo) 모바일 앱 개발 완전 가이드

> PC에서 Backend/Frontend만 개발해본 분들을 위한 **완전 초보자용** 모바일 앱 개발 가이드

---

## 목차

1. [모바일 앱 개발 이해하기](#1-모바일-앱-개발-이해하기)
2. [개발 환경 설정](#2-개발-환경-설정)
3. [프로젝트 구조 이해](#3-프로젝트-구조-이해)
4. [첫 번째 실행하기](#4-첫-번째-실행하기)
5. [Phase 4 Step 15: 기반 설정](#5-phase-4-step-15-기반-설정)
6. [Phase 4 Step 16: 핵심 기능 구현](#6-phase-4-step-16-핵심-기능-구현)
7. [빌드 및 배포](#7-빌드-및-배포)
8. [문제 해결 가이드](#8-문제-해결-가이드)
9. [다음 단계](#9-다음-단계)

---

## 1. 모바일 앱 개발 이해하기

### 1.1 웹 vs 모바일 앱 개발 비교

| 구분 | 웹 (Next.js) | 모바일 (React Native) |
|------|-------------|---------------------|
| **실행 환경** | 브라우저 | iOS/Android 기기 |
| **UI 컴포넌트** | `<div>`, `<span>`, `<button>` | `<View>`, `<Text>`, `<TouchableOpacity>` |
| **스타일링** | CSS, Tailwind | StyleSheet (CSS와 유사하지만 다름) |
| **라우팅** | Next.js App Router | Expo Router (매우 유사!) |
| **상태 관리** | Zustand, React Query | **동일** (그대로 사용) |
| **API 호출** | Axios | **동일** (그대로 사용) |
| **빌드 결과** | 정적 파일 (HTML/JS/CSS) | .apk (Android), .ipa (iOS) |
| **배포** | Vercel, AWS | Play Store, App Store |

### 1.2 React Native 선택 이유

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Native                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              JavaScript / TypeScript 코드                │    │
│  │           (여러분이 작성하는 코드 - React 문법!)           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│              ┌───────────────┴───────────────┐                  │
│              ▼                               ▼                   │
│    ┌─────────────────┐             ┌─────────────────┐          │
│    │   iOS 네이티브   │             │ Android 네이티브 │          │
│    │   (Swift/ObjC)  │             │ (Kotlin/Java)   │          │
│    └─────────────────┘             └─────────────────┘          │
└─────────────────────────────────────────────────────────────────┘

= 하나의 코드로 iOS와 Android 앱을 동시에 개발!
```

### 1.3 Expo란?

**Expo**는 React Native 개발을 쉽게 만들어주는 프레임워크입니다.

```
순수 React Native:
  - Android Studio 필수 (8GB+ 용량)
  - Xcode 필수 (Mac 전용, 10GB+ 용량)
  - 복잡한 네이티브 설정 필요
  - Java, Kotlin, Swift, Objective-C 지식 필요

Expo 사용:
  - Android Studio 없이도 개발 가능 ✓
  - Expo Go 앱으로 바로 테스트 ✓
  - 복잡한 설정 자동 처리 ✓
  - JavaScript/TypeScript만 알면 됨 ✓
```

### 1.4 우리 프로젝트 구조

```
DDD4/
├── apps/
│   ├── web/           # 고객용 웹사이트 (Next.js) - 이미 완성
│   ├── admin/         # 관리자 대시보드 (Next.js) - 이미 완성
│   └── mobile/        # 모바일 앱 (Expo) - 지금 만들 것!
├── backend/           # Spring Boot API 서버 - 이미 완성
└── packages/
    └── shared-types/  # 공유 타입 정의
```

---

## 2. 개발 환경 설정

### 2.1 필수 소프트웨어 설치

#### Step 1: Node.js 확인 (이미 설치되어 있을 것)

```bash
# 버전 확인 (v18 이상 필요)
node --version

# 만약 없다면 설치
# https://nodejs.org/en/download 에서 LTS 버전 다운로드
```

#### Step 2: Expo CLI 설치

```bash
# 전역으로 Expo CLI 설치
npm install -g expo-cli

# 또는 npx로 실행 (설치 없이)
npx expo --version
```

#### Step 3: 테스트 기기 준비 (3가지 옵션 중 선택)

**옵션 A: 실제 스마트폰 사용 (가장 추천)**

```
1. 스마트폰에서 "Expo Go" 앱 설치
   - Android: Play Store에서 "Expo Go" 검색
   - iOS: App Store에서 "Expo Go" 검색

2. PC와 같은 Wi-Fi 네트워크에 연결

3. 개발 서버 시작 후 QR 코드 스캔
```

**옵션 B: Android 에뮬레이터 (Windows/Mac/Linux)**

```bash
# Android Studio 설치 필요
# https://developer.android.com/studio

# 설치 후:
# 1. Android Studio 실행
# 2. More Actions → Virtual Device Manager
# 3. Create Device → Pixel 6 선택 → Next
# 4. API 34 다운로드 → Next → Finish
# 5. 생성된 에뮬레이터 Play 버튼 클릭

# 환경 변수 설정 (Windows PowerShell - 관리자)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
```

**옵션 C: iOS 시뮬레이터 (Mac 전용)**

```bash
# Xcode 설치 필요 (App Store에서)
# 용량: 약 12GB

# 설치 후:
# 1. Xcode 실행
# 2. Xcode → Settings → Platforms → iOS 다운로드
# 3. 터미널에서: open -a Simulator
```

### 2.2 개발 환경 구조 이해

```
┌──────────────────────────────────────────────────────────────────┐
│                        개발 환경 구조                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐     HTTP API      ┌─────────────────┐       │
│  │  Backend 서버   │ ◄──────────────── │  Mobile 앱      │       │
│  │  (Spring Boot)  │     localhost:8080│  (Expo)         │       │
│  │  localhost:8080 │                   │                 │       │
│  └─────────────────┘                   └─────────────────┘       │
│                                               │                   │
│                                               │ QR 코드 스캔       │
│                                               ▼                   │
│                                        ┌─────────────────┐       │
│                                        │  Expo Go 앱     │       │
│                                        │  (스마트폰)      │       │
│                                        └─────────────────┘       │
│                                                                   │
│  ※ 주의: 스마트폰에서 localhost에 접근하려면 IP 주소 사용 필요      │
│     예: http://192.168.0.10:8080                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.3 PC IP 주소 확인 방법

```bash
# Windows
ipconfig
# "IPv4 주소" 확인 (예: 192.168.0.10)

# Mac/Linux
ifconfig | grep "inet "
# 또는
ip addr show | grep "inet "

# 예시 결과: 192.168.0.10
# → 스마트폰에서 API 접근 시: http://192.168.0.10:8080
```

---

## 3. 프로젝트 구조 이해

### 3.1 현재 mobile 프로젝트 구조

```
apps/mobile/
├── app/                      # 📱 화면 (페이지) - Expo Router
│   ├── _layout.tsx          # 루트 레이아웃 (전체 앱 감싸기)
│   ├── index.tsx            # 홈 화면 (/)
│   ├── (tabs)/              # 탭 네비게이션 그룹
│   │   ├── _layout.tsx      # 탭 레이아웃
│   │   ├── index.tsx        # 홈 탭
│   │   ├── search.tsx       # 검색 탭
│   │   ├── cart.tsx         # 장바구니 탭
│   │   └── mypage.tsx       # 마이페이지 탭
│   ├── auth/                # 인증 관련 화면
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── product/             # 상품 관련 화면
│   │   └── [id].tsx         # 상품 상세 (동적 라우트)
│   ├── order/               # 주문 관련 화면
│   │   ├── index.tsx        # 주문 목록
│   │   └── [id].tsx         # 주문 상세
│   ├── checkout.tsx         # 결제 화면
│   └── +not-found.tsx       # 404 화면
│
├── src/                      # 📦 소스 코드
│   ├── features/            # 기능별 모듈 (web과 동일 구조!)
│   │   ├── auth/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── order/
│   │   └── customer/
│   ├── shared/              # 공유 코드
│   │   ├── components/      # 공통 컴포넌트
│   │   │   └── ui/          # UI 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   └── utils/           # 유틸리티 함수
│   └── lib/                 # 라이브러리 설정
│       ├── api/             # API 클라이언트
│       ├── auth/            # 인증 관련
│       └── providers/       # Context Providers
│
├── assets/                   # 📷 이미지, 폰트 등
│   ├── icon.png             # 앱 아이콘
│   ├── splash.png           # 스플래시 화면
│   └── adaptive-icon.png    # Android 적응형 아이콘
│
├── app.json                 # Expo 설정
├── package.json             # 의존성 관리
├── tsconfig.json            # TypeScript 설정
├── babel.config.js          # Babel 설정
└── .env.local               # 환경 변수
```

### 3.2 Expo Router 이해하기 (Next.js와 매우 유사!)

```
Next.js App Router          →    Expo Router
────────────────────────────────────────────────────────
app/page.tsx               →    app/index.tsx
app/products/page.tsx      →    app/products/index.tsx
app/products/[id]/page.tsx →    app/product/[id].tsx
app/(auth)/layout.tsx      →    app/(auth)/_layout.tsx
app/layout.tsx             →    app/_layout.tsx
```

**라우팅 예시:**

```typescript
// 파일: app/product/[id].tsx
// URL: /product/123

import { useLocalSearchParams } from 'expo-router';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // id = "123"
  return <Text>상품 ID: {id}</Text>;
}
```

### 3.3 주요 파일 설명

#### app.json (Expo 설정)

```json
{
  "expo": {
    "name": "E-Commerce Mobile",     // 앱 이름
    "slug": "ecommerce-mobile",      // URL 슬러그
    "version": "1.0.0",              // 버전
    "orientation": "portrait",        // 세로 고정
    "icon": "./assets/icon.png",     // 앱 아이콘
    "scheme": "ecommerce",           // 딥링크 스킴
    "ios": {
      "bundleIdentifier": "com.ecommerce.mobile"
    },
    "android": {
      "package": "com.ecommerce.mobile"
    }
  }
}
```

#### package.json (주요 의존성)

```json
{
  "dependencies": {
    "expo": "~51.0.0",                    // Expo 프레임워크
    "expo-router": "~3.5.0",              // 라우팅 (Next.js App Router와 유사)
    "react-native": "0.74.5",             // React Native
    "react-native-safe-area-context": "4.10.5",  // 안전 영역 (노치 대응)
    "react-native-screens": "~3.31.1",    // 네이티브 화면 최적화
    "@tanstack/react-query": "^5.28.0",   // 서버 상태 관리 (web과 동일!)
    "axios": "^1.6.0",                    // HTTP 클라이언트 (web과 동일!)
    "zustand": "^4.5.0"                   // 클라이언트 상태 관리 (web과 동일!)
  }
}
```

---

## 4. 첫 번째 실행하기

### 4.1 프로젝트 의존성 설치

```bash
# 프로젝트 루트로 이동
cd /home/ec2-user/DDD4

# 전체 의존성 설치 (monorepo)
pnpm install

# 또는 mobile만 설치
cd apps/mobile
pnpm install
```

### 4.2 개발 서버 시작

```bash
# apps/mobile 디렉토리에서
cd apps/mobile

# 개발 서버 시작
pnpm dev
# 또는
npx expo start
```

### 4.3 실행 결과 화면

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│    Metro waiting on exp://192.168.0.10:8081                     │
│    › Scan the QR code above with Expo Go (Android)              │
│      or the Camera app (iOS)                                     │
│                                                                  │
│    › Using Expo Go                                               │
│                                                                  │
│    › Press a │ open Android                                      │
│    › Press i │ open iOS simulator                                │
│    › Press w │ open web                                          │
│                                                                  │
│    › Press j │ open debugger                                     │
│    › Press r │ reload app                                        │
│    › Press m │ toggle menu                                       │
│                                                                  │
│         ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄                             │
│         █ ▄▄▄▄▄ █▀ █▀▀██▀▄▀▄█ ▄▄▄▄▄ █                            │
│         █ █   █ █▄▀█ ▀█▀▄▀▄ █ █   █ █  ← QR 코드                 │
│         █▄▄▄▄▄▄▄█ █ █ █▀█▀█ █▄▄▄▄▄▄▄█                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 앱 실행하기

**스마트폰에서 (가장 추천):**
1. Expo Go 앱 실행
2. QR 코드 스캔
3. 앱 자동 로드

**에뮬레이터에서:**
```bash
# Android 에뮬레이터가 실행 중인 상태에서
a 키 누르기

# iOS 시뮬레이터 (Mac 전용)
i 키 누르기
```

### 4.5 Hot Reload 확인

```
파일 저장 → 자동으로 앱 업데이트 (1-2초)

※ 웹 개발과 동일한 개발 경험!
```

---

## 5. Phase 4 Step 15: 기반 설정

### 5.1 구현 목표

- [x] Expo Router 설정
- [ ] 탭 네비게이션
- [ ] 인증 플로우
- [ ] API 클라이언트
- [ ] 기본 UI 컴포넌트

### 5.2 추가 패키지 설치

```bash
cd apps/mobile

# UI 관련
npx expo install expo-image                    # 이미지 최적화
npx expo install expo-linear-gradient          # 그라데이션
npx expo install @expo/vector-icons            # 아이콘

# 저장소
npx expo install expo-secure-store             # 보안 저장소 (토큰)
npx expo install @react-native-async-storage/async-storage  # 일반 저장소

# 네비게이션 관련
npx expo install expo-linking                  # 딥링크

# 기타
npx expo install expo-constants                # 앱 상수
npx expo install expo-font                     # 커스텀 폰트
npx expo install expo-splash-screen            # 스플래시 화면 제어
```

### 5.3 프로젝트 구조 생성

```bash
# src 디렉토리 구조 생성
mkdir -p apps/mobile/src/{features,shared,lib}
mkdir -p apps/mobile/src/features/{auth,product,cart,order,customer}
mkdir -p apps/mobile/src/shared/{components/ui,hooks,utils,constants}
mkdir -p apps/mobile/src/lib/{api,auth,providers}

# 각 feature 구조 생성
for feature in auth product cart order customer; do
  mkdir -p apps/mobile/src/features/$feature/{api,components,hooks,store}
done
```

### 5.4 API 클라이언트 설정

#### 파일: `src/lib/api/client.ts`

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl
  || process.env.EXPO_PUBLIC_API_URL
  || 'http://localhost:8080';

// ⚠️ 중요: 스마트폰에서 테스트 시 localhost 대신 PC의 실제 IP 사용
// 예: http://192.168.0.10:8080

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Token retrieval error:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        await SecureStore.setItemAsync('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 → 로그아웃 처리
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // 로그인 화면으로 이동은 AuthProvider에서 처리
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

#### 파일: `src/lib/api/types.ts`

```typescript
// API 응답 공통 타입 (Backend와 동일)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  errorCode: string;
  message: string;
  timestamp: string;
  details?: Record<string, string>;
}
```

### 5.5 인증 상태 관리 (Zustand)

#### 파일: `src/lib/auth/authStore.ts`

```typescript
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface Customer {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
}

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setCustomer: (customer: Customer | null) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isAuthenticated: false,
  isLoading: true,

  setCustomer: (customer) => set({ customer, isAuthenticated: !!customer }),

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ customer: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        // 토큰이 있으면 사용자 정보 조회
        // TODO: API 호출로 사용자 정보 가져오기
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
```

### 5.6 토큰 매니저

#### 파일: `src/lib/auth/tokenManager.ts`

```typescript
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenManager = {
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setAccessToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  clearTokens: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
```

### 5.7 Providers 설정

#### 파일: `src/lib/providers/index.tsx`

```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5분
      gcTime: 1000 * 60 * 30,    // 30분
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 5.8 기본 UI 컴포넌트

#### 파일: `src/shared/components/ui/Button.tsx`

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#7c3aed'}
          size="small"
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primary: {
    backgroundColor: '#7c3aed',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  md: {
    height: 44,
    paddingHorizontal: 16,
  },
  lg: {
    height: 52,
    paddingHorizontal: 24,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1f2937',
  },
  outlineText: {
    color: '#374151',
  },
  ghostText: {
    color: '#7c3aed',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});
```

#### 파일: `src/shared/components/ui/Input.tsx`

```typescript
import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, helper, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {helper && !error && <Text style={styles.helper}>{helper}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  helper: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
```

#### 파일: `src/shared/components/ui/Card.tsx`

```typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = 16 }: CardProps) {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
```

#### 파일: `src/shared/components/ui/index.ts`

```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
```

### 5.9 유틸리티 함수

#### 파일: `src/shared/utils/format.ts`

```typescript
/**
 * 가격 포맷팅 (원화)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

/**
 * 숫자 포맷팅 (천 단위 콤마)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * 상대적 시간 포맷팅
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return formatDate(d);
}
```

### 5.10 루트 레이아웃 설정

#### 파일: `app/_layout.tsx`

```typescript
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Providers } from '@/lib/providers';
import { useAuthStore } from '@/lib/auth/authStore';

// 스플래시 화면 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Providers>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#1f2937',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#f9fafb' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: '로그인' }} />
        <Stack.Screen name="auth/register" options={{ title: '회원가입' }} />
        <Stack.Screen name="product/[id]" options={{ title: '상품 상세' }} />
        <Stack.Screen name="checkout" options={{ title: '주문하기' }} />
        <Stack.Screen name="order/index" options={{ title: '주문 내역' }} />
        <Stack.Screen name="order/[id]" options={{ title: '주문 상세' }} />
      </Stack>
    </Providers>
  );
}
```

### 5.11 탭 네비게이션 설정

#### 파일: `app/(tabs)/_layout.tsx`

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopColor: '#f3f4f6',
          backgroundColor: '#ffffff',
        },
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '장바구니',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 5.12 환경 변수 설정

#### 파일: `.env.local`

```env
# API URL (스마트폰 테스트 시 PC의 실제 IP로 변경)
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080

# Toss Payments (결제 테스트용)
EXPO_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
```

#### 파일: `app.config.ts` (app.json 대체)

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'E-Commerce Mobile',
  slug: 'ecommerce-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'ecommerce',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ecommerce.mobile',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.ecommerce.mobile',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
});
```

---

## 6. Phase 4 Step 16: 핵심 기능 구현

### 6.1 구현 목표

- [ ] 홈 화면 (추천 상품, 배너)
- [ ] 상품 검색
- [ ] 상품 상세
- [ ] 장바구니
- [ ] 주문/결제
- [ ] 주문 내역
- [ ] 마이페이지
- [ ] 푸시 알림 설정

### 6.2 Auth Feature 구현

#### 파일: `src/features/auth/api/authApi.ts`

```typescript
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  customer: {
    id: number;
    email: string;
    name: string;
    phoneNumber?: string;
  };
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/register', data);
  },

  getMe: async () => {
    const response = await apiClient.get('/api/v1/customers/me');
    return response.data;
  },
};
```

#### 파일: `src/features/auth/hooks/useLogin.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../api/authApi';
import { tokenManager } from '@/lib/auth/tokenManager';
import { useAuthStore } from '@/lib/auth/authStore';
import { Alert } from 'react-native';

export function useLogin() {
  const setCustomer = useAuthStore((state) => state.setCustomer);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // 토큰 저장
      await tokenManager.setTokens(data.accessToken, data.refreshToken);

      // 상태 업데이트
      setCustomer(data.customer);

      // 홈으로 이동
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      Alert.alert('로그인 실패', message);
    },
  });
}
```

#### 파일: `app/auth/login.tsx`

```typescript
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '@/shared/components/ui';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { mutate: login, isPending } = useLogin();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      login({ email, password });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>로그인</Text>
            <Text style={styles.subtitle}>계정에 로그인하세요</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
            />

            <Button
              title="로그인"
              onPress={handleLogin}
              loading={isPending}
              fullWidth
              size="lg"
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>계정이 없으신가요?</Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>회원가입</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    color: '#6b7280',
    marginRight: 4,
  },
  linkText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
});
```

### 6.3 Product Feature 구현

#### 파일: `src/features/product/api/productApi.ts`

```typescript
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  status: string;
  stockQuantity: number;
  category?: {
    id: number;
    name: string;
  };
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const productApi = {
  getProducts: async (params: ProductSearchParams): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      '/api/v1/products',
      { params }
    );
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/api/v1/categories');
    return response.data;
  },
};
```

#### 파일: `src/features/product/hooks/useProducts.ts`

```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productApi, ProductSearchParams } from '../api/productApi';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductSearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export function useProducts(params: ProductSearchParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
}

// 무한 스크롤용
export function useInfiniteProducts(params: Omit<ProductSearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });
}
```

#### 파일: `src/features/product/components/ProductCard.tsx`

```typescript
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { formatPrice } from '@/shared/utils/format';
import type { Product } from '../api/productApi';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountRate = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity style={styles.container} activeOpacity={0.7}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl || 'https://via.placeholder.com/200' }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          {isOutOfStock && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>품절</Text>
            </View>
          )}
          {hasDiscount && !isOutOfStock && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountRate}%</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice!)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
});
```

### 6.4 탭 화면 구현

#### 파일: `app/(tabs)/index.tsx` (홈 화면)

```typescript
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '@/features/product/hooks/useProducts';
import { ProductCard } from '@/features/product/components/ProductCard';

export default function HomeScreen() {
  const { data, isLoading, refetch, isRefetching } = useProducts({
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const products = data?.content || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>E-Commerce</Text>
        <Text style={styles.subtitle}>오늘의 추천 상품</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard product={item} />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>상품이 없습니다.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  list: {
    padding: 12,
  },
  row: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
    marginBottom: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
```

#### 파일: `app/(tabs)/search.tsx` (검색 화면)

```typescript
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/features/product/hooks/useProducts';
import { ProductCard } from '@/features/product/components/ProductCard';
import debounce from 'lodash.debounce';

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useProducts({
    page: 0,
    size: 20,
    keyword: searchQuery || undefined,
  });

  const products = data?.content || [];

  // 검색어 입력 디바운스
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 500),
    []
  );

  const handleChangeText = (text: string) => {
    setKeyword(text);
    debouncedSearch(text);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="상품 검색"
          value={keyword}
          onChangeText={handleChangeText}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard product={item} />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {searchQuery ? '검색 결과가 없습니다.' : '상품을 검색해보세요.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1f2937',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 12,
  },
  row: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
    marginBottom: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
```

#### 파일: `app/(tabs)/cart.tsx` (장바구니)

```typescript
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuthStore } from '@/lib/auth/authStore';

export default function CartScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: cart, isLoading } = useCart();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>로그인이 필요합니다</Text>
          <Text style={styles.emptyText}>
            장바구니를 이용하려면 로그인해주세요.
          </Text>
          <Button
            title="로그인하기"
            onPress={() => router.push('/auth/login')}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const items = cart?.items || [];
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>장바구니가 비어있습니다</Text>
          <Text style={styles.emptyText}>
            원하는 상품을 장바구니에 담아보세요.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.item}>
                {/* 장바구니 아이템 렌더링 */}
                <Text>{item.productName}</Text>
                <Text>{formatPrice(item.price)} x {item.quantity}</Text>
              </Card>
            )}
            contentContainerStyle={styles.list}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>총 상품 금액</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
            </View>
            <Button
              title={`${formatPrice(totalAmount)} 주문하기`}
              onPress={() => router.push('/checkout')}
              fullWidth
              size="lg"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  item: {
    marginBottom: 12,
  },
  summary: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
```

#### 파일: `app/(tabs)/mypage.tsx` (마이페이지)

```typescript
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@/shared/components/ui';
import { useAuthStore } from '@/lib/auth/authStore';

export default function MyPageScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const customer = useAuthStore((state) => state.customer);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(tabs)');
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPrompt}>
          <Ionicons name="person-circle-outline" size={80} color="#d1d5db" />
          <Text style={styles.loginTitle}>로그인이 필요합니다</Text>
          <Text style={styles.loginText}>
            로그인하고 다양한 서비스를 이용하세요.
          </Text>
          <Button
            title="로그인"
            onPress={() => router.push('/auth/login')}
            style={{ marginTop: 20, width: 200 }}
          />
          <Button
            title="회원가입"
            variant="outline"
            onPress={() => router.push('/auth/register')}
            style={{ marginTop: 12, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        {/* 프로필 영역 */}
        <Card style={styles.profileCard}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer?.name?.[0] || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{customer?.name}</Text>
              <Text style={styles.email}>{customer?.email}</Text>
            </View>
          </View>
        </Card>

        {/* 메뉴 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>주문</Text>
          <MenuItem
            icon="receipt-outline"
            title="주문 내역"
            onPress={() => router.push('/order')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>내 정보</Text>
          <MenuItem
            icon="person-outline"
            title="프로필 수정"
            onPress={() => {}}
          />
          <MenuItem
            icon="location-outline"
            title="배송지 관리"
            onPress={() => {}}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>기타</Text>
          <MenuItem
            icon="notifications-outline"
            title="알림 설정"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            title="고객센터"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#6b7280" />
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  profileCard: {
    margin: 16,
    marginBottom: 0,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
  },
});
```

### 6.5 상품 상세 화면

#### 파일: `app/product/[id].tsx`

```typescript
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useProduct } from '@/features/product/hooks/useProducts';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useAuthStore } from '@/lib/auth/authStore';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: product, isLoading } = useProduct(productId);
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert('로그인 필요', '장바구니에 담으려면 로그인이 필요합니다.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    addToCart(
      { productId, quantity },
      {
        onSuccess: () => {
          Alert.alert('알림', '장바구니에 담았습니다.', [
            { text: '계속 쇼핑', style: 'cancel' },
            { text: '장바구니 보기', onPress: () => router.push('/(tabs)/cart') },
          ]);
        },
      }
    );
  };

  if (isLoading || !product) {
    return (
      <View style={styles.loading}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  const isOutOfStock = product.status === 'OUT_OF_STOCK';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView>
          {/* 상품 이미지 */}
          <Image
            source={{ uri: product.imageUrl || 'https://via.placeholder.com/400' }}
            style={styles.image}
            contentFit="cover"
          />

          {/* 상품 정보 */}
          <View style={styles.info}>
            {product.category && (
              <Text style={styles.category}>{product.category.name}</Text>
            )}
            <Text style={styles.name}>{product.name}</Text>

            <View style={styles.priceContainer}>
              {hasDiscount && (
                <Text style={styles.discount}>
                  {Math.round((1 - product.price / product.originalPrice!) * 100)}%
                </Text>
              )}
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  {formatPrice(product.originalPrice!)}
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            <Text style={styles.descriptionTitle}>상품 설명</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </ScrollView>

        {/* 하단 고정 버튼 */}
        <View style={styles.bottomBar}>
          <View style={styles.quantityContainer}>
            <Button
              title="-"
              variant="outline"
              size="sm"
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={styles.quantityButton}
            />
            <Text style={styles.quantity}>{quantity}</Text>
            <Button
              title="+"
              variant="outline"
              size="sm"
              onPress={() => setQuantity((q) => q + 1)}
              style={styles.quantityButton}
            />
          </View>

          <Button
            title={isOutOfStock ? '품절' : '장바구니 담기'}
            onPress={handleAddToCart}
            loading={isPending}
            disabled={isOutOfStock}
            style={styles.addToCartButton}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: width,
  },
  info: {
    padding: 20,
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
  },
});
```

---

## 7. 빌드 및 배포

### 7.1 개발용 빌드 (Expo Go 없이 테스트)

```bash
# EAS CLI 설치
npm install -g eas-cli

# Expo 계정 로그인
eas login

# 프로젝트 설정
eas build:configure

# 개발용 빌드 생성
eas build --profile development --platform android
# 또는
eas build --profile development --platform ios
```

### 7.2 프로덕션 빌드

#### eas.json 설정

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

#### 빌드 명령어

```bash
# Preview APK (테스트 배포용)
eas build --profile preview --platform android

# Production (스토어 배포용)
eas build --profile production --platform android
eas build --profile production --platform ios

# 스토어 제출
eas submit --platform android
eas submit --platform ios
```

### 7.3 OTA (Over-The-Air) 업데이트

```bash
# 앱 업데이트 (재빌드 없이)
eas update --branch production --message "버그 수정"

# 특정 채널에 업데이트
eas update --channel preview --message "새 기능 테스트"
```

---

## 8. 문제 해결 가이드

### 8.1 자주 발생하는 오류

#### "네트워크 오류" / API 연결 실패

```
원인: 스마트폰에서 localhost에 접근할 수 없음

해결:
1. PC의 실제 IP 주소 확인
2. .env.local 수정: EXPO_PUBLIC_API_URL=http://192.168.x.x:8080
3. 방화벽에서 8080 포트 허용
4. PC와 스마트폰이 같은 Wi-Fi에 연결되어 있는지 확인
```

#### "Module not found"

```bash
# 캐시 삭제 후 재시작
npx expo start -c

# 또는 node_modules 재설치
rm -rf node_modules
pnpm install
```

#### iOS 시뮬레이터 문제 (Mac)

```bash
# Xcode Command Line Tools 재설치
sudo xcode-select --reset

# 시뮬레이터 캐시 삭제
xcrun simctl erase all
```

#### Android 에뮬레이터 문제

```bash
# ADB 재시작
adb kill-server
adb start-server

# 에뮬레이터 냉장 재시작
에뮬레이터 종료 → Android Studio → Virtual Device Manager → Cold Boot Now
```

### 8.2 성능 최적화 팁

```typescript
// 1. FlatList 최적화
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderItem}
  removeClippedSubviews={true}  // 화면 밖 항목 제거
  maxToRenderPerBatch={10}       // 배치당 렌더링 수
  windowSize={5}                 // 렌더링 윈도우 크기
  initialNumToRender={10}        // 초기 렌더링 수
  getItemLayout={(_, index) => ({  // 항목 크기가 고정일 때
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// 2. 이미지 최적화
import { Image } from 'expo-image';  // react-native Image 대신 사용

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={200}  // 페이드 인 애니메이션
  cachePolicy="memory-disk"  // 캐싱 정책
/>

// 3. 컴포넌트 메모이제이션
const MemoizedItem = memo(function Item({ item }) {
  return <View>...</View>;
});
```

---

## 9. 다음 단계

### 9.1 추가 기능 구현

1. **푸시 알림**
   ```bash
   npx expo install expo-notifications
   ```

2. **이미지 갤러리/카메라**
   ```bash
   npx expo install expo-image-picker
   ```

3. **소셜 로그인**
   ```bash
   npx expo install expo-auth-session expo-web-browser
   ```

4. **애니메이션**
   ```bash
   npx expo install react-native-reanimated
   ```

### 9.2 학습 자료

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Native 공식 문서](https://reactnative.dev/)
- [Expo Router 문서](https://docs.expo.dev/router/introduction/)
- [React Query 문서](https://tanstack.com/query/latest)

### 9.3 체크리스트

#### Step 15 완료 조건
- [ ] 개발 환경 설정 완료
- [ ] Expo Router 설정
- [ ] 탭 네비게이션
- [ ] 인증 플로우 (로그인/회원가입)
- [ ] API 클라이언트 설정
- [ ] 기본 UI 컴포넌트 (Button, Input, Card)

#### Step 16 완료 조건
- [ ] 홈 화면 (추천 상품)
- [ ] 상품 검색
- [ ] 상품 상세
- [ ] 장바구니
- [ ] 주문/결제
- [ ] 주문 내역
- [ ] 마이페이지
- [ ] 푸시 알림 설정

---

## 부록: 명령어 치트시트

```bash
# === 개발 ===
pnpm dev                      # 개발 서버 시작
npx expo start -c             # 캐시 삭제 후 시작
npx expo start --tunnel       # 터널 모드 (같은 네트워크 아닐 때)

# === 빌드 ===
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform all

# === 패키지 설치 ===
npx expo install [package-name]  # Expo 호환 버전 설치

# === 디버깅 ===
npx expo start                # Metro Bundler 시작
j                             # 크롬 디버거 열기
m                             # 개발자 메뉴 열기
r                             # 앱 새로고침

# === 배포 ===
eas update --branch production --message "업데이트 메시지"
eas submit --platform android
eas submit --platform ios
```

---

**작성일**: 2026-01-25
**버전**: 1.0.0
**작성자**: Claude Assistant
