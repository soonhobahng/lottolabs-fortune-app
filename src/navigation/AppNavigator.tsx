import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList, BottomTabParamList } from '../types';
import { Colors } from '../constants/colors';

// Screens
import FortuneMainScreen from '../screens/FortuneMainScreen';
import ZodiacFortuneScreen from '../screens/ZodiacFortuneScreen';
import HoroscopeFortuneScreen from '../screens/HoroscopeFortuneScreen';
import LuckyNumberScreen from '../screens/LuckyNumberScreen';
import RankingScreen from '../screens/RankingScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Tab Icon Component
interface TabIconProps {
  emoji: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={styles.tabIcon}>{emoji}</Text>
  </View>
);

// Bottom Tab Navigator
const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="FortuneHome"
        component={FortuneMainScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Zodiac"
        component={ZodiacPlaceholder}
        options={{
          tabBarLabel: '띠별',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🐲" focused={focused} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            (navigation as any).navigate('ZodiacFortune', { zodiacId: 'dragon' });
          },
        })}
      />
      <Tab.Screen
        name="LuckyNumbers"
        component={LuckyPlaceholder}
        options={{
          tabBarLabel: '행운번호',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎱" focused={focused} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            (navigation as any).navigate('LuckyNumber');
          },
        })}
      />
      <Tab.Screen
        name="Horoscope"
        component={HoroscopePlaceholder}
        options={{
          tabBarLabel: '별자리',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            (navigation as any).navigate('HoroscopeFortune', { horoscopeId: 'aries' });
          },
        })}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingPlaceholder}
        options={{
          tabBarLabel: '랭킹',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            (navigation as any).navigate('Ranking');
          },
        })}
      />
    </Tab.Navigator>
  );
};

// Placeholder screens for tab navigation
const ZodiacPlaceholder = () => <View />;
const HoroscopePlaceholder = () => <View />;
const LuckyPlaceholder = () => <View />;
const RankingPlaceholder = () => <View />;

// Main App Navigator
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="ZodiacFortune" component={ZodiacFortuneScreen} />
        <Stack.Screen name="HoroscopeFortune" component={HoroscopeFortuneScreen} />
        <Stack.Screen name="LuckyNumber" component={LuckyNumberScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingBottom: 8,
    height: 65,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabIconContainer: {
    padding: 4,
    borderRadius: 8,
  },
  tabIconFocused: {
    backgroundColor: '#E8F4FD',
  },
  tabIcon: {
    fontSize: 22,
  },
});

export default AppNavigator;
