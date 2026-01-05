import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { RootStackParamList, FortuneData, HoroscopeId } from '../types';
import { HOROSCOPE_LIST, getHoroscopeById, ELEMENT_COLORS } from '../constants/horoscope';
import { getFortune } from '../services/api';
import { FortuneDetailCard } from '../components/common/FortuneCard';
import { LoadingSpinner, Button, Badge } from '../components/common/UIComponents';

type HoroscopeFortuneRouteProp = RouteProp<RootStackParamList, 'HoroscopeFortune'>;

export const HoroscopeFortuneScreen: React.FC = () => {
  const route = useRoute<HoroscopeFortuneRouteProp>();
  const navigation = useNavigation();
  const { horoscopeId } = route.params;
  
  const [selectedHoroscope, setSelectedHoroscope] = useState<HoroscopeId>(horoscopeId);
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const currentHoroscope = getHoroscopeById(selectedHoroscope);
  
  const loadFortune = async (id: HoroscopeId) => {
    setLoading(true);
    try {
      const data = await getFortune('horoscope', id);
      setFortune(data);
    } catch (error) {
      console.error('Failed to load fortune:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadFortune(selectedHoroscope);
  }, [selectedHoroscope]);
  
  const handleHoroscopeSelect = (id: HoroscopeId) => {
    setSelectedHoroscope(id);
  };
  
  const getElementLabel = (element: string) => {
    const labels: Record<string, string> = {
      fire: '🔥 불',
      earth: '🌍 흙',
      air: '💨 공기',
      water: '💧 물',
    };
    return labels[element] || element;
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>별자리 운세</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 별자리 선택 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {HOROSCOPE_LIST.map((horoscope) => (
          <TouchableOpacity
            key={horoscope.id}
            style={[
              styles.tabItem,
              selectedHoroscope === horoscope.id && styles.tabItemActive,
              { borderColor: ELEMENT_COLORS[horoscope.element] },
            ]}
            onPress={() => handleHoroscopeSelect(horoscope.id)}
          >
            <Text style={styles.tabSymbol}>{horoscope.symbol}</Text>
            <Text
              style={[
                styles.tabText,
                selectedHoroscope === horoscope.id && styles.tabTextActive,
              ]}
            >
              {horoscope.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* 운세 상세 */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <LoadingSpinner message="운세를 불러오는 중..." />
        ) : fortune ? (
          <>
            {/* 별자리 정보 */}
            <View style={styles.horoscopeInfo}>
              <Text style={styles.horoscopeSymbol}>{currentHoroscope.symbol}</Text>
              <Text style={styles.horoscopeName}>{currentHoroscope.name}</Text>
              <Text style={styles.horoscopeEnglish}>{currentHoroscope.englishName}</Text>
              <View style={styles.horoscopeMeta}>
                <View style={[styles.elementBadge, { backgroundColor: ELEMENT_COLORS[currentHoroscope.element] }]}>
                  <Text style={styles.elementText}>{getElementLabel(currentHoroscope.element)}</Text>
                </View>
                <Text style={styles.dateRange}>{currentHoroscope.dateRange}</Text>
              </View>
            </View>
            
            <FortuneDetailCard fortune={fortune} />
            
            {/* 행운 번호 생성 CTA */}
            <View style={styles.ctaContainer}>
              <Button
                title="🎱 이 별자리로 행운 번호 생성하기"
                onPress={() => navigation.navigate('LuckyNumber' as never)}
                variant="primary"
                size="large"
              />
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>운세를 불러올 수 없습니다.</Text>
        )}
      </ScrollView>
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabSymbol: {
    fontSize: 22,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  errorText: {
    textAlign: 'center',
    color: Colors.error,
    marginTop: 40,
  },
  
  // Horoscope Info
  horoscopeInfo: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  horoscopeSymbol: {
    fontSize: 48,
    marginBottom: 8,
  },
  horoscopeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  horoscopeEnglish: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  horoscopeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  elementBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  elementText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  dateRange: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  
  // CTA
  ctaContainer: {
    padding: 16,
    marginTop: 8,
  },
});

export default HoroscopeFortuneScreen;
