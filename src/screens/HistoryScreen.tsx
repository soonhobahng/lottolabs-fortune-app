import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, getScoreColor } from '../constants/colors';
import { FortuneData } from '../types';
import { getFortuneHistory } from '../services/api';
import { useFortuneStore } from '../store/useFortuneStore';
import { LoadingSpinner, Card, Button, EmptyState } from '../components/common/UIComponents';
import { ScoreBar } from '../components/common/ScoreBar';

type HistoryType = 'zodiac' | 'horoscope';

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useFortuneStore();
  
  const [selectedType, setSelectedType] = useState<HistoryType>('zodiac');
  const [history, setHistory] = useState<FortuneData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Premium 체크 (임시로 모두 허용)
  const isPremium = user?.tier === 'premium' || user?.tier === 'vip' || true;
  const historyDays = user?.tier === 'vip' ? 30 : 7;
  
  const loadHistory = async () => {
    if (!user || !isPremium) return;
    
    setLoading(true);
    try {
      const id = selectedType === 'zodiac' ? user.zodiac : user.horoscope;
      const data = await getFortuneHistory(selectedType, id, historyDays);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadHistory();
  }, [selectedType, user]);
  
  const renderHistoryItem = ({ item, index }: { item: FortuneData; index: number }) => {
    const isToday = index === 0;
    const date = new Date(item.date);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    return (
      <Card style={isToday ? [styles.historyCard, styles.todayCard] : styles.historyCard}>
        <View style={styles.historyHeader}>
          <View>
            <Text style={styles.historyDate}>
              {date.getMonth() + 1}월 {date.getDate()}일 ({dayNames[date.getDay()]})
            </Text>
            {isToday && <Text style={styles.todayBadge}>오늘</Text>}
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item.scores.overall) }]}>
            <Text style={styles.scoreText}>{item.scores.overall}점</Text>
          </View>
        </View>
        
        <Text style={styles.historyMessage} numberOfLines={2}>
          {item.messages.overall}
        </Text>
        
        <View style={styles.scoreGrid}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>💕 연애</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.scores.love) }]}>
              {item.scores.love}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>💰 재물</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.scores.money) }]}>
              {item.scores.money}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>💪 건강</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.scores.health) }]}>
              {item.scores.health}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>💼 직장</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.scores.career) }]}>
              {item.scores.career}
            </Text>
          </View>
        </View>
        
        <View style={styles.luckyRow}>
          <Text style={styles.luckyItem}>🎨 {item.lucky.color}</Text>
          <Text style={styles.luckyItem}>🔢 {item.lucky.number}</Text>
          <Text style={styles.luckyItem}>🧭 {item.lucky.direction}</Text>
        </View>
      </Card>
    );
  };
  
  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>운세 히스토리</Text>
          <View style={styles.placeholder} />
        </View>
        
        <EmptyState
          icon="🔒"
          title="Premium 전용 기능"
          message="운세 히스토리는 Premium 또는 VIP 회원만 이용 가능합니다."
          action={{
            label: '업그레이드하기',
            onPress: () => {/* TODO: Navigate to upgrade */},
          }}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>운세 히스토리</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'zodiac' && styles.tabActive]}
          onPress={() => setSelectedType('zodiac')}
        >
          <Text style={[styles.tabText, selectedType === 'zodiac' && styles.tabTextActive]}>
            🐲 띠별
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'horoscope' && styles.tabActive]}
          onPress={() => setSelectedType('horoscope')}
        >
          <Text style={[styles.tabText, selectedType === 'horoscope' && styles.tabTextActive]}>
            ⭐ 별자리
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 기간 안내 */}
      <View style={styles.periodBanner}>
        <Text style={styles.periodText}>
          최근 {historyDays}일간의 운세 기록
        </Text>
      </View>
      
      {loading ? (
        <LoadingSpinner fullScreen message="히스토리를 불러오는 중..." />
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  
  // Period Banner
  periodBanner: {
    backgroundColor: Colors.surface,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  periodText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  
  // List
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // History Card
  historyCard: {
    marginBottom: 12,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  todayBadge: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // Score Grid
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Lucky Row
  luckyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  luckyItem: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default HistoryScreen;
