import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { Colors, Shadows } from '../../constants/theme';
import Animated, { FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

interface ElevatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

export function ElevatedCard({ children, style, delay = 0 }: ElevatedCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withRepeat(withSequence(withTiming(0, { duration: 0 }), withTiming(100, { duration: 3000 })), -1, true) }],
    opacity: withRepeat(withSequence(withTiming(0.1), withTiming(0.4), withTiming(0.1)), -1, true),
  }));

  return (
    <Animated.View 
      entering={FadeInUp.delay(delay).springify().damping(12)}
      style={[
        styles.card, 
        { 
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : theme.card, 
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.border,
          borderWidth: 1,
        }, 
        Shadows.medium, 
        style
      ]}
    >
      {isDark && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.scanLine, scanStyle]} />
        </View>
      )}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  }
});
