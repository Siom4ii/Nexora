import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BusinessLocalizationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const [region, setRegion] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const handleConfirm = () => {
    router.push('/(auth)/financial-setup');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Map Mock */}
      <View style={[styles.mapContainer, { backgroundColor: theme.business + '10' }]}>
        <Ionicons name="map" size={64} color={theme.business} style={{ opacity: 0.2 }} />
        <View style={styles.pinContainer}>
          <View style={[styles.pin, { backgroundColor: theme.business }]}>
            <Ionicons name="business" size={24} color={theme.white} />
          </View>
          <View style={[styles.pinShadow, { backgroundColor: theme.business + '40' }]} />
        </View>
        <Text style={[styles.mapNote, { color: theme.muted }]}>[ Google Maps View - Manila ]</Text>
      </View>

      <Animated.View entering={FadeInDown.duration(800)} style={[styles.footer, { backgroundColor: theme.card }, Shadows.medium]}>
        <View style={styles.indicator} />
        <Text style={[styles.title, { color: theme.text }]}>Shop Localization</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Drag the pin to the exact entrance of your shop. This sets the 50m clock-in geo-fence for workers.
        </Text>
        
        <View style={[styles.locationCard, { backgroundColor: theme.background }]}>
          <Ionicons name="location" size={20} color={theme.business} />
          <Text style={[styles.locationText, { color: theme.text }]} numberOfLines={1}>
            123 Ayala Ave, Makati, Metro Manila
          </Text>
        </View>

        <ModernButton 
          title="Confirm Shop Location" 
          onPress={handleConfirm}
          variant="business"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pinShadow: {
    width: 20,
    height: 8,
    borderRadius: 10,
    marginTop: -4,
    zIndex: 1,
  },
  mapNote: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingTop: 12,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E9ECEF',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
