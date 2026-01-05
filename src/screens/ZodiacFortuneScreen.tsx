import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { RootStackParamList, FortuneData, ZodiacId } from '../types';
import { ZODIAC_LIST, getZodiacById } from '../constants/zodiac';
import { getFortune } from '../services/api';
import { FortuneDetailCard } from '../components/common/FortuneCard';
import { LoadingSpinner, Button } from '../components/common/UIComponents';

type ZodiacFortuneRouteProp = RouteProp<RootStackParamList, 'ZodiacFortune'>;

export const ZodiacFortuneScreen: React.FC = () => {
  const route = useRoute<ZodiacFortuneRouteProp>();
  const navigation = useNavigation();
  const { zodiacId } = route.params;
  
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacId>(zodiacId);
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loadFortune = async (id: ZodiacId) => {
    setLoading(true);
    try {
      const data = await getFortune('zodiac', id);
      setFortune(data);
    } catch (error) {
      console.error('Failed to load fortune:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadFortune(selectedZodiac);
  }, [selectedZodiac]);
  
  const handleZodiacSelect = (id: ZodiacId) => {
    setSelectedZodiac(id);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>띠별 운세</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 띠 선택 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {ZODIAC_LIST.map((zodiac) => (
          <TouchableOpacity
            key={zodiac.id}
            style={[
              styles.tabItem,
              selectedZodiac === zodiac.id && styles.tabItemActive,
            ]}
            onPress={() => handleZodiacSelect(zodiac.id)}
          >
            <Text style={styles.tabEmoji}>{zodiac.emoji}</Text>
            <Text
              style={[
                styles.tabText,
                selectedZodiac === zodiac.id && styles.tabTextActive,
              ]}
            >
              {zodiac.name}
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
            <FortuneDetailCard fortune={fortune} />
            
            {/* 행운 번호 생성 CTA */}
            <View style={styles.ctaContainer}>
              <Button
                title="🎱 이 띠로 행운 번호 생성하기"
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
  },
  tabItemActive: {
    backgroundColor: Colors.primary,
  },
  tabEmoji: {
    fontSize: 24,
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
  
  // CTA
  ctaContainer: {
    padding: 16,
    marginTop: 8,
  },
});

export default ZodiacFortuneScreen;
