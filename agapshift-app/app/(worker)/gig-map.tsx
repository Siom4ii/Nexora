import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, RefreshControl, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Shadows } from '../../constants/theme';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat, 
  withSequence, 
  withTiming,
  interpolateColor,
  Layout,
  SlideInUp
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import * as Haptics from 'expo-haptics';

function MainHeader() {
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
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
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
    <View style={[styles.mainHeader, { 
      backgroundColor: theme.background, 
      borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' 
    }]}>
      <View style={styles.headerContent}>
        <View>
          <Image 
            source={require('../../assets/images/logo2.png')} 
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={[styles.hudLabel, { color: theme.muted }]}>
            {workerData.isOnline 
              ? 'VISIBLE TO EMPLOYERS • ACTIVE' 
              : 'HIDDEN FROM STREAM • IDLE'}
          </Text>
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
            
            <Animated.View style={[
              styles.selector, 
              workerData.isOnline && (Platform.OS === 'web' ? { boxShadow: `0 0 15px ${theme.worker}` } : Shadows.glow.worker),
              animatedSelectorStyle
            ]} />

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
  );
}

export default function GigMapScreen() {
  const { postedJobs } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Nearest');
  const [showNewJobsBanner, setShowNewJobsBanner] = useState(false);
  const radarPulse = useSharedValue(1);

  useEffect(() => {
    radarPulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );

    // Simulate new job alert
    const timer = setTimeout(() => setShowNewJobsBanner(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const animatedRadarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: radarPulse.value }],
    opacity: 1.5 - radarPulse.value,
  }));

  const handleApply = (jobTitle: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('APPLICATION TRANSMITTED', `Your profile has been sent to ${jobTitle}. Status: PENDING REVIEW`);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setShowNewJobsBanner(false);
    }, 2000);
  }, []);

  const pendingJobs = postedJobs.filter(j => j.status === 'PENDING');

  const renderEmptyState = () => (
    <Animated.View entering={FadeInDown} style={styles.emptyState}>
      <View style={[styles.emptyIconBox, { backgroundColor: theme.worker + '10' }]}>
        <Ionicons name="map-outline" size={64} color={theme.worker} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>NO SHIFTS NEARBY</Text>
      <Text style={[styles.emptyDesc, { color: theme.muted }]}>
        Try expanding your discovery range or check back in a few minutes.
      </Text>
      <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: theme.worker }]} onPress={onRefresh}>
        <Text style={styles.refreshBtnText}>EXPAND RANGE</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MainHeader />
      
      {/* High-Tech Discovery Header */}
      <View style={[styles.mapHeader, { backgroundColor: isDark ? 'transparent' : theme.worker + '10' }]}>
        <View style={styles.radarLayer}>
          <Animated.View style={[styles.radarCircle, { borderColor: theme.worker + '40' }, animatedRadarStyle]} />
          <View style={[styles.radarCircleSmall, { borderColor: theme.worker + '20' }]} />
        </View>
        <Ionicons name="navigate-circle" size={56} color={theme.worker} />
        <Text style={[styles.commandTitle, { color: theme.text }]}>DISCOVERY STREAM</Text>
        <View style={[styles.statusStrip, { backgroundColor: theme.worker + '15' }]}>
          <View style={[styles.activeDot, { backgroundColor: theme.success }]} />
          <Text style={[styles.statusText, { color: theme.worker }]}>
            {pendingJobs.length} JOBS FOUND NEAR YOU
          </Text>
        </View>
        <TouchableOpacity style={styles.accuracyTag}>
          <Ionicons name="locate" size={12} color={theme.muted} />
          <Text style={[styles.accuracyText, { color: theme.muted }]}>ACCURACY: HIGH (5M)</Text>
        </TouchableOpacity>
      </View>

      {showNewJobsBanner && (
        <Animated.View entering={SlideInUp} style={[styles.newJobsBanner, { backgroundColor: theme.worker }]}>
          <Ionicons name="sparkles" size={16} color="#fff" />
          <Text style={styles.newJobsText}>New jobs available in your sector!</Text>
          <TouchableOpacity onPress={() => onRefresh()}>
            <Text style={styles.newJobsAction}>REFRESH</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            data={['Nearest', 'Highest Pay', 'Retail', 'Logistics']}
            keyExtractor={(item) => item}
            renderItem={({ item: filter }) => (
              <TouchableOpacity 
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip, 
                  { 
                    backgroundColor: activeFilter === filter ? theme.worker : 'transparent',
                    borderColor: activeFilter === filter ? theme.worker : theme.border 
                  }
                ]}
              >
                <Text style={[
                  styles.filterChipText, 
                  { color: activeFilter === filter ? '#fff' : theme.muted }
                ]}>{filter}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={[styles.filterBtn, { borderColor: theme.border }]}>
            <Ionicons name="options-outline" size={18} color={theme.text} />
          </View>
        </View>

        <FlatList
          data={pendingJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.worker} />
          }
          renderItem={({ item, index }) => (
            <ElevatedCard style={styles.jobCard} delay={index * 100} layout={Layout.springify()}>
              <View style={styles.jobTopRow}>
                <View style={[styles.distBadge, { backgroundColor: theme.worker + '15' }]}>
                  <Ionicons name="location" size={10} color={theme.worker} />
                  <Text style={[styles.distText, { color: theme.worker }]}>1.2 KM AWAY</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: theme.text }]}>4.8</Text>
                </View>
              </View>

              <View style={styles.jobInfo}>
                <View style={[styles.jobIconBox, { backgroundColor: theme.worker + '10', borderColor: theme.worker + '30' }]}>
                  <Ionicons name="briefcase" size={24} color={theme.worker} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.jobMeta, { color: theme.muted }]}>{item.businessName}</Text>
                  <View style={styles.tagRow}>
                    <View style={[styles.tag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F0F0' }]}>
                      <Ionicons name="time-outline" size={12} color={theme.muted} />
                      <Text style={[styles.tagText, { color: theme.muted }]}>4 HRS</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F0F0' }]}>
                      <Ionicons name="flash-outline" size={12} color={theme.muted} />
                      <Text style={[styles.tagText, { color: theme.muted }]}>URGENT</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rateContainer}>
                  <Text style={[styles.rateText, { color: theme.success }]}>₱{item.rate}</Text>
                  <Text style={[styles.rateSub, { color: theme.muted }]}>TOTAL PAY</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.applyBtn, { backgroundColor: theme.worker }]}
                onPress={() => handleApply(item.title)}
              >
                <Text style={styles.applyBtnText}>ACCEPT SHIFT</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </ElevatedCard>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainHeader: { 
    paddingTop: 45, 
    paddingBottom: 16, 
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 140, height: 40 },
  hudLabel: { fontSize: 8, fontWeight: '900', marginTop: 2, letterSpacing: 0.5 },
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

  mapHeader: { height: 260, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  radarLayer: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  radarCircle: { width: 220, height: 220, borderRadius: 110, borderWidth: 2 },
  radarCircleSmall: { width: 140, height: 140, borderRadius: 70, borderWidth: 1 },
  commandTitle: { fontSize: 24, fontWeight: '900', marginTop: 16, letterSpacing: 4 },
  statusStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  accuracyTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  accuracyText: { fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  
  newJobsBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    gap: 10,
    position: 'absolute',
    top: 310,
    left: 20,
    right: 20,
    borderRadius: 12,
    zIndex: 10,
    ...Shadows.medium
  },
  newJobsText: { color: '#fff', fontSize: 12, fontWeight: '700', flex: 1 },
  newJobsAction: { color: '#fff', fontSize: 12, fontWeight: '900', textDecorationLine: 'underline' },

  content: { flex: 1, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 16 },
  filterScroll: { gap: 8, paddingRight: 10 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  filterBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  
  listPadding: { paddingBottom: 120, paddingTop: 10 },
  jobCard: { marginBottom: 16, padding: 16, borderRadius: 20 },
  jobTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  distBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  distText: { fontSize: 9, fontWeight: '900' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '800' },
  
  jobInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  jobIconBox: { width: 54, height: 54, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  jobTitle: { fontSize: 18, fontWeight: '900' },
  jobMeta: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 9, fontWeight: '700' },
  
  rateContainer: { alignItems: 'flex-end' },
  rateText: { fontSize: 20, fontWeight: '900' },
  rateSub: { fontSize: 8, fontWeight: '800', marginTop: 2 },
  
  applyBtn: { 
    marginTop: 16, 
    padding: 16, 
    borderRadius: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8
  },
  applyBtnText: { fontSize: 13, fontWeight: '900', color: '#fff', letterSpacing: 1 },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconBox: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  refreshBtn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 },
  refreshBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' }
});
