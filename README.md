# 🎰 LOTTO Labs 운세앱

AI 기반 운세 분석과 행운 번호 생성을 제공하는 React Native 앱입니다.

## 📱 주요 기능

### 🐲 띠별 운세
- 12지신 기반 일일 운세
- 총운, 연애운, 재물운, 건강운, 직장운
- 행운 색상, 숫자, 방향

### ⭐ 별자리 운세
- 12별자리 기반 일일 운세
- 원소(불/흙/공기/물) 속성 표시
- 상세 카테고리별 운세

### 🎱 행운 번호 생성
- 띠 기반 번호 생성
- 별자리 기반 번호 생성
- 랜덤 번호 생성
- 티어별 일일 생성 횟수 제한

### 🏆 운세 랭킹
- 일일 띠별/별자리별 랭킹
- TOP 3 시상대 표시
- 전일 대비 순위 변동

### 📊 운세 히스토리 (Premium)
- 최근 7일 (Premium) / 30일 (VIP) 기록
- 운세 추이 분석

## 🛠 기술 스택

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **HTTP Client**: Axios
- **Styling**: StyleSheet + NativeWind (Tailwind)

## 📁 프로젝트 구조

```
lottolabs-fortune-app/
├── App.tsx                 # 앱 진입점
├── app.json               # Expo 설정
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── assets/                # 이미지, 아이콘
└── src/
    ├── components/        # 재사용 컴포넌트
    │   ├── common/
    │   │   ├── LottoBall.tsx      # 로또 볼 컴포넌트
    │   │   ├── ScoreBar.tsx       # 점수 바/원형 표시
    │   │   ├── FortuneCard.tsx    # 운세 카드
    │   │   └── UIComponents.tsx   # 공용 UI 컴포넌트
    │   └── fortune/
    ├── constants/         # 상수 정의
    │   ├── colors.ts      # 컬러 팔레트
    │   ├── zodiac.ts      # 12지신 데이터
    │   └── horoscope.ts   # 12별자리 데이터
    ├── hooks/             # 커스텀 훅
    ├── navigation/        # 네비게이션 설정
    │   └── AppNavigator.tsx
    ├── screens/           # 화면 컴포넌트
    │   ├── FortuneMainScreen.tsx
    │   ├── ZodiacFortuneScreen.tsx
    │   ├── HoroscopeFortuneScreen.tsx
    │   ├── LuckyNumberScreen.tsx
    │   ├── RankingScreen.tsx
    │   └── HistoryScreen.tsx
    ├── services/          # API 서비스
    │   └── api.ts
    ├── store/             # 상태 관리
    │   └── useFortuneStore.ts
    └── types/             # TypeScript 타입
        └── index.ts
```

## 🚀 시작하기

### 요구 사항

- Node.js 18+
- npm 또는 yarn
- Expo CLI
- iOS Simulator (Mac) 또는 Android Emulator

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-repo/lottolabs-fortune-app.git
cd lottolabs-fortune-app

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 API URL 등 설정
```

### 실행

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

### 빌드

```bash
# EAS 빌드 (권장)
npx eas build --platform ios
npx eas build --platform android

# 로컬 빌드
npx expo prebuild
cd ios && pod install && cd ..
npx react-native run-ios
```

## 🎨 디자인 시스템

### 컬러 팔레트

| 용도 | 색상 | HEX |
|------|------|-----|
| Primary | Navy Blue | `#1E3A5F` |
| Secondary | Gold | `#FFD700` |
| Accent | Coral | `#FF6B6B` |
| Background | Light Gray | `#F8FAFC` |
| Surface | White | `#FFFFFF` |

### 로또 볼 색상

| 번호 범위 | 색상 |
|-----------|------|
| 1-10 | 노란색 `#FBC400` |
| 11-20 | 파란색 `#69C8F2` |
| 21-30 | 빨간색 `#FF7272` |
| 31-40 | 회색 `#AAAAAA` |
| 41-45 | 초록색 `#B0D840` |

## 📊 API 연동

현재 Mock 데이터로 동작하며, 실제 백엔드 연동 시 `src/services/api.ts`의 주석을 해제하세요.

### 주요 엔드포인트

```typescript
// 오늘의 운세
GET /api/v1/fortune/today?type=zodiac&id=dragon

// 행운 번호 생성
POST /api/v1/fortune/lucky-numbers
{ "method": "zodiac", "id": "dragon" }

// 랭킹 조회
GET /api/v1/fortune/ranking?type=zodiac

// 히스토리 조회 (Premium)
GET /api/v1/fortune/history?type=zodiac&id=dragon&days=7
```

## 💰 티어별 기능

| 기능 | Free | Premium | VIP |
|------|------|---------|-----|
| 일일 운세 | ✅ | ✅ | ✅ |
| 행운 번호 | 3회/일 | 10회/일 | 무제한 |
| 히스토리 | ❌ | 7일 | 30일 |
| 과거 랭킹 | ❌ | ✅ | ✅ |
| 광고 | ✅ | ❌ | ❌ |
| AI 상담 | ❌ | ❌ | ✅ |

## 🔧 설정 커스터마이징

### 운세 알고리즘 조정

`src/services/api.ts`의 `generateMockFortune` 함수에서 점수 범위와 메시지를 수정할 수 있습니다.

### 새로운 띠/별자리 추가

`src/constants/zodiac.ts` 또는 `src/constants/horoscope.ts`에 데이터를 추가하세요.

## 📝 법적 고지

```
⚠️ 본 서비스는 통계 분석 및 교육 목적의 정보 제공 서비스입니다.
제공되는 운세 및 번호는 참고용이며, 실제 복권 당첨을 보장하지 않습니다.
복권 구매는 본인 책임 하에 이루어지며, 과도한 복권 구매는 경제적 손실을 초래할 수 있습니다.
만 19세 이상만 이용 가능합니다.
```

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- **스티붕** - LOTTO Labs

---

🍀 행운을 빕니다! 🍀
