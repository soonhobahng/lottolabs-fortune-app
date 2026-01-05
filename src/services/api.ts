import axios from 'axios';
import { FortuneData, RankingItem, LuckyNumbers, ZodiacId, HoroscopeId } from '../types';
import { ZODIAC_DATA, ZODIAC_LIST } from '../constants/zodiac';
import { HOROSCOPE_DATA, HOROSCOPE_LIST } from '../constants/horoscope';

// API 기본 설정 (실제 백엔드 연결 시 변경)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.lottolabs.kr/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Mock 데이터 생성 함수 =====

// 시드 기반 의사 난수 생성기
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 날짜 + ID로 시드 생성
const generateSeed = (date: string, id: string): number => {
  let hash = 0;
  const str = date + id;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// 운세 메시지 목록
const FORTUNE_MESSAGES = {
  overall: {
    excellent: [
      '오늘은 모든 일이 순조롭게 풀리는 날입니다. 자신감을 가지고 도전하세요!',
      '행운이 가득한 하루가 될 것입니다. 새로운 기회를 놓치지 마세요.',
      '긍정적인 에너지가 넘치는 날입니다. 주변 사람들에게도 좋은 영향을 줄 수 있어요.',
    ],
    good: [
      '전반적으로 좋은 하루가 예상됩니다. 꾸준한 노력이 결실을 맺을 거예요.',
      '작은 행운들이 모여 큰 기쁨이 될 수 있는 날입니다.',
      '안정적인 하루가 될 것입니다. 계획한 일들을 차근차근 진행하세요.',
    ],
    normal: [
      '평범하지만 안정적인 하루입니다. 무리하지 말고 여유를 가지세요.',
      '특별한 일은 없지만 평화로운 하루가 될 것입니다.',
      '조용히 자신을 돌아보기 좋은 날입니다.',
    ],
    bad: [
      '조금 어려운 하루가 될 수 있습니다. 인내심을 가지세요.',
      '예상치 못한 일이 생길 수 있으니 주의가 필요합니다.',
      '무리한 결정은 피하고 신중하게 행동하세요.',
    ],
  },
  love: {
    excellent: ['로맨틱한 만남이 기대되는 날입니다. 💕', '연인과의 관계가 더욱 깊어질 수 있어요.'],
    good: ['따뜻한 대화가 오가는 하루가 될 것입니다.', '소중한 사람과 함께하는 시간을 가져보세요.'],
    normal: ['평온한 관계가 유지됩니다.', '서로에 대한 이해가 필요한 시기입니다.'],
    bad: ['오해가 생길 수 있으니 대화에 신중하세요.', '감정적인 결정은 피하는 것이 좋습니다.'],
  },
  money: {
    excellent: ['재물운이 상승하는 날입니다! 💰', '예상치 못한 수입이 생길 수 있어요.'],
    good: ['안정적인 재정 상태가 유지됩니다.', '계획적인 소비로 저축이 가능한 날입니다.'],
    normal: ['큰 지출은 피하는 것이 좋습니다.', '현재 상태를 유지하는 것이 현명합니다.'],
    bad: ['충동구매를 주의하세요.', '금전적인 결정은 신중하게 내리세요.'],
  },
  health: {
    excellent: ['활력이 넘치는 하루입니다! 💪', '운동을 시작하기 좋은 날이에요.'],
    good: ['전반적으로 건강한 상태입니다.', '규칙적인 생활이 도움이 됩니다.'],
    normal: ['무리하지 않는 것이 좋습니다.', '충분한 휴식이 필요합니다.'],
    bad: ['피로가 쌓일 수 있으니 주의하세요.', '건강 관리에 신경 쓰세요.'],
  },
  career: {
    excellent: ['승진이나 좋은 기회가 올 수 있습니다! 🎯', '업무에서 인정받는 하루가 될 것입니다.'],
    good: ['꾸준한 노력이 성과로 이어집니다.', '동료들과의 협업이 잘 되는 날입니다.'],
    normal: ['평소처럼 업무를 진행하세요.', '새로운 도전보다는 안정을 추구하세요.'],
    bad: ['업무 실수에 주의하세요.', '중요한 결정은 미루는 것이 좋습니다.'],
  },
};

const LUCKY_COLORS = ['빨간색', '파란색', '노란색', '초록색', '보라색', '주황색', '분홍색', '하늘색', '금색', '은색'];
const LUCKY_DIRECTIONS = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '동북쪽', '서남쪽', '서북쪽'];

// 점수에 따른 메시지 가져오기
const getMessageByScore = (category: keyof typeof FORTUNE_MESSAGES, score: number, seed: number): string => {
  const messages = FORTUNE_MESSAGES[category];
  let level: 'excellent' | 'good' | 'normal' | 'bad';
  
  if (score >= 80) level = 'excellent';
  else if (score >= 60) level = 'good';
  else if (score >= 40) level = 'normal';
  else level = 'bad';
  
  const levelMessages = messages[level];
  const index = Math.floor(seededRandom(seed) * levelMessages.length);
  return levelMessages[index];
};

