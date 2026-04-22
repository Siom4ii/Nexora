import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, useColorScheme, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ModernButton } from '../../components/ui/ModernButton';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { ResponsiveContainer } from '../../components/ui/ResponsiveContainer';

export default function ActiveShiftScreen() {
  const { postedJobs } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [timer, setTimer] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [qrAction, setQrAction] = useState<'CLOCK_IN' | 'CLOCK_OUT'>('CLOCK_IN');

  const activeJob = postedJobs.find(j => j.status === 'ACTIVE');

  useEffect(() => {
    let interval: any;
    if (activeJob) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeJob]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateQR = (action: 'CLOCK_IN' | 'CLOCK_OUT') => {
    setQrAction(action);
    setShowQR(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ flexGrow: 1 }}>
      <ResponsiveContainer maxWidth={600}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Shift Session</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>Real-time monitoring & execution</Text>
          </View>
          {activeJob && (
            <View style={[styles.liveIndicator, { backgroundColor: theme.danger }]}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {!activeJob ? (
            <Animated.View entering={FadeInDown} style={styles.emptyState}>
              <ElevatedCard style={styles.emptyCard}>
                <View style={[styles.iconCircle, { backgroundColor: theme.worker + '15' }]}>
                  <Ionicons name="briefcase-outline" size={32} color={theme.worker} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Ready for Deployment</Text>
                <Text style={[styles.emptyDesc, { color: theme.muted }]}>
                  You don't have an active shift right now. Browse available gigs nearby to get started.
                </Text>
                <ModernButton 
                  title="FIND NEARBY GIGS" 
                  onPress={() => {}} 
                  variant="worker"
                  style={styles.actionBtn}
                />
              </ElevatedCard>
            </Animated.View>
          ) : (
            <View style={styles.activeWrapper}>
              {/* Timer Section */}
              <ElevatedCard style={styles.mainCard}>
                <Text style={[styles.sectionLabel, { color: theme.muted }]}>ELAPSED TIME</Text>
                <Text style={[styles.timerDisplay, { color: theme.text }]}>{formatTime(timer)}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarBase, { backgroundColor: theme.border }]}>
                    <Animated.View style={[styles.progressBarFill, { backgroundColor: theme.worker, width: '65%' }]} />
                  </View>
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressText, { color: theme.muted }]}>Start: 08:00 AM</Text>
                    <Text style={[styles.progressText, { color: theme.muted }]}>Goal: 8h</Text>
                  </View>
                </View>
              </ElevatedCard>

              {/* Job Details Section */}
              <View style={styles.detailsRow}>
                <ElevatedCard style={styles.detailCard}>
                  <Ionicons name="person-circle-outline" size={20} color={theme.worker} />
                  <View>
                    <Text style={[styles.detailLabel, { color: theme.muted }]}>ASSIGNED ROLE</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]} numberOfLines={1}>
                      {activeJob.title}
                    </Text>
                  </View>
                </ElevatedCard>
                
                <ElevatedCard style={styles.detailCard}>
                  <Ionicons name="business-outline" size={20} color={theme.worker} />
                  <View>
                    <Text style={[styles.detailLabel, { color: theme.muted }]}>LOCATION</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]} numberOfLines={1}>
                      {activeJob.businessName || 'Davao Sector'}
                    </Text>
                  </View>
                </ElevatedCard>
              </View>

              {/* Action Section */}
              <ElevatedCard style={styles.actionCard}>
                <View style={styles.actionHeader}>
                  <Ionicons name="shield-checkmark-outline" size={24} color={theme.success} />
                  <Text style={[styles.actionTitle, { color: theme.text }]}>Standard Protocol</Text>
                </View>
                <Text style={[styles.actionDesc, { color: theme.muted }]}>
                  Ensure you scan the business owner's QR code at the end of your shift to finalize payment release.
                </Text>
                <ModernButton 
                  title="CLOCK OUT PROTOCOL" 
                  onPress={() => handleGenerateQR('CLOCK_OUT')}
                  variant="worker"
                  style={styles.stopBtn}
                />
              </ElevatedCard>
            </View>
          )}
        </View>
      </ResponsiveContainer>

      {/* Modal remains largely same but with cleaner layout */}
      <Modal visible={showQR} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Animated.View entering={ZoomIn} style={[styles.qrContainer, { backgroundColor: theme.card }]}>
              <View style={styles.qrHeader}>
                <Text style={[styles.qrTitle, { color: theme.text }]}>{qrAction.replace('_', ' ')}</Text>
                <TouchableOpacity onPress={() => setShowQR(false)}>
                  <Ionicons name="close-circle" size={28} color={theme.muted} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.qrFrame, { borderColor: theme.border }]}>
                <Ionicons name="qr-code" size={200} color={theme.text} />
              </View>

              <Text style={[styles.qrInstructions, { color: theme.muted }]}>
                Show this QR code to the business supervisor to verify your {qrAction === 'CLOCK_IN' ? 'arrival' : 'departure'}.
              </Text>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  liveIndicator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20,
    gap: 6
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  liveText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // Empty State
  emptyState: { marginTop: 40 },
  emptyCard: { padding: 32, alignItems: 'center', borderRadius: 24 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, opacity: 0.8 },
  actionBtn: { marginTop: 32, width: '100%' },

  // Active State
  activeWrapper: { gap: 16 },
  mainCard: { padding: 24, alignItems: 'center', borderRadius: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  timerDisplay: { fontSize: 56, fontWeight: '900', letterSpacing: -2, fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif' },
  
  progressContainer: { width: '100%', marginTop: 24 },
  progressBarBase: { width: '100%', height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { fontSize: 11, fontWeight: '600' },

  detailsRow: { flexDirection: 'row', gap: 12 },
  detailCard: { flex: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20 },
  detailLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '800', marginTop: 2 },

  actionCard: { padding: 24, borderRadius: 24 },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  actionTitle: { fontSize: 16, fontWeight: '800' },
  actionDesc: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  stopBtn: { width: '100%' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400 },
  qrContainer: { padding: 24, borderRadius: 32, alignItems: 'center' },
  qrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 24 },
  qrTitle: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  qrFrame: { padding: 24, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1 },
  qrInstructions: { fontSize: 13, textAlign: 'center', marginTop: 24, lineHeight: 20 },
});
