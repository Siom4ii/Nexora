import React from 'react';
import { View, StyleSheet, useWindowDimensions, ViewStyle, Platform } from 'react-native';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
}

export function ResponsiveContainer({ children, style, maxWidth = 600 }: ResponsiveContainerProps) {
  const { width } = useWindowDimensions();
  
  // On web and large screens, we center the content and limit its width
  const isLargeScreen = width > maxWidth;

  return (
    <View style={[styles.outerContainer, isLargeScreen && styles.largeScreenContainer]}>
      <View style={[
        styles.innerContainer, 
        { maxWidth: isLargeScreen ? maxWidth : '100%' },
        style
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
  },
  largeScreenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
});
