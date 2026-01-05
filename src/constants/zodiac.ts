import { ZodiacInfo, ZodiacId } from '../types';

// 12지신 데이터
export const ZODIAC_DATA: Record<ZodiacId, ZodiacInfo> = {
  rat: {
    id: 'rat',
    name: '쥐띠',
    emoji: '🐭',
    years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
  },
  ox: {
    id: 'ox',
    name: '소띠',
    emoji: '🐮',
    years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
  },
  tiger: {
    id: 'tiger',
    name: '호랑이띠',
    emoji: '🐯',
    years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
  },
  rabbit: {
    id: 'rabbit',
    name: '토끼띠',
    emoji: '🐰',
    years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
  },
  dragon: {
    id: 'dragon',
    name: '용띠',
    emoji: '🐲',
    years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
  },
  snake: {
    id: 'snake',
    name: '뱀띠',
    emoji: '🐍',
    years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
  },
  horse: {
    id: 'horse',
    name: '말띠',
    emoji: '🐴',
    years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
  },
  sheep: {
    id: 'sheep',
    name: '양띠',
    emoji: '🐑',
    years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
  },
  monkey: {
    id: 'monkey',
    name: '원숭이띠',
    emoji: '🐵',
    years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
  },
  rooster: {
    id: 'rooster',
    name: '닭띠',
    emoji: '🐔',
    years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
  },
  dog: {
    id: 'dog',
    name: '개띠',
    emoji: '🐶',
    years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
  },
  pig: {
    id: 'pig',
    name: '돼지띠',
    emoji: '🐷',
    years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
  },
};

// 띠 목록 배열 (순서대로)
export const ZODIAC_LIST: ZodiacInfo[] = [
  ZODIAC_DATA.rat,
  ZODIAC_DATA.ox,
  ZODIAC_DATA.tiger,
  ZODIAC_DATA.rabbit,
  ZODIAC_DATA.dragon,
  ZODIAC_DATA.snake,
  ZODIAC_DATA.horse,
  ZODIAC_DATA.sheep,
  ZODIAC_DATA.monkey,
  ZODIAC_DATA.rooster,
  ZODIAC_DATA.dog,
  ZODIAC_DATA.pig,
];

// 출생년도로 띠 계산
export const getZodiacByYear = (year: number): ZodiacInfo => {
  const index = (year - 4) % 12;
  return ZODIAC_LIST[index];
};

// 띠 ID로 정보 가져오기
export const getZodiacById = (id: ZodiacId): ZodiacInfo => {
  return ZODIAC_DATA[id];
};
