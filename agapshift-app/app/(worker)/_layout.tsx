import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat, 
  withSequence, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';

export default function WorkerTabsLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { workerData, updateWorkerData } = useAuth();
  const isDark = colorScheme === 'dark';

  const switchX = useSharedValue(workerData.isOnline ? 1 : 0);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    switchX.value = withSpring(workerData.isOnline ? 1 : 0, { damping: 15, stiffness: 100 });
    if (workerData.isOnline) {
      glowOpacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 1000 }), withTiming(0.4, { duration: 1000 })),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0);
    }
  }, [workerData.isOnline]);

  const toggleOnline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    updateWorkerData({ isOnline: !workerData.isOnline });
  };

  const animatedSelectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: switchX.value * 68 }], 
    backgroundColor: interpolateColor(
      switchX.value,
      [0, 1],
      [theme.muted, theme.worker]
    ),
  }));

  const offlineTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      switchX.value,
      [0, 1],
      [isDark ? '#000' : '#fff', theme.muted]
    ),
    opacity: withSpring(workerData.isOnline ? 0.5 : 1),
  }));

  const onlineTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      switchX.value,
      [0, 1],
      [theme.muted, isDark ? '#000' : '#fff']
    ),
    opacity: withSpring(workerData.isOnline ? 1 : 0.5),
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    shadowOpacity: glowOpacity.value * 0.8,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      switchX.value,
      [0, 1],
      [theme.border, theme.worker]
    ),
  }));

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.brand, { color: theme.text }]}>AGAP SHIFT</Text>
            <Text style={[styles.hudLabel, { color: theme.muted }]}>F UNIT STATUS: {workerData.isOnline ? 'ACTIVE' : 'IDLE'}</Text>
          </View>

          <TouchableOpacity 
            onPress={toggleOnline} 
            activeOpacity={1}
            style={styles.switchTouchArea}
          >
            <Animated.View style={[styles.switchContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : theme.border + '30' }, containerStyle]}>
              <Animated.View style={[
                styles.glowLayer, 
                { shadowColor: theme.worker },
                animatedGlowStyle
              ]} />
              
              {/* Background Selector (Sliding highlight) */}
              <Animated.View style={[
                styles.selector, 
                workerData.isOnline && Shadows.glow.worker,
                animatedSelectorStyle
              ]} />

              {/* Labels on Top Layer */}
              <View style={styles.switchLabels}>
                <View style={styles.labelWrapper}>
                  <Animated.Text style={[styles.switchText, offlineTextStyle]}>OFFLINE</Animated.Text>
                </View>
                <View style={styles.labelWrapper}>
                  <Animated.Text style={[styles.switchText, onlineTextStyle]}>ONLINE</Animated.Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.worker,
          tabBarInactiveTintColor: theme.muted,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            ...Platform.select({
              ios: Shadows.medium,
              android: Shadows.medium,
              web: Shadows.medium,
            }),
          },
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}>
        <Tabs.Screen
          name="gig-map"
          options={{
            title: 'Nearby',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "navigate" : "navigate-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="active-shift"
          options={{
            title: 'Shift',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "time" : "time-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "wallet" : "wallet-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingBottom: 16, paddingHorizontal: 24 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  hudLabel: { fontSize: 8, fontWeight: '900', marginTop: 2, letterSpacing: 1 },
  switchTouchArea: { padding: 4 },
  switchContainer: {
    width: 136,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 4,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  selector: {
    width: 60,
    height: 30,
    borderRadius: 8,
    position: 'absolute',
    left: 4,
    zIndex: 1,
  },
  switchLabels: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 2,
  },
  labelWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 68,
    borderRadius: 24,
    paddingBottom: 4,
    borderTopWidth: 0,
    elevation: 10,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 10,
  },
  tabBarIcon: {
    marginTop: 6,
  },
});
