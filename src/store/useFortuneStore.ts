import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FortuneData, RankingItem, LuckyNumbers, User, ZodiacId, HoroscopeId } from '../types';
import { getFortune, getRanking, createLuckyNumbers } from '../services/api';
import { getZodiacByYear } from '../constants/zodiac';
import { getHoroscopeByDate } from '../constants/horoscope';

interface FortuneState {
  // 사용자 정보
  user: User | null;
  isLoggedIn: boolean;
  
  // 운세 데이터
  todayZodiacFortune: FortuneData | null;
  todayHoroscopeFortune: FortuneData | null;
  zodiacRanking: RankingItem[];
  horoscopeRanking: RankingItem[];
  
  // 행운 번호
  luckyNumbers: LuckyNumbers[];
  dailyLuckyNumbersLeft: number;
  
  // 로딩 상태
  isLoading: boolean;
  error: string | null;
  
  // 액션
  setUser: (user: User | null) => void;
  setUserBirthInfo: (birthYear: number, birthMonth: number, birthDay: number) => void;
  
  fetchTodayFortune: (type: 'zodiac' | 'horoscope') => Promise<void>;
  fetchRanking: (type: 'zodiac' | 'horoscope') => Promise<void>;
  
  generateLuckyNumbers: (method: 'zodiac' | 'horoscope' | 'random') => Promise<LuckyNumbers | null>;
  clearLuckyNumbers: () => void;
  
  resetDailyLimit: () => void;
  clearError: () => void;
}

export const useFortuneStore = create<FortuneState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isLoggedIn: false,
      
      todayZodiacFortune: null,
      todayHoroscopeFortune: null,
      zodiacRanking: [],
      horoscopeRanking: [],
      
      luckyNumbers: [],
      dailyLuckyNumbersLeft: 3, // Free 티어 기본값
      
      isLoading: false,
      error: null,
      
      // 사용자 설정
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      setUserBirthInfo: (birthYear, birthMonth, birthDay) => {
        const zodiac = getZodiacByYear(birthYear);
        const horoscope = getHoroscopeByDate(birthMonth, birthDay);
        
        const user: User = {
          id: 'guest',
          nickname: '게스트',
          birthYear,
          birthMonth,
          birthDay,
          zodiac: zodiac.id,
          horoscope: horoscope.id,
          tier: 'free',
          dailyLuckyNumbersLeft: 3,
        };
        
        set({ user, isLoggedIn: false });
      },
      
      // 오늘의 운세 가져오기
      fetchTodayFortune: async (type) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const id = type === 'zodiac' ? user.zodiac : user.horoscope;
          const fortune = await getFortune(type, id);
          
          if (type === 'zodiac') {
            set({ todayZodiacFortune: fortune });
          } else {
            set({ todayHoroscopeFortune: fortune });
          }
        } catch (error) {
          set({ error: '운세를 불러오는데 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // 랭킹 가져오기
      fetchRanking: async (type) => {
        set({ isLoading: true, error: null });
        
        try {
          const ranking = await getRanking(type);
          
          if (type === 'zodiac') {
            set({ zodiacRanking: ranking });
          } else {
            set({ horoscopeRanking: ranking });
          }
        } catch (error) {
          set({ error: '랭킹을 불러오는데 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // 행운 번호 생성
      generateLuckyNumbers: async (method) => {
        const { user, dailyLuckyNumbersLeft, luckyNumbers } = get();
        
        if (dailyLuckyNumbersLeft <= 0) {
          set({ error: '오늘 생성 가능한 횟수를 모두 사용했습니다.' });
          return null;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const id = user 
            ? (method === 'zodiac' ? user.zodiac : method === 'horoscope' ? user.horoscope : undefined)
            : undefined;
          
          const newNumbers = await createLuckyNumbers(method, id);
          
          set({
            luckyNumbers: [newNumbers, ...luckyNumbers].slice(0, 10), // 최근 10개만 유지
            dailyLuckyNumbersLeft: dailyLuckyNumbersLeft - 1,
          });
          
          return newNumbers;
        } catch (error) {
          set({ error: '번호 생성에 실패했습니다.' });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearLuckyNumbers: () => set({ luckyNumbers: [] }),
      
      // 일일 제한 리셋 (자정에 호출)
      resetDailyLimit: () => {
        const { user } = get();
        const limit = user?.tier === 'vip' ? 999 : user?.tier === 'premium' ? 10 : 3;
        set({ dailyLuckyNumbersLeft: limit });
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'lottolabs-fortune-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        luckyNumbers: state.luckyNumbers,
        dailyLuckyNumbersLeft: state.dailyLuckyNumbersLeft,
      }),
    }
  )
);

export default useFortuneStore;
