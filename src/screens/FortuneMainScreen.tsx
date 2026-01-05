import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList, FortuneData, RankingItem } from '../types';
import { useFortuneStore } from '../store/useFortuneStore';
import { getFortune, getRanking } from '../services/api';
import { FortuneCard } from '../components/common/FortuneCard';
import { LottoBallsRow } from '../components/common/LottoBall';
import { LoadingSpinner, Card, Button } from '../components/common/UIComponents';
import { ZODIAC_LIST } from '../constants/zodiac';
import { HOROSCOPE_LIST } from '../constants/horoscope';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FortuneMainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, setUserBirthInfo, todayZodiacFortune, fetchTodayFortune } = useFortuneStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [zodiacRanking, setZodiacRanking] = useState<RankingItem[]>([]);
  const [horoscopeRanking, setHoroscopeRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 기본 사용자 설정 (임시)
  useEffect(() => {
    if (!user) {
      // 테스트용 기본값: 1990년 5월 15일 (뱀띠, 황소자리)
      setUserBirthInfo(1990, 5, 15);
    }
  }, []);
  
  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      await fetchTodayFortune('zodiac');
      const [zRanking, hRanking] = await Promise.all([
        getRanking('zodiac'),
        getRanking('horoscope'),
      ]);
      setZodiacRanking(zRanking);
      setHoroscopeRanking(hRanking);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  if (loading || !user) {
    return <LoadingSpinner fullScreen message="운세를 불러오는 중..." />;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🎰 LOTTO Labs</Text>
          <Text style={styles.subtitle}>오늘의 운세</Text>
        </View>
        
        {/* 오늘의 운세 카드 */}
        {todayZodiacFortune && (
          <FortuneCard
            fortune={todayZodiacFortune}
            onPress={() => navigation.navigate('ZodiacFortune', { zodiacId: user.zodiac })}
          />
        )}
        
        {/* 퀵 메뉴 */}
        <View style={styles.quickMenu}>
          <QuickMenuItem
            emoji="🐲"
            title="띠별 운세"
            onPress={() => navigation.navigate('ZodiacFortune', { zodiacId: user.zodiac })}
          />
          <QuickMenuItem
            emoji="⭐"
            title="별자리 운세"
            onPress={() => navigation.navigate('HoroscopeFortune', { horoscopeId: user.horoscope })}
          />
          <QuickMenuItem
            emoji="🎱"
            title="행운 번호"
            onPress={() => navigation.navigate('LuckyNumber')}
          />
          <QuickMenuItem
            emoji="🏆"
            title="운세 랭킹"
            onPress={() => navigation.navigate('Ranking')}
          />
        </View>
        
        {/* 랭킹 프리뷰 */}
        <Card style={styles.rankingPreview}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 오늘의 운세 랭킹</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Ranking')}>
              <Text style={styles.seeAllText}>전체보기 →</Text>
            </TouchableOpacity>
          </View>
          
          {/* 띠별 TOP 3 */}
          <Text style={styles.rankingSubtitle}>띠별 TOP 3</Text>
          {zodiacRanking.slice(0, 3).map((item) => (
            <RankingPreviewItem key={item.id} item={item} />
          ))}
          
          {/* 별자리 TOP 3 */}
          <Text style={[styles.rankingSubtitle, { marginTop: 16 }]}>별자리 TOP 3</Text>
          {horoscopeRanking.slice(0, 3).map((item) => (
            <RankingPreviewItem key={item.id} item={item} />
          ))}
        </Card>
        
        {/* 행운 번호 CTA */}
        <Card style={styles.luckyNumberCTA}>
          <Text style={styles.ctaTitle}>🎱 오늘의 행운 번호 생성하기</Text>
          <Text style={styles.ctaDescription}>
            당신의 띠와 별자리를 기반으로 행운의 번호를 추천해드려요!
          </Text>
          <Button
            title="번호 생성하기"
            onPress={() => navigation.navigate('LuckyNumber')}
            variant="primary"
            size="large"
          />
        </Card>
        
        {/* 법적 고지 */}
        <Text style={styles.disclaimer}>
          ⚠️ 본 서비스는 통계 분석 및 교육 목적의 정보 제공 서비스입니다.
          실제 복권 당첨을 보장하지 않습니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// 퀵 메뉴 아이템
interface QuickMenuItemProps {
  emoji: string;
  title: string;
  onPress: () => void;
}

const QuickMenuItem: React.FC<QuickMenuItemProps> = ({ emoji, title, onPress }) => (
  <TouchableOpacity style={styles.quickMenuItem} onPress={onPress}>
    <Text style={styles.quickMenuEmoji}>{emoji}</Text>
    <Text style={styles.quickMenuTitle}>{title}</Text>
  </TouchableOpacity>
);

// 랭킹 프리뷰 아이템
interface RankingPreviewItemProps {
  item: RankingItem;
}

const RankingPreviewItem: React.FC<RankingPreviewItemProps> = ({ item }) => {
  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const rankColor = item.rank <= 3 ? rankColors[item.rank - 1] : Colors.textMuted;
  
  return (
    <View style={styles.rankingItem}>
      <Text style={[styles.rankNumber, { color: rankColor }]}>{item.rank}</Text>
      <Text style={styles.rankEmoji}>{item.emoji || item.symbol}</Text>
      <Text style={styles.rankName}>{item.name}</Text>
      <Text style={styles.rankScore}>{item.score}점</Text>
      <Text style={[
        styles.rankChange,
        { color: item.change > 0 ? Colors.success : item.change < 0 ? Colors.error : Colors.textMuted }
      ]}>
        {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '-'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  
  // Quick Menu
  quickMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  quickMenuItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickMenuEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickMenuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // Ranking Preview
  rankingPreview: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.primary,
  },
  rankingSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rankNumber: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rankEmoji: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  rankName: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  rankScore: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  rankChange: {
    width: 32,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  
  // Lucky Number CTA
  luckyNumberCTA: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 24,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  
  // Disclaimer
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});

export default FortuneMainScreen;
