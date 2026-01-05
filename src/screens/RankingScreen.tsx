import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, getScoreColor, getRankColor } from '../constants/colors';
import { RankingItem } from '../types';
import { getRanking } from '../services/api';
import { useFortuneStore } from '../store/useFortuneStore';
import { LoadingSpinner, Card } from '../components/common/UIComponents';

type RankingType = 'zodiac' | 'horoscope';

export const RankingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useFortuneStore();
  
  const [selectedType, setSelectedType] = useState<RankingType>('zodiac');
  const [zodiacRanking, setZodiacRanking] = useState<RankingItem[]>([]);
  const [horoscopeRanking, setHoroscopeRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadRankings = async () => {
    setLoading(true);
    try {
      const [zRanking, hRanking] = await Promise.all([
        getRanking('zodiac'),
        getRanking('horoscope'),
      ]);
      setZodiacRanking(zRanking);
      setHoroscopeRanking(hRanking);
    } catch (error) {
      console.error('Failed to load rankings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadRankings();
  }, []);
  
  const currentRanking = selectedType === 'zodiac' ? zodiacRanking : horoscopeRanking;
  const userRankId = user ? (selectedType === 'zodiac' ? user.zodiac : user.horoscope) : null;
  
  const renderTop3 = () => {
    const top3 = currentRanking.slice(0, 3);
    if (top3.length < 3) return null;
    
    // 순서: 2등, 1등, 3등
    const ordered = [top3[1], top3[0], top3[2]];
    const heights = [100, 140, 80];
    const medalEmojis = ['🥈', '🥇', '🥉'];
    
    return (
      <View style={styles.top3Container}>
        {ordered.map((item, index) => (
          <View key={item.id} style={styles.top3Item}>
            <Text style={styles.top3Emoji}>{item.emoji || item.symbol}</Text>
            <Text style={styles.top3Name}>{item.name}</Text>
            <Text style={[styles.top3Score, { color: getScoreColor(item.score) }]}>
              {item.score}점
            </Text>
            <View style={[styles.top3Bar, { height: heights[index], backgroundColor: getRankColor(item.rank) }]}>
              <Text style={styles.top3Medal}>{medalEmojis[index]}</Text>
              <Text style={styles.top3Rank}>{item.rank}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  const renderRankingItem = ({ item }: { item: RankingItem }) => {
    const isUser = item.id === userRankId;
    
    return (
      <View style={[styles.rankingItem, isUser && styles.rankingItemHighlight]}>
        <Text style={[styles.rankNumber, { color: getRankColor(item.rank) }]}>
          {item.rank}
        </Text>
        <Text style={styles.rankEmoji}>{item.emoji || item.symbol}</Text>
        <View style={styles.rankInfo}>
          <Text style={styles.rankName}>
            {item.name}
            {isUser && <Text style={styles.myBadge}> (나)</Text>}
          </Text>
          <View style={styles.rankChange}>
            {item.change > 0 ? (
              <Text style={styles.changeUp}>▲ {item.change}</Text>
            ) : item.change < 0 ? (
              <Text style={styles.changeDown}>▼ {Math.abs(item.change)}</Text>
            ) : (
              <Text style={styles.changeNone}>-</Text>
            )}
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.rankScore, { color: getScoreColor(item.score) }]}>
            {item.score}
          </Text>
          <Text style={styles.scoreLabel}>점</Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>운세 랭킹</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'zodiac' && styles.tabActive]}
          onPress={() => setSelectedType('zodiac')}
        >
          <Text style={[styles.tabText, selectedType === 'zodiac' && styles.tabTextActive]}>
            🐲 띠별 랭킹
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'horoscope' && styles.tabActive]}
          onPress={() => setSelectedType('horoscope')}
        >
          <Text style={[styles.tabText, selectedType === 'horoscope' && styles.tabTextActive]}>
            ⭐ 별자리 랭킹
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <LoadingSpinner fullScreen message="랭킹을 불러오는 중..." />
      ) : (
        <ScrollView style={styles.content}>
          {/* 날짜 표시 */}
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 기준
          </Text>
          
          {/* TOP 3 */}
          {renderTop3()}
          
          {/* 전체 랭킹 */}
          <Card style={styles.rankingCard}>
            <Text style={styles.rankingTitle}>전체 랭킹</Text>
            {currentRanking.map((item) => (
              <View key={item.id}>
                {renderRankingItem({ item })}
              </View>
            ))}
          </Card>
          
          {/* 안내 문구 */}
          <Text style={styles.infoText}>
            랭킹은 매일 자정에 업데이트됩니다.
            운세 점수는 날짜와 띠/별자리에 따라 계산됩니다.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 60,
  },
  
  // Tab
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  
  // Content
  content: {
    flex: 1,
    padding: 16,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // TOP 3
  top3Container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  top3Item: {
    alignItems: 'center',
    marginHorizontal: 8,
    flex: 1,
  },
  top3Emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  top3Name: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  top3Score: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  top3Bar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top3Medal: {
    fontSize: 24,
    marginBottom: 4,
  },
  top3Rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Ranking Card
  rankingCard: {
    marginBottom: 16,
  },
  rankingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  
  // Ranking Item
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rankingItemHighlight: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rankNumber: {
    width: 28,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rankEmoji: {
    fontSize: 24,
    marginHorizontal: 12,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  myBadge: {
    fontSize: 12,
    color: Colors.secondary,
  },
  rankChange: {
    marginTop: 2,
  },
  changeUp: {
    fontSize: 12,
    color: Colors.success,
  },
  changeDown: {
    fontSize: 12,
    color: Colors.error,
  },
  changeNone: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rankScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  
  // Info
  infoText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
});

export default RankingScreen;
