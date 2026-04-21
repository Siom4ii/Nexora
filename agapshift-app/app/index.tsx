import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Dimensions, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, SlideInLeft, SlideInRight } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const handleSelectRole = (role: 'WORKER' | 'BUSINESS') => {
    setRole(role);
    router.push('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Brand Accent */}
      <View style={styles.brandOverlay}>
        <Text style={[styles.brandBackground, { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
          AGAP SHIFT
        </Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
          <Image 
            source={require('../assets/images/logo1.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.cardsContainer}>
          {/* Worker Path */}
          <Animated.View entering={SlideInLeft.delay(200).springify()} style={styles.cardWrapper}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => handleSelectRole('WORKER')}
              style={[
                styles.roleCard, 
                { backgroundColor: isDark ? 'rgba(0, 240, 255, 0.05)' : '#fff', borderColor: theme.worker },
                Shadows.medium
              ]}
            >
              <View style={[styles.glowBackground, { backgroundColor: theme.worker, opacity: isDark ? 0.05 : 0.02 }]} />
              <Ionicons name="flash-outline" size={42} color={theme.worker} />
              <View style={styles.cardInfo}>
                <Text style={[styles.roleTitle, { color: theme.text }]}>I WANT TO WORK</Text>
                <Text style={[styles.roleDesc, { color: theme.muted }]}>ACCESS NEARBY SHIFTS & INSTANT PAYOUTS</Text>
              </View>
              <View style={[styles.roleIndicator, { backgroundColor: theme.worker }]}>
                <Text style={styles.indicatorText}>FIELD OPERATIVE</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Business Path */}
          <Animated.View entering={SlideInRight.delay(400).springify()} style={styles.cardWrapper}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => handleSelectRole('BUSINESS')}
              style={[
                styles.roleCard, 
                { backgroundColor: isDark ? 'rgba(57, 255, 20, 0.05)' : '#fff', borderColor: theme.business },
                Shadows.medium
              ]}
            >
              <View style={[styles.glowBackground, { backgroundColor: theme.business, opacity: isDark ? 0.05 : 0.02 }]} />
              <Ionicons name="business-outline" size={42} color={theme.business} />
              <View style={styles.cardInfo}>
                <Text style={[styles.roleTitle, { color: theme.text }]}>I WANT TO HIRE</Text>
                <Text style={[styles.roleDesc, { color: theme.muted }]}>DEPLOY STAFF & MANAGE OPERATIONS</Text>
              </View>
              <View style={[styles.roleIndicator, { backgroundColor: theme.business }]}>
                <Text style={styles.indicatorText}>ENTERPRISE HUB</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.delay(800)} style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.muted }]}>SECURE HANDSHAKE PROTOCOL v1.0</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  brandOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden'
  },
  brandBackground: {
    fontSize: 120,
    fontWeight: '900',
    textAlign: 'center',
    transform: [{ rotate: '-15deg' }],
    width: width * 2,
  },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  header: { marginTop: height * 0.08, alignItems: 'center' },
  logoImage: { width: 250, height: 250 },
  tagline: { fontSize: 9, fontWeight: '800', marginTop: 8, letterSpacing: 1 },
  cardsContainer: { gap: 20 },
  cardWrapper: { width: '100%' },
  roleCard: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
    justifyContent: 'center',
  },
  glowBackground: { ...StyleSheet.absoluteFillObject },
  cardInfo: { marginTop: 24 },
  roleTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  roleDesc: { fontSize: 10, fontWeight: '700', marginTop: 6, letterSpacing: 0.5, lineHeight: 14 },
  roleIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
  },
  indicatorText: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  footer: { marginBottom: 40, alignItems: 'center' },
  footerText: { fontSize: 9, fontWeight: '800', letterSpacing: 2 },
});
