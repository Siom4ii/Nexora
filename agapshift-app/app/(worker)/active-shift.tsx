import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ModernButton } from '../../components/ui/ModernButton';
import Animated, { FadeInDown, ZoomIn, FadeInRight } from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { ResponsiveContainer } from '../../components/ui/ResponsiveContainer';

const TimelineStep = ({ label, active, completed, theme }: any) => (
  <View style={styles.timelineItem}>
    <View style={[
      styles.timelineDot, 
      { backgroundColor: completed ? theme.success : active ? theme.worker : theme.border }
    ]}>
      {completed && <Ionicons name="checkmark" size={12} color={theme.white} />}
    </View>
    <Text style={[
      styles.timelineLabel, 
      { color: active || completed ? theme.text : theme.muted, fontWeight: active ? '700' : '500' }
    ]}>{label}</Text>
  </View>
);

export default function ActiveShiftScreen() {
  const { postedJobs } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  // For demonstration, we'll use a local state to handle the session flow
  // In a real app, this would come from AuthContext/Backend
  const [sessionStatus, setSessionStatus] = useState<'PENDING' | 'ACTIVE' | 'COMPLETED'>('PENDING');
  const [timer, setTimer] = useState(0);
  const [showQR, setShowQR] = useState(false);
  
  // Find a job to use as our "Active" context
  const currentJob = postedJobs[0] || { title: 'Barista Help', businessName: 'Starbucks Coffee', rate: '500' };

  useEffect(() => {
    let interval: any;
    if (sessionStatus === 'ACTIVE') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusInfo = () => {
    switch(sessionStatus) {
      case 'PENDING': return { label: 'PENDING', color: theme.warning, icon: 'time-outline' };
      case 'ACTIVE': return { label: 'ACTIVE', color: theme.info, icon: 'pulse-outline' };
      case 'COMPLETED': return { label: 'COMPLETED', color: theme.success, icon: 'checkmark-circle-outline' };
      default: return { label: 'PENDING', color: theme.warning, icon: 'time-outline' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <ResponsiveContainer maxWidth={600}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.text }]}>{currentJob.title}</Text>
            <View style={styles.headerSub}>
              <Text style={[styles.subtitle, { color: theme.muted }]}>{currentJob.businessName}</Text>
              <View style={styles.dotSeparator} />
              <Text style={[styles.subtitle, { color: theme.muted }]}>0.8km away</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
            <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Main Status Card */}
          <ElevatedCard style={styles.mainStatusCard}>
            <View style={styles.timerHeader}>
              <View style={[styles.liveIndicator, { backgroundColor: sessionStatus === 'ACTIVE' ? theme.danger : theme.border }]}>
                {sessionStatus === 'ACTIVE' && <View style={styles.pulseDot} />}
                <Text style={styles.liveText}>{sessionStatus === 'ACTIVE' ? 'LIVE' : 'WAITING'}</Text>
              </View>
              <Text style={[styles.timerLabel, { color: theme.muted }]}>SESSION DURATION</Text>
            </View>
            
            <Text style={[styles.timerValue, { color: theme.text }]}>{formatTime(timer)}</Text>
            
            <View style={styles.progressSection}>
              <View style={[styles.progressBarBase, { backgroundColor: theme.border }]}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.worker, width: sessionStatus === 'ACTIVE' ? '45%' : sessionStatus === 'COMPLETED' ? '100%' : '0%' }]} />
              </View>
              <View style={styles.timeLabels}>
                <Text style={[styles.timeLabelText, { color: theme.muted }]}>Start: 09:00 AM</Text>
                <Text style={[styles.timeLabelText, { color: theme.muted }]}>End: 05:00 PM</Text>
              </View>
            </View>
          </ElevatedCard>

          {/* QR Action Area */}
          <View style={styles.actionArea}>
            {sessionStatus === 'PENDING' && (
              <ModernButton 
                title="SCAN QR TO CHECK-IN" 
                onPress={() => {
                  setSessionStatus('ACTIVE');
                  setShowQR(true);
                }}
                variant="worker"
                icon="qr-code-outline"
              />
            )}
            {sessionStatus === 'ACTIVE' && (
              <ModernButton 
                title="SCAN QR TO CHECK-OUT" 
                onPress={() => {
                  setSessionStatus('COMPLETED');
                  setShowQR(true);
                }}
                variant="danger"
                icon="log-out-outline"
              />
            )}
            {sessionStatus === 'COMPLETED' && (
              <View style={[styles.completedBanner, { backgroundColor: theme.success + '10', borderColor: theme.success + '30' }]}>
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text style={[styles.completedText, { color: theme.success }]}>Shift Completed & Verified</Text>
              </View>
            )}
          </View>

          {/* Earnings & Stats Row */}
          <View style={styles.statsRow}>
            <ElevatedCard style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>EST. EARNINGS</Text>
              <Text style={[styles.statValue, { color: theme.success }]}>₱{currentJob.rate}.00</Text>
              <Text style={[styles.statSub, { color: theme.muted }]}>Rate: ₱62.5/hr</Text>
            </ElevatedCard>
            <ElevatedCard style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.muted }]}>EMPLOYER</Text>
              <View style={styles.employerRow}>
                <Text style={[styles.statValue, { color: theme.text, fontSize: 14 }]}>Starbucks</Text>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactLink}>
                <Text style={[styles.contactText, { color: theme.worker }]}>Contact Host</Text>
              </TouchableOpacity>
            </ElevatedCard>
          </View>

          {/* Tasks & Instructions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Shift Instructions</Text>
            <ElevatedCard style={styles.instructionCard}>
              <View style={styles.instructionItem}>
                <Ionicons name="shirt-outline" size={18} color={theme.worker} />
                <Text style={[styles.instructionText, { color: theme.text }]}>Dress Code: Black apron & white shirt</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="list-outline" size={18} color={theme.worker} />
                <Text style={[styles.instructionText, { color: theme.text }]}>Tasks: Customer service & point of sale</Text>
              </View>
            </ElevatedCard>
          </View>

          {/* Activity Timeline */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity Timeline</Text>
            <View style={[styles.timelineCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TimelineStep label="Checked-in" completed={sessionStatus !== 'PENDING'} theme={theme} />
              <View style={[styles.timelineLine, { backgroundColor: sessionStatus !== 'PENDING' ? theme.success : theme.border }]} />
              <TimelineStep label="Mid-shift" active={sessionStatus === 'ACTIVE'} completed={sessionStatus === 'COMPLETED'} theme={theme} />
              <View style={[styles.timelineLine, { backgroundColor: sessionStatus === 'COMPLETED' ? theme.success : theme.border }]} />
              <TimelineStep label="Checked-out" active={sessionStatus === 'COMPLETED'} theme={theme} />
            </View>
          </View>

          {/* Support Actions */}
          <View style={styles.supportRow}>
            <TouchableOpacity style={styles.supportBtn}>
              <Ionicons name="warning-outline" size={18} color={theme.danger} />
              <Text style={[styles.supportText, { color: theme.danger }]}>Report Issue</Text>
            </TouchableOpacity>
            <View style={styles.supportDivider} />
            <TouchableOpacity style={styles.supportBtn}>
              <Ionicons name="help-circle-outline" size={18} color={theme.muted} />
              <Text style={[styles.supportText, { color: theme.muted }]}>Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ResponsiveContainer>

      {/* QR Verification Modal */}
      <Modal visible={showQR} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn} style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>QR VERIFICATION</Text>
              <TouchableOpacity onPress={() => setShowQR(false)}>
                <Ionicons name="close" size={24} color={theme.muted} />
              </TouchableOpacity>
            </View>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={180} color={theme.text} />
              <View style={styles.scanLine} />
            </View>
            <Text style={[styles.qrHint, { color: theme.muted }]}>
              Show this code to the employer to verify your session status.
            </Text>
            <ModernButton title="DONE" onPress={() => setShowQR(false)} variant="worker" style={{ marginTop: 20 }} />
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerInfo: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  subtitle: { fontSize: 13, fontWeight: '500' },
  dotSeparator: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  
  mainStatusCard: { padding: 24, borderRadius: 28, alignItems: 'center' },
  timerHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  timerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  timerValue: { fontSize: 48, fontWeight: '800', letterSpacing: -1 },
  progressSection: { width: '100%', marginTop: 24 },
  progressBarBase: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  timeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  timeLabelText: { fontSize: 11, fontWeight: '600' },

  actionArea: { marginVertical: 24 },
  completedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, borderWidth: 1 },
  completedText: { fontWeight: '700', fontSize: 14 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statItem: { flex: 1, padding: 16, borderRadius: 20 },
  statLabel: { fontSize: 9, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statSub: { fontSize: 10, marginTop: 4, fontWeight: '500' },
  employerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF9C3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 10, fontWeight: '700', color: '#854D0E' },
  contactLink: { marginTop: 8 },
  contactText: { fontSize: 12, fontWeight: '700' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  instructionCard: { padding: 16, borderRadius: 20, gap: 12 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  instructionText: { fontSize: 13, fontWeight: '500' },

  timelineCard: { padding: 20, borderRadius: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineItem: { alignItems: 'center', gap: 8 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  timelineLabel: { fontSize: 11 },
  timelineLine: { flex: 1, height: 2, marginTop: -20, marginHorizontal: -10 },

  supportRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 12 },
  supportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  supportText: { fontSize: 13, fontWeight: '600' },
  supportDivider: { width: 1, height: 16, backgroundColor: '#E2E8F0' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', padding: 24, borderRadius: 32 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  qrPlaceholder: { alignSelf: 'center', padding: 24, backgroundColor: '#FFF', borderRadius: 24, position: 'relative', overflow: 'hidden' },
  scanLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: '#22C55E' },
  qrHint: { textAlign: 'center', marginTop: 24, fontSize: 13, lineHeight: 20 },
});
