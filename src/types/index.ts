// 띠 타입
export type ZodiacId = 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake' | 'horse' | 'sheep' | 'monkey' | 'rooster' | 'dog' | 'pig';

// 별자리 타입
export type HoroscopeId = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

// 운세 카테고리
export type FortuneCategory = 'overall' | 'love' | 'money' | 'health' | 'career';

// 띠 정보
export interface ZodiacInfo {
  id: ZodiacId;
  name: string;
  emoji: string;
  years: number[];
}

// 별자리 정보
export interface HoroscopeInfo {
  id: HoroscopeId;
  name: string;
  symbol: string;
  englishName: string;
  dateRange: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

// 행운 아이템
export interface LuckyItem {
  color: string;
  number: number;
  direction: string;
}

// 운세 데이터
export interface FortuneData {
  date: string;
  type: 'zodiac' | 'horoscope';
  id: ZodiacId | HoroscopeId;
  name: string;
  emoji?: string;
  symbol?: string;
  scores: {
    overall: number;
    love: number;
    money: number;
    health: number;
    career: number;
  };
  messages: {
    overall: string;
    love: string;
    money: string;
    health: string;
    career: string;
  };
  lucky: LuckyItem;
  ranking: number;
}

// 랭킹 아이템
export interface RankingItem {
  rank: number;
  type: 'zodiac' | 'horoscope';
  id: ZodiacId | HoroscopeId;
  name: string;
  emoji?: string;
  symbol?: string;
  score: number;
  change: number; // 전일 대비 변동
}

// 행운 번호
export interface LuckyNumbers {
  id: string;
  userId: string;
  method: 'zodiac' | 'horoscope' | 'random';
  numbers: number[];
  bonusNumber?: number;
  createdAt: string;
}

// 사용자 정보
export interface User {
  id: string;
  nickname: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  zodiac: ZodiacId;
  horoscope: HoroscopeId;
  tier: 'free' | 'premium' | 'vip';
  dailyLuckyNumbersLeft: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 네비게이션 파라미터
export type RootStackParamList = {
  Main: undefined;
  ZodiacFortune: { zodiacId: ZodiacId };
  HoroscopeFortune: { horoscopeId: HoroscopeId };
  LuckyNumber: undefined;
  Ranking: undefined;
  History: undefined;
};

export type BottomTabParamList = {
  FortuneHome: undefined;
  Zodiac: undefined;
  Horoscope: undefined;
  LuckyNumbers: undefined;
  Ranking: undefined;
};
