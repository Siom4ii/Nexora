import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Location from 'expo-location';
import Map from '../../components/map/Map';

export default function BusinessLocalizationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const mapRef = useRef<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('Detecting location...');
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [region, setRegion] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    autoDetectLocation();
  }, []);

  const autoDetectLocation = async () => {
    setIsLocating(true);
    setAddress('Initializing GPS Signal...');
    
    try {
      // 1. Check Permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Location permission denied. Please use search.');
        setIsLocating(false);
        return;
      }

      // 2. Try to get position with a strict timeout for web
      const currentLocation = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 6000))
      ]) as Location.LocationObject;

      const newRegion = {
        ...region,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      
      setRegion(newRegion);
      reverseGeocode(currentLocation.coords.latitude, currentLocation.coords.longitude);
      mapRef.current?.animateToRegion(newRegion, 1000);
      
    } catch (error: any) {
      console.error('Location detection error:', error);
      if (error.message === 'Timeout') {
        setAddress('GPS signal slow. Use search or move the pin.');
      } else {
        setAddress('Unable to detect location. Please search manually.');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Primary: Expo Location
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (response.length > 0) {
        const item = response[0];
        // Build more accurate address string
        const parts = [
          item.name,
          item.streetNumber,
          item.street,
          item.district,
          item.city,
          item.region
        ].filter(Boolean);
        
        setAddress(parts.join(', '));
      } else if (Platform.OS === 'web') {
        // Fallback: OSM Nominatim (Public API) for Web
        const webResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
        const data = await webResponse.json();
        setAddress(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      } else {
        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    
    // Auto-append context for better accuracy in Philippines
    const enrichedQuery = searchQuery.toLowerCase().includes('philippines') 
      ? searchQuery 
      : `${searchQuery}, Philippines`;

    try {
      // Try Expo Geocode first
      let results = await Location.geocodeAsync(enrichedQuery);
      
      // Fallback for Web: Nominatim
      if (results.length === 0 && Platform.OS === 'web') {
        const webResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enrichedQuery)}&limit=1`);
        const data = await webResponse.json();
        if (data.length > 0) {
          results = [{
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          } as any];
        }
      }

      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newRegion = {
          ...region,
          latitude,
          longitude,
        };
        setRegion(newRegion);
        reverseGeocode(latitude, longitude);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } else {
        Alert.alert('Location Not Found', 'Try adding the city name (e.g. SM Davao City)');
      }
    } catch (e) {
      console.error('Search error:', e);
      Alert.alert('Search Error', 'Location services are busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
    // On native, we update the address in real-time as the pin "lands" on a spot
    if (Platform.OS !== 'web') {
      reverseGeocode(newRegion.latitude, newRegion.longitude);
    }
  };

  const handleConfirm = () => {
    router.push('/(auth)/financial-setup');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Actual Map (Platform Optimized) */}
      <View style={styles.mapContainer}>
        <Map
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          onRegionChangeComplete={onRegionChangeComplete}
        />
        
        {/* Search Bar Overlay */}
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.searchContainer, { backgroundColor: theme.card }, Shadows.medium]}>
          <Ionicons name="search" size={20} color={theme.muted} />
          <TextInput
            placeholder="Search (e.g. SM Mall of Asia)"
            placeholderTextColor={theme.muted}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {loading ? (
            <ActivityIndicator size="small" color={theme.business} />
          ) : (
            searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.muted} />
              </TouchableOpacity>
            )
          )}
        </Animated.View>

        {/* Restore Visual Center Pin for High Precision */}
        <View style={styles.staticPinContainer} pointerEvents="none">
          <View style={[styles.pin, { backgroundColor: theme.business }]}>
            <Ionicons name="business" size={24} color={theme.white} />
          </View>
          <View style={[styles.pinShadow, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
        </View>

        <TouchableOpacity 
          style={[styles.myLocationBtn, { backgroundColor: theme.card }, Shadows.light]}
          onPress={autoDetectLocation}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={theme.business} />
          ) : (
            <Ionicons name="locate" size={24} color={theme.business} />
          )}
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.duration(800)} style={[styles.footer, { backgroundColor: theme.card }, Shadows.medium]}>
        <View style={styles.indicator} />
        <Text style={[styles.title, { color: theme.text }]}>Shop Localization</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Move the map to point the pin to your shop entrance.
        </Text>
        
        <View style={[styles.locationCard, { backgroundColor: theme.background }]}>
          <Ionicons name="location" size={20} color={theme.business} />
          <View style={{ flex: 1 }}>
            {isLocating ? (
               <Text style={[styles.detectingText, { color: theme.business }]}>Updating GPS...</Text>
            ) : (
              <Text style={[styles.locationText, { color: theme.text }]} numberOfLines={2}>
                {address}
              </Text>
            )}
          </View>
        </View>

        <ModernButton 
          title="Confirm Shop Location" 
          onPress={handleConfirm}
          variant="business"
          disabled={isLocating}
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
    position: 'relative',
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    height: 54,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 30,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  staticPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -28,
    marginTop: -56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 3,
    borderColor: '#fff',
  },
  pinShadow: {
    width: 12,
    height: 6,
    borderRadius: 6,
    marginTop: -2,
    zIndex: 1,
  },
  myLocationBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
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
    minHeight: 64,
  },
  detectingText: {
    fontSize: 14,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
});
