import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, useColorScheme, Platform } from 'react-native';
import { QRService } from '../../services/qrService';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ModernButton } from '../../components/ui/ModernButton';
import Animated, { FadeInDown, FadeInScale, SlideInUp } from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';

export default function ActiveShiftScreen() {
  const { postedJobs, updateJobStatus } = useAuth();
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>SHIFT EXECUTION</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>// ON SITE PERFORMANCE TRACKING</Text>
      </View>

      <View style={styles.content}>
        {!activeJob ? (
          <Animated.View entering={FadeInDown} style={styles.emptyState}>
            <ElevatedCard style={styles.activationCard}>
              <Ionicons name="flash-outline" size={48} color={theme.worker} />
              <Text style={[styles.activationTitle, { color: theme.text }]}>NO ACTIVE DEPLOYMENT</Text>
              <Text style={[styles.activationDesc, { color: theme.muted }]}>
                Head to the Discovery Feed to apply for nearby sectors.
              </Text>
              <ModernButton 
                title="GENERATE HANDSHAKE QR" 
                onPress={() => handleGenerateQR('CLOCK_IN')}
                variant="worker"
                style={{ marginTop: 24, width: '100%' }}
              />
            </ElevatedCard>
          </Animated.View>
        ) : (
          <View style={styles.activeContainer}>
            <ElevatedCard style={styles.timerCard}>
              <Text style={[styles.label, { color: theme.worker }]}>ELAPSED DURATION</Text>
              <Text style={[styles.timerText, { color: theme.text }]}>{formatTime(timer)}</Text>
              <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                <View style={[styles.progressBar, { backgroundColor: theme.worker, width: '45%' }]} />
              </View>
            </ElevatedCard>

            <ElevatedCard style={styles.jobDetailCard}>
              <View style={styles.detailRow}>
                <View>
                  <Text style={[styles.label, { color: theme.worker }]}>CURRENT UNIT ROLE</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{activeJob.title.toUpperCase()}</Text>
                </View>
                <View style={styles.liveIndicator}>
                  <Text style={styles.liveText}>LIVE DATA</Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View>
                <Text style={[styles.label, { color: theme.worker }]}>SECTOR LOCATION</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{activeJob.businessName?.toUpperCase()}</Text>
              </View>
            </ElevatedCard>

            <ModernButton 
              title="COMPLETE SHIFT HANDSHAKE" 
              onPress={() => handleGenerateQR('CLOCK_OUT')}
              variant="worker"
              style={styles.stopBtn}
            />
          </View>
        )}
      </View>

      <Modal visible={showQR} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInScale} style={[styles.qrContainer, { backgroundColor: isDark ? '#0F172A' : theme.card, borderColor: theme.worker }]}>
            <View style={styles.qrHeader}>
              <Text style={[styles.qrTitle, { color: theme.text }]}>{qrAction.replace('_', ' ')} PROTOCOL</Text>
              <TouchableOpacity onPress={() => setShowQR(false)}>
                <Ionicons name="close-circle" size={28} color={theme.worker} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.qrFrame, { borderColor: theme.worker }]}>
              <Ionicons name="qr-code" size={200} color={theme.text} />
              {/* Decorative Tech Corners */}
              <View style={[styles.corner, styles.tl, { borderColor: theme.worker }]} />
              <View style={[styles.corner, styles.tr, { borderColor: theme.worker }]} />
              <View style={[styles.corner, styles.bl, { borderColor: theme.worker }]} />
              <View style={[styles.corner, styles.br, { borderColor: theme.worker }]} />
            </View>

            <Text style={[styles.qrDesc, { color: theme.muted }]}>
              PRESENT THIS CODE TO THE ENTITY REPRESENTATIVE FOR SCANNING.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  subtitle: { fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
  content: { flex: 1, padding: 20 },
  emptyState: { flex: 1, justifyContent: 'center' },
  activationCard: { padding: 32, alignItems: 'center' },
  activationTitle: { fontSize: 18, fontWeight: '900', marginTop: 24, letterSpacing: 1 },
  activationDesc: { fontSize: 12, textAlign: 'center', marginTop: 12, lineHeight: 18 },
  activeContainer: { gap: 16 },
  timerCard: { padding: 24, alignItems: 'center' },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  timerText: { fontSize: 48, fontWeight: '900', letterSpacing: -1, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  progressTrack: { width: '100%', height: 4, borderRadius: 2, marginTop: 24, overflow: 'hidden' },
  progressBar: { height: '100%' },
  jobDetailCard: { padding: 24 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailValue: { fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  liveIndicator: { backgroundColor: '#FF3B30', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  liveText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  divider: { height: 1, marginVertical: 20, opacity: 0.5 },
  stopBtn: { marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  qrContainer: { width: '100%', padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  qrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 32 },
  qrTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  qrFrame: { padding: 20, borderWidth: 1, borderRadius: 12, position: 'relative' },
  corner: { position: 'absolute', width: 20, height: 20, borderWidth: 3 },
  tl: { top: -5, left: -5, borderBottomWidth: 0, borderRightWidth: 0 },
  tr: { top: -5, right: -5, borderBottomWidth: 0, borderLeftWidth: 0 },
  bl: { bottom: -5, left: -5, borderTopWidth: 0, borderRightWidth: 0 },
  br: { bottom: -5, right: -5, borderTopWidth: 0, borderLeftWidth: 0 },
  qrDesc: { fontSize: 10, fontWeight: '800', textAlign: 'center', marginTop: 32, letterSpacing: 1, lineHeight: 16 },
});