// Mock 운세 데이터 생성
const generateMockFortune = (type: 'zodiac' | 'horoscope', id: string, date: string): FortuneData => {
  const seed = generateSeed(date, id);
  
  const scores = {
    overall: Math.floor(seededRandom(seed) * 60) + 40,
    love: Math.floor(seededRandom(seed + 1) * 60) + 40,
    money: Math.floor(seededRandom(seed + 2) * 60) + 40,
    health: Math.floor(seededRandom(seed + 3) * 60) + 40,
    career: Math.floor(seededRandom(seed + 4) * 60) + 40,
  };
  
  const info = type === 'zodiac' 
    ? ZODIAC_DATA[id as ZodiacId] 
    : HOROSCOPE_DATA[id as HoroscopeId];
  
  return {
    date,
    type,
    id: id as ZodiacId | HoroscopeId,
    name: info.name,
    emoji: type === 'zodiac' ? (info as any).emoji : undefined,
    symbol: type === 'horoscope' ? (info as any).symbol : undefined,
    scores,
    messages: {
      overall: getMessageByScore('overall', scores.overall, seed + 10),
      love: getMessageByScore('love', scores.love, seed + 11),
      money: getMessageByScore('money', scores.money, seed + 12),
      health: getMessageByScore('health', scores.health, seed + 13),
      career: getMessageByScore('career', scores.career, seed + 14),
    },
    lucky: {
      color: LUCKY_COLORS[Math.floor(seededRandom(seed + 20) * LUCKY_COLORS.length)],
      number: Math.floor(seededRandom(seed + 21) * 45) + 1,
      direction: LUCKY_DIRECTIONS[Math.floor(seededRandom(seed + 22) * LUCKY_DIRECTIONS.length)],
    },
    ranking: 0, // 나중에 계산
  };
};

// Mock 랭킹 데이터 생성
const generateMockRanking = (type: 'zodiac' | 'horoscope', date: string): RankingItem[] => {
  const list = type === 'zodiac' ? ZODIAC_LIST : HOROSCOPE_LIST;
  
  const rankings = list.map((item, index) => {
    const fortune = generateMockFortune(type, item.id, date);
    const yesterdaySeed = generateSeed(
      new Date(new Date(date).getTime() - 86400000).toISOString().split('T')[0],
      item.id
    );
    const yesterdayScore = Math.floor(seededRandom(yesterdaySeed) * 60) + 40;
    
    return {
      rank: 0,
      type,
      id: item.id as ZodiacId | HoroscopeId,
      name: item.name,
      emoji: type === 'zodiac' ? (item as any).emoji : undefined,
      symbol: type === 'horoscope' ? (item as any).symbol : undefined,
      score: fortune.scores.overall,
      change: Math.floor((fortune.scores.overall - yesterdayScore) / 10),
    };
  });
  
  // 점수 기준 정렬 후 순위 부여
  rankings.sort((a, b) => b.score - a.score);
  rankings.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  return rankings;
};

// 행운 번호 생성
const generateLuckyNumbers = (seed: number): number[] => {
  const numbers: number[] = [];
  let attempts = 0;
  
  while (numbers.length < 6 && attempts < 100) {
    const num = Math.floor(seededRandom(seed + attempts) * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
    attempts++;
  }
  
  return numbers.sort((a, b) => a - b);
};

// ===== API 함수 =====

// 오늘 날짜 가져오기
const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 운세 조회
export const getFortune = async (
  type: 'zodiac' | 'horoscope',
  id: string,
  date?: string
): Promise<FortuneData> => {
  const targetDate = date || getToday();
  
  // Mock 데이터 반환 (실제 API 연동 시 아래 주석 해제)
  // const response = await api.get('/fortune/today', { params: { type, id, date: targetDate } });
  // return response.data.data;
  
  return generateMockFortune(type, id, targetDate);
};

// 랭킹 조회
export const getRanking = async (
  type: 'zodiac' | 'horoscope',
  date?: string
): Promise<RankingItem[]> => {
  const targetDate = date || getToday();
  
  // Mock 데이터 반환
  return generateMockRanking(type, targetDate);
};

// 행운 번호 생성
export const createLuckyNumbers = async (
  method: 'zodiac' | 'horoscope' | 'random',
  id?: string
): Promise<LuckyNumbers> => {
  const now = new Date();
  const seed = method === 'random' 
    ? now.getTime() 
    : generateSeed(getToday(), id || method);
  
  return {
    id: `lucky-${now.getTime()}`,
    userId: 'guest',
    method,
    numbers: generateLuckyNumbers(seed),
    bonusNumber: Math.floor(seededRandom(seed + 100) * 45) + 1,
    createdAt: now.toISOString(),
  };
};

// 운세 히스토리 조회
export const getFortuneHistory = async (
  type: 'zodiac' | 'horoscope',
  id: string,
  days: number = 7
): Promise<FortuneData[]> => {
  const history: FortuneData[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today.getTime() - i * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    history.push(generateMockFortune(type, id, dateStr));
  }
  
  return history;
};

export default api;
