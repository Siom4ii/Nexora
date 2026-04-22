import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, useColorScheme, ViewStyle, TextStyle, Platform } from 'react-native';
import { Colors, Shadows } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'worker' | 'business' | 'default';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function ModernButton({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'default', 
  style, 
  textStyle,
  disabled = false
}: ModernButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const scale = useSharedValue(1);

  const isDark = colorScheme === 'dark';
  const accentColor = variant === 'worker' ? theme.worker : variant === 'business' ? theme.business : theme.tint;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: withSpring(scale.value === 1 ? 0.3 : 0.6),
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    onPress();
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: isDark ? 'transparent' : accentColor,
          borderColor: accentColor,
          borderWidth: isDark ? 1.5 : 0,
        },
        isDark && (variant === 'worker' ? Shadows.glow.worker : Shadows.glow.business),
        disabled && styles.disabled,
        animatedStyle,
        style
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={loading || disabled}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={isDark ? accentColor : theme.white} />
      ) : (
        <Text style={[
          styles.text, 
          { color: isDark ? accentColor : theme.white },
          textStyle
        ]}>{title.toUpperCase()}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  disabled: {
    opacity: 0.3,
  },
});
