import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getBallColor } from '../../constants/colors';

interface LottoBallProps {
  number: number;
  size?: 'small' | 'medium' | 'large';
  isBonus?: boolean;
  animated?: boolean;
}

const SIZES = {
  small: { ball: 32, font: 14 },
  medium: { ball: 44, font: 18 },
  large: { ball: 56, font: 24 },
};

export const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'medium',
  isBonus = false,
  animated = false,
}) => {
  const { ball: ballSize, font: fontSize } = SIZES[size];
  const backgroundColor = getBallColor(number);
  
  const animatedScale = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (animated) {
      Animated.spring(animatedScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();
    } else {
      animatedScale.setValue(1);
    }
  }, [number, animated]);
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: ballSize,
          height: ballSize,
          borderRadius: ballSize / 2,
          backgroundColor,
          transform: [{ scale: animatedScale }],
        },
        isBonus && styles.bonusBall,
      ]}
    >
      <Text style={[styles.number, { fontSize }]}>{number}</Text>
      {isBonus && <Text style={styles.bonusLabel}>+</Text>}
    </Animated.View>
  );
};

interface LottoBallsRowProps {
  numbers: number[];
  bonusNumber?: number;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const LottoBallsRow: React.FC<LottoBallsRowProps> = ({
  numbers,
  bonusNumber,
  size = 'medium',
  animated = false,
}) => {
  return (
    <View style={styles.row}>
      {numbers.map((num, index) => (
        <LottoBall
          key={`${num}-${index}`}
          number={num}
          size={size}
          animated={animated}
        />
      ))}
      {bonusNumber && (
        <>
          <Text style={styles.plusSign}>+</Text>
          <LottoBall
            number={bonusNumber}
            size={size}
            isBonus
            animated={animated}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  bonusBall: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  number: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bonusLabel: {
    position: 'absolute',
    top: -8,
    right: -4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  plusSign: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A0AEC0',
    marginHorizontal: 8,
  },
});

export default LottoBall;
