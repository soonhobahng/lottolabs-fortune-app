import { HoroscopeInfo, HoroscopeId } from '../types';

// 12별자리 데이터
export const HOROSCOPE_DATA: Record<HoroscopeId, HoroscopeInfo> = {
  aries: {
    id: 'aries',
    name: '양자리',
    symbol: '♈',
    englishName: 'Aries',
    dateRange: '3월 21일 - 4월 19일',
    element: 'fire',
  },
  taurus: {
    id: 'taurus',
    name: '황소자리',
    symbol: '♉',
    englishName: 'Taurus',
    dateRange: '4월 20일 - 5월 20일',
    element: 'earth',
  },
  gemini: {
    id: 'gemini',
    name: '쌍둥이자리',
    symbol: '♊',
    englishName: 'Gemini',
    dateRange: '5월 21일 - 6월 20일',
    element: 'air',
  },
  cancer: {
    id: 'cancer',
    name: '게자리',
    symbol: '♋',
    englishName: 'Cancer',
    dateRange: '6월 21일 - 7월 22일',
    element: 'water',
  },
  leo: {
    id: 'leo',
    name: '사자자리',
    symbol: '♌',
    englishName: 'Leo',
    dateRange: '7월 23일 - 8월 22일',
    element: 'fire',
  },
  virgo: {
    id: 'virgo',
    name: '처녀자리',
    symbol: '♍',
    englishName: 'Virgo',
    dateRange: '8월 23일 - 9월 22일',
    element: 'earth',
  },
  libra: {
    id: 'libra',
    name: '천칭자리',
    symbol: '♎',
    englishName: 'Libra',
    dateRange: '9월 23일 - 10월 22일',
    element: 'air',
  },
  scorpio: {
    id: 'scorpio',
    name: '전갈자리',
    symbol: '♏',
    englishName: 'Scorpio',
    dateRange: '10월 23일 - 11월 21일',
    element: 'water',
  },
  sagittarius: {
    id: 'sagittarius',
    name: '사수자리',
    symbol: '♐',
    englishName: 'Sagittarius',
    dateRange: '11월 22일 - 12월 21일',
    element: 'fire',
  },
  capricorn: {
    id: 'capricorn',
    name: '염소자리',
    symbol: '♑',
    englishName: 'Capricorn',
    dateRange: '12월 22일 - 1월 19일',
    element: 'earth',
  },
  aquarius: {
    id: 'aquarius',
    name: '물병자리',
    symbol: '♒',
    englishName: 'Aquarius',
    dateRange: '1월 20일 - 2월 18일',
    element: 'air',
  },
  pisces: {
    id: 'pisces',
    name: '물고기자리',
    symbol: '♓',
    englishName: 'Pisces',
    dateRange: '2월 19일 - 3월 20일',
    element: 'water',
  },
};

// 별자리 목록 배열 (순서대로)
export const HOROSCOPE_LIST: HoroscopeInfo[] = [
  HOROSCOPE_DATA.aries,
  HOROSCOPE_DATA.taurus,
  HOROSCOPE_DATA.gemini,
  HOROSCOPE_DATA.cancer,
  HOROSCOPE_DATA.leo,
  HOROSCOPE_DATA.virgo,
  HOROSCOPE_DATA.libra,
  HOROSCOPE_DATA.scorpio,
  HOROSCOPE_DATA.sagittarius,
  HOROSCOPE_DATA.capricorn,
  HOROSCOPE_DATA.aquarius,
  HOROSCOPE_DATA.pisces,
];

// 원소별 별자리 그룹
export const HOROSCOPE_BY_ELEMENT = {
  fire: [HOROSCOPE_DATA.aries, HOROSCOPE_DATA.leo, HOROSCOPE_DATA.sagittarius],
  earth: [HOROSCOPE_DATA.taurus, HOROSCOPE_DATA.virgo, HOROSCOPE_DATA.capricorn],
  air: [HOROSCOPE_DATA.gemini, HOROSCOPE_DATA.libra, HOROSCOPE_DATA.aquarius],
  water: [HOROSCOPE_DATA.cancer, HOROSCOPE_DATA.scorpio, HOROSCOPE_DATA.pisces],
};

// 원소 이름 (한글)
export const ELEMENT_NAMES = {
  fire: '불',
  earth: '흙',
  air: '공기',
  water: '물',
};

// 원소 색상
export const ELEMENT_COLORS = {
  fire: '#FF6B6B',
  earth: '#8B7355',
  air: '#87CEEB',
  water: '#4169E1',
};

// 생년월일로 별자리 계산
export const getHoroscopeByDate = (month: number, day: number): HoroscopeInfo => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return HOROSCOPE_DATA.aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return HOROSCOPE_DATA.taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return HOROSCOPE_DATA.gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return HOROSCOPE_DATA.cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return HOROSCOPE_DATA.leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return HOROSCOPE_DATA.virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return HOROSCOPE_DATA.libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return HOROSCOPE_DATA.scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return HOROSCOPE_DATA.sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return HOROSCOPE_DATA.capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return HOROSCOPE_DATA.aquarius;
  return HOROSCOPE_DATA.pisces;
};

// 별자리 ID로 정보 가져오기
export const getHoroscopeById = (id: HoroscopeId): HoroscopeInfo => {
  return HOROSCOPE_DATA[id];
};
