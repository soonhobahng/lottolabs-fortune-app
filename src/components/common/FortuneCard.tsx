import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, getScoreColor } from '../../constants/colors';
import { FortuneData } from '../../types';
import { ScoreBar, ScoreCircle } from './ScoreBar';

interface FortuneCardProps {
  fortune: FortuneData;
  onPress?: () => void;
  showDetails?: boolean;
  style?: ViewStyle;
}

export const FortuneCard: React.FC<FortuneCardProps> = ({
  fortune,
  onPress,
  showDetails = false,
  style,
}) => {
  const icon = fortune.emoji || fortune.symbol || '🔮';
  const scoreColor = getScoreColor(fortune.scores.overall);
  
  const Content = (
    <View style={[styles.card, style]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name}>{fortune.name}</Text>
          <Text style={styles.date}>{fortune.date}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
          <Text style={styles.scoreText}>{fortune.scores.overall}점</Text>
        </View>
      </View>
      
      {/* 총운 메시지 */}
      <Text style={styles.message} numberOfLines={showDetails ? undefined : 2}>
        {fortune.messages.overall}
      </Text>
      
      {/* 상세 점수 */}
      {showDetails && (
        <View style={styles.detailsSection}>
          <ScoreBar score={fortune.scores.love} label="💕 연애운" />
          <ScoreBar score={fortune.scores.money} label="💰 재물운" />
          <ScoreBar score={fortune.scores.health} label="💪 건강운" />
          <ScoreBar score={fortune.scores.career} label="💼 직장운" />
        </View>
      )}
      
      {/* 행운 아이템 */}
      <View style={styles.luckySection}>
        <View style={styles.luckyItem}>
          <Text style={styles.luckyLabel}>행운 색상</Text>
          <Text style={styles.luckyValue}>{fortune.lucky.color}</Text>
        </View>
        <View style={styles.luckyItem}>
          <Text style={styles.luckyLabel}>행운 숫자</Text>
          <Text style={styles.luckyValue}>{fortune.lucky.number}</Text>
        </View>
        <View style={styles.luckyItem}>
          <Text style={styles.luckyLabel}>행운 방향</Text>
          <Text style={styles.luckyValue}>{fortune.lucky.direction}</Text>
        </View>
      </View>
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }
  
  return Content;
};

interface FortuneDetailCardProps {
  fortune: FortuneData;
}

export const FortuneDetailCard: React.FC<FortuneDetailCardProps> = ({ fortune }) => {
  const icon = fortune.emoji || fortune.symbol || '🔮';
  
  return (
    <View style={styles.detailCard}>
      {/* 상단 영역 */}
      <View style={styles.detailHeader}>
        <Text style={styles.detailIcon}>{icon}</Text>
        <Text style={styles.detailName}>{fortune.name}</Text>
        <ScoreCircle score={fortune.scores.overall} size={100} />
      </View>
      
      {/* 총운 메시지 */}
      <View style={styles.messageBox}>
        <Text style={styles.messageTitle}>📌 오늘의 총운</Text>
        <Text style={styles.detailMessage}>{fortune.messages.overall}</Text>
      </View>
      
      {/* 카테고리별 운세 */}
      <View style={styles.categorySection}>
        <CategoryItem
          emoji="💕"
          title="연애운"
          score={fortune.scores.love}
          message={fortune.messages.love}
        />
        <CategoryItem
          emoji="💰"
          title="재물운"
          score={fortune.scores.money}
          message={fortune.messages.money}
        />
        <CategoryItem
          emoji="💪"
          title="건강운"
          score={fortune.scores.health}
          message={fortune.messages.health}
        />
        <CategoryItem
          emoji="💼"
          title="직장운"
          score={fortune.scores.career}
          message={fortune.messages.career}
        />
      </View>
      
      {/* 행운 아이템 */}
      <View style={styles.luckyBox}>
        <Text style={styles.luckyTitle}>🍀 오늘의 행운</Text>
        <View style={styles.luckyGrid}>
          <View style={styles.luckyGridItem}>
            <Text style={styles.luckyGridLabel}>색상</Text>
            <Text style={styles.luckyGridValue}>{fortune.lucky.color}</Text>
          </View>
          <View style={styles.luckyGridItem}>
            <Text style={styles.luckyGridLabel}>숫자</Text>
            <Text style={styles.luckyGridValue}>{fortune.lucky.number}</Text>
          </View>
          <View style={styles.luckyGridItem}>
            <Text style={styles.luckyGridLabel}>방향</Text>
            <Text style={styles.luckyGridValue}>{fortune.lucky.direction}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface CategoryItemProps {
  emoji: string;
  title: string;
  score: number;
  message: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ emoji, title, score, message }) => {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryEmoji}>{emoji}</Text>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={[styles.categoryScore, { color: getScoreColor(score) }]}>
          {score}점
        </Text>
      </View>
      {expanded && (
        <Text style={styles.categoryMessage}>{message}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 36,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  detailsSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  luckySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  luckyItem: {
    alignItems: 'center',
  },
  luckyLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  luckyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  
  // Detail Card Styles
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 16,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  detailMessage: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryScore: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  categoryMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 10,
    lineHeight: 22,
  },
  luckyBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
  },
  luckyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  luckyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  luckyGridItem: {
    alignItems: 'center',
  },
  luckyGridLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  luckyGridValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondaryDark,
  },
});

export default FortuneCard;
