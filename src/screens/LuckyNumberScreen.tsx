import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { LuckyNumbers } from '../types';
import { useFortuneStore } from '../store/useFortuneStore';
import { LottoBallsRow } from '../components/common/LottoBall';
import { Button, Card, Badge, LoadingSpinner } from '../components/common/UIComponents';
import { getZodiacById } from '../constants/zodiac';
import { getHoroscopeById } from '../constants/horoscope';

type GenerateMethod = 'zodiac' | 'horoscope' | 'random';

export const LuckyNumberScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, generateLuckyNumbers, luckyNumbers, dailyLuckyNumbersLeft, isLoading } = useFortuneStore();
  
  const [selectedMethod, setSelectedMethod] = useState<GenerateMethod>('zodiac');
  const [currentNumbers, setCurrentNumbers] = useState<LuckyNumbers | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const handleGenerate = async () => {
    if (dailyLuckyNumbersLeft <= 0) {
      return;
    }
    
    setIsGenerating(true);
    
    // 흔들기 애니메이션
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
    
    // 1초 딜레이 (연출용)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = await generateLuckyNumbers(selectedMethod);
    if (result) {
      setCurrentNumbers(result);
    }
    
    setIsGenerating(false);
  };
  
  const handleShare = async () => {
    if (!currentNumbers) return;
    
    const numbersText = currentNumbers.numbers.join(', ');
    const message = `🎱 LOTTO Labs 행운 번호\n\n${numbersText}${currentNumbers.bonusNumber ? ` + ${currentNumbers.bonusNumber}` : ''}\n\n행운을 빕니다! 🍀`;
    
    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };
  
  const userZodiac = user ? getZodiacById(user.zodiac) : null;
  const userHoroscope = user ? getHoroscopeById(user.horoscope) : null;
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>행운 번호 생성</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* 남은 횟수 */}
        <View style={styles.limitBanner}>
          <Text style={styles.limitText}>오늘 남은 생성 횟수</Text>
          <Badge
            text={`${dailyLuckyNumbersLeft}회`}
            variant={dailyLuckyNumbersLeft > 0 ? 'primary' : 'error'}
          />
        </View>
        
        {/* 생성 방식 선택 */}
        <Card style={styles.methodCard}>
          <Text style={styles.sectionTitle}>생성 방식 선택</Text>
          
          <View style={styles.methodOptions}>
            <TouchableOpacity
              style={[
                styles.methodOption,
                selectedMethod === 'zodiac' && styles.methodOptionActive,
              ]}
              onPress={() => setSelectedMethod('zodiac')}
            >
              <Text style={styles.methodEmoji}>{userZodiac?.emoji || '🐲'}</Text>
              <Text style={[
                styles.methodText,
                selectedMethod === 'zodiac' && styles.methodTextActive,
              ]}>
                띠 기반
              </Text>
              <Text style={styles.methodSubtext}>{userZodiac?.name || '띠'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.methodOption,
                selectedMethod === 'horoscope' && styles.methodOptionActive,
              ]}
              onPress={() => setSelectedMethod('horoscope')}
            >
              <Text style={styles.methodEmoji}>{userHoroscope?.symbol || '⭐'}</Text>
              <Text style={[
                styles.methodText,
                selectedMethod === 'horoscope' && styles.methodTextActive,
              ]}>
                별자리 기반
              </Text>
              <Text style={styles.methodSubtext}>{userHoroscope?.name || '별자리'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.methodOption,
                selectedMethod === 'random' && styles.methodOptionActive,
              ]}
              onPress={() => setSelectedMethod('random')}
            >
              <Text style={styles.methodEmoji}>🎲</Text>
              <Text style={[
                styles.methodText,
                selectedMethod === 'random' && styles.methodTextActive,
              ]}>
                랜덤
              </Text>
              <Text style={styles.methodSubtext}>완전 무작위</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* 번호 표시 영역 */}
        <Animated.View style={[styles.numberDisplay, { transform: [{ translateX: shakeAnimation }] }]}>
          {isGenerating ? (
            <View style={styles.generatingContainer}>
              <Text style={styles.generatingEmoji}>🎱</Text>
              <Text style={styles.generatingText}>번호 생성 중...</Text>
            </View>
          ) : currentNumbers ? (
            <View style={styles.numbersContainer}>
              <Text style={styles.numbersLabel}>🍀 오늘의 행운 번호</Text>
              <LottoBallsRow
                numbers={currentNumbers.numbers}
                bonusNumber={currentNumbers.bonusNumber}
                size="large"
                animated
              />
              <Text style={styles.generatedAt}>
                {new Date(currentNumbers.createdAt).toLocaleString('ko-KR')}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎱</Text>
              <Text style={styles.emptyText}>아래 버튼을 눌러</Text>
              <Text style={styles.emptyText}>행운 번호를 생성하세요!</Text>
            </View>
          )}
        </Animated.View>
        
        {/* 생성 버튼 */}
        <View style={styles.generateButtonContainer}>
          <Button
            title={dailyLuckyNumbersLeft > 0 ? '🎱 번호 생성하기' : '오늘 생성 횟수를 모두 사용했습니다'}
            onPress={handleGenerate}
            variant="primary"
            size="large"
            disabled={dailyLuckyNumbersLeft <= 0 || isGenerating}
            loading={isGenerating}
          />
          
          {currentNumbers && (
            <Button
              title="📤 공유하기"
              onPress={handleShare}
              variant="outline"
              size="medium"
              style={{ marginTop: 12 }}
            />
          )}
        </View>
        
        {/* 최근 생성 기록 */}
        {luckyNumbers.length > 0 && (
          <Card style={styles.historyCard}>
            <Text style={styles.sectionTitle}>최근 생성 기록</Text>
            {luckyNumbers.slice(0, 5).map((item, index) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyMeta}>
                  <Text style={styles.historyMethod}>
                    {item.method === 'zodiac' ? '띠' : item.method === 'horoscope' ? '별자리' : '랜덤'}
                  </Text>
                  <Text style={styles.historyTime}>
                    {new Date(item.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <LottoBallsRow numbers={item.numbers} size="small" />
              </View>
            ))}
          </Card>
        )}
        
        {/* 안내 문구 */}
        <Text style={styles.disclaimer}>
          ⚠️ 생성된 번호는 참고용이며, 실제 당첨을 보장하지 않습니다.
          복권 구매는 본인 책임 하에 이루어집니다.
        </Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // Limit Banner
  limitBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  limitText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  
  // Method Selection
  methodCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  methodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E8F4FD',
  },
  methodEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  methodTextActive: {
    color: Colors.primary,
  },
  methodSubtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  
  // Number Display
  numberDisplay: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatingContainer: {
    alignItems: 'center',
  },
  generatingEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  generatingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  numbersContainer: {
    alignItems: 'center',
    width: '100%',
  },
  numbersLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
  },
  generatedAt: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  
  // Generate Button
  generateButtonContainer: {
    marginBottom: 24,
  },
  
  // History
  historyCard: {
    marginBottom: 16,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyMethod: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  historyTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  
  // Disclaimer
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});

export default LuckyNumberScreen;
