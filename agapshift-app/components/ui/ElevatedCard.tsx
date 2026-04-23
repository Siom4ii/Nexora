import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Shadows } from '../../constants/theme';
import Animated, { FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';

interface ElevatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  noShadow?: boolean;
}

export function ElevatedCard({ children, style, delay = 0, noShadow = false }: ElevatedCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { role } = useAuth();

  const accentColor = role === 'WORKER' ? theme.worker : theme.business;

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
          backgroundColor: isDark ? theme.card : theme.card, 
          borderColor: theme.border,
          borderWidth: 1,
        }, 
        !noShadow && Shadows.medium, 
        style
      ]}
    >
      {isDark && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.scanLine, { backgroundColor: accentColor, shadowColor: accentColor }, scanStyle]} />
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  }
});
