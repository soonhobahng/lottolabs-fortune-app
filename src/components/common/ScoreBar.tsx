import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getScoreColor, Colors } from '../../constants/colors';

interface ScoreBarProps {
  score: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  height?: number;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  label,
  showPercentage = true,
  animated = true,
  height = 12,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedScore = useRef(new Animated.Value(0)).current;
  const color = getScoreColor(score);
  
  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue: score,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedScore, {
          toValue: score,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      animatedWidth.setValue(score);
      animatedScore.setValue(score);
    }
  }, [score, animated]);
  
  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color }]}>{score}점</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolate,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const color = getScoreColor(score);
  
  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: score,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(score);
    }
  }, [score, animated]);
  
  const [displayScore, setDisplayScore] = React.useState(0);
  
  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });
    return () => animatedValue.removeListener(listener);
  }, []);
  
  return (
    <View style={[styles.circleContainer, { width: size, height: size }]}>
      <View
        style={[
          styles.circleTrack,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
          },
        ]}
      />
      <View style={styles.circleContent}>
        <Text style={[styles.circleScore, { color, fontSize: size * 0.35 }]}>
          {displayScore}
        </Text>
        <Text style={styles.circleLabel}>점</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  track: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 6,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleTrack: {
    position: 'absolute',
    borderColor: Colors.backgroundDark,
  },
  circleContent: {
    alignItems: 'center',
  },
  circleScore: {
    fontWeight: 'bold',
  },
  circleLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -4,
  },
});

export default ScoreBar;
