import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { LocationService } from '../../services/locationService';
import { Colors, Shadows } from '../../constants/theme';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function GigMapScreen() {
  const { postedJobs, workerData, updateWorkerData } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const handleApply = (jobTitle: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('APPLICATION TRANSMITTED', `Your profile has been sent to ${jobTitle}. Status: PENDING REVIEW`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* High-Tech Discovery Header */}
      <View style={[styles.mapHeader, { backgroundColor: isDark ? 'transparent' : theme.worker + '10' }]}>
        <View style={styles.radarLayer}>
          <View style={[styles.radarCircle, { borderColor: theme.worker + '20' }]} />
          <View style={[styles.radarCircleSmall, { borderColor: theme.worker + '40' }]} />
        </View>
        <Ionicons name="navigate-circle-outline" size={48} color={theme.worker} />
        <Text style={[styles.commandTitle, { color: theme.text }]}>DISCOVERY STREAM</Text>
        <View style={[styles.statusStrip, { backgroundColor: theme.worker + '15' }]}>
          <View style={[styles.activeDot, { backgroundColor: theme.worker }]} />
          <Text style={[styles.statusText, { color: theme.worker }]}>GPS ACTIVE: SCANNING NEARBY SECTORS</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>// AVAILABLE SHIFTS</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color={theme.worker} />
          </View>
        </View>

        <FlatList
          data={postedJobs.filter(j => j.status === 'PENDING')}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item, index }) => (
            <ElevatedCard style={styles.jobCard} delay={index * 100}>
              <View style={styles.jobInfo}>
                <View style={[styles.jobIconBox, { borderColor: theme.worker }]}>
                  <Ionicons name="briefcase" size={24} color={theme.worker} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title.toUpperCase()}</Text>
                  <Text style={[styles.jobMeta, { color: theme.muted }]}>ORG: {item.businessName?.toUpperCase()} • DIST: 1.2KM</Text>
                </View>
                <View style={styles.rateContainer}>
                  <Text style={[styles.rateText, { color: theme.business }]}>₱{item.rate}</Text>
                  <Text style={[styles.rateSub, { color: theme.muted }]}>/SHIFT</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.applyBtn, { borderColor: theme.worker }]}
                onPress={() => handleApply(item.title)}
              >
                <Text style={[styles.applyBtnText, { color: theme.worker }]}>INITIALIZE APPLICATION</Text>
                <Ionicons name="chevron-forward" size={14} color={theme.worker} />
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
  mapHeader: { height: 220, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  radarLayer: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  radarCircle: { width: 220, height: 220, borderRadius: 110, borderWidth: 1 },
  radarCircleSmall: { width: 140, height: 140, borderRadius: 70, borderWidth: 1 },
  commandTitle: { fontSize: 22, fontWeight: '900', marginTop: 16, letterSpacing: 4 },
  statusStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginTop: 12 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  filterBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  listPadding: { paddingBottom: 120 },
  jobCard: { marginBottom: 16, padding: 20 },
  jobInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  jobIconBox: { width: 50, height: 50, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  jobTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  jobMeta: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  rateContainer: { alignItems: 'flex-end' },
  rateText: { fontSize: 18, fontWeight: '900' },
  rateSub: { fontSize: 9, fontWeight: '700' },
  applyBtn: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  applyBtnText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
});
