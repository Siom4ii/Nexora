import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Pressable, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QRService } from '../../services/qrService';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FlowStep = ({ icon, label, active, theme }: any) => (
  <View style={styles.flowStep}>
    <View style={[styles.stepIcon, { backgroundColor: active ? theme.business : theme.border, borderColor: active ? theme.business : theme.border }]}>
      <Ionicons name={icon} size={14} color={active ? theme.white : theme.muted} />
    </View>
    <Text style={[styles.stepLabel, { color: active ? theme.text : theme.muted }]}>{label}</Text>
  </View>
);

export default function QRScannerScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { postedJobs, updateJobStatus } = useAuth();
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState<any[]>([
    { id: 'h1', worker: 'John Doe', type: 'CLOCK-IN', time: '10:15 AM', shift: 'Barista Help' },
    { id: 'h2', worker: 'Jane Smith', type: 'CLOCK-OUT', time: '09:45 AM', shift: 'Cashier' },
  ]);

  const scanPulse = useSharedValue(1);

  useEffect(() => {
    scanPulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedScanButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanPulse.value }],
  }));

  const activeJobs = postedJobs.filter(j => j.status === 'PENDING' || j.status === 'ACTIVE');

  const handleMockScan = async (action: 'IN' | 'OUT') => {
    if (!selectedJobId) {
      Alert.alert('Selection Required', 'Please select a shift to scan for first.');
      return;
    }

    setScanning(true);
    setTimeout(async () => {
      const mockQrData = await QRService.generateOfflineSignedQR('worker_123', selectedJobId, action === 'IN' ? 'CLOCK_IN' : 'CLOCK_OUT');
      const isValid = await QRService.verifyScannedQR(mockQrData, selectedJobId);
      
      if (isValid) {
        const job = postedJobs.find(j => j.id === selectedJobId);
        if (action === 'IN') {
          updateJobStatus(selectedJobId, 'ACTIVE', 'clockInTime');
          Alert.alert('Clock-In Success', 'Worker attendance verified.');
        } else {
          updateJobStatus(selectedJobId, 'COMPLETED', 'clockOutTime');
          Alert.alert('Clock-Out Success', 'Shift completed successfully.');
        }
        
        setHistory(prev => [{
          id: Date.now().toString(),
          worker: job?.workerName || 'Worker',
          type: action === 'IN' ? 'CLOCK-IN' : 'CLOCK-OUT',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          shift: job?.title
        }, ...prev]);

        setScanning(false);
        setSelectedJobId(null);
      } else {
        Alert.alert('Verification Failed', 'Invalid or expired QR code.');
        setScanning(false);
      }
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return theme.warning;
      case 'ACTIVE': return theme.info;
      case 'COMPLETED': return theme.success;
      default: return theme.muted;
    }
  };

  const renderJobCard = ({ item }: { item: any }) => (
    <AnimatedPressable
      style={[
        styles.jobCard, 
        { backgroundColor: theme.card, borderColor: selectedJobId === item.id ? theme.business : theme.border },
        selectedJobId === item.id ? Shadows.medium : Shadows.light
      ]}
      onPress={() => setSelectedJobId(item.id)}
    >
      <View style={styles.jobCardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={theme.muted} />
      </View>

      <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={theme.muted} />
          <Text style={[styles.detailText, { color: theme.muted }]}>Davao City Central</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={14} color={theme.muted} />
          <Text style={[styles.detailText, { color: theme.muted }]}>{item.workerName || 'Awaiting Worker'}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.cardActionBtn, { backgroundColor: theme.business + '10' }]}
        onPress={() => setSelectedJobId(item.id)}
      >
        <Text style={[styles.cardActionText, { color: theme.business }]}>
          {selectedJobId === item.id ? 'Ready to Scan' : 'Select for Scan'}
        </Text>
        <Ionicons name={selectedJobId === item.id ? "checkmark-circle" : "qr-code-outline"} size={16} color={theme.business} />
      </TouchableOpacity>
    </AnimatedPressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient colors={isDark ? ['#0F172A', '#020617'] : ['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>Attendance Scanner</Text>
              <Text style={[styles.subtitle, { color: theme.muted }]}>Verify arrival & departure</Text>
            </View>
            <View style={[styles.headerIconBox, { backgroundColor: theme.business + '15' }]}>
              <Ionicons name="qr-code" size={28} color={theme.business} />
            </View>
          </View>

          <Animated.View style={[styles.primaryScanBox, animatedScanButtonStyle]}>
            <TouchableOpacity 
              style={[styles.primaryScanBtn, { backgroundColor: theme.business }, Shadows.medium]}
              onPress={() => {
                if (!selectedJobId && activeJobs.length > 0) {
                  Alert.alert('Selection Required', 'Please select a shift from the list below first.');
                } else if (selectedJobId) {
                  // Trigger scan UI
                }
              }}
            >
              <Ionicons name="scan-outline" size={24} color={theme.white} />
              <Text style={styles.primaryScanText}>Scan QR Code</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.flowIndicator}>
            <FlowStep icon="list" label="Select Shift" active={!selectedJobId} theme={theme} />
            <View style={[styles.flowLine, { backgroundColor: theme.border }]} />
            <FlowStep icon="qr-code" label="Scan QR" active={!!selectedJobId && !scanning} theme={theme} />
            <View style={[styles.flowLine, { backgroundColor: theme.border }]} />
            <FlowStep icon="checkmark-done" label="Confirm" active={scanning} theme={theme} />
          </View>
        </View>

        {!selectedJobId ? (
          <View style={styles.mainContent}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Shifts</Text>
            <FlatList
              data={activeJobs}
              keyExtractor={item => item.id}
              renderItem={renderJobCard}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar-outline" size={48} color={theme.border} />
                  <Text style={[styles.emptyText, { color: theme.muted }]}>No active or pending shifts available.</Text>
                </View>
              }
            />

            <View style={styles.historySection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
              {history.map(item => (
                <View key={item.id} style={[styles.historyItem, { borderBottomColor: theme.border }]}>
                  <View style={[styles.historyIcon, { backgroundColor: item.type === 'CLOCK-IN' ? theme.success + '15' : theme.warning + '15' }]}>
                    <Ionicons name={item.type === 'CLOCK-IN' ? "log-in" : "log-out"} size={16} color={item.type === 'CLOCK-IN' ? theme.success : theme.warning} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.historyWorker, { color: theme.text }]}>{item.worker}</Text>
                    <Text style={[styles.historyShift, { color: theme.muted }]}>{item.shift}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.historyType, { color: item.type === 'CLOCK-IN' ? theme.success : theme.warning }]}>{item.type}</Text>
                    <Text style={[styles.historyTime, { color: theme.muted }]}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Animated.View entering={FadeInDown} style={styles.scannerOverlay}>
            <View style={[styles.cameraFrame, { borderColor: theme.business }]}>
              <Ionicons name="qr-code-outline" size={120} color={theme.business} style={{ opacity: 0.1 }} />
              <View style={[styles.corner, styles.topLeft, { borderColor: theme.business }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: theme.business }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.business }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: theme.business }]} />
              {scanning && (
                <View style={[styles.scanLine, { backgroundColor: theme.business }]} />
              )}
            </View>
            
            <Text style={[styles.selectedJobText, { color: theme.text }]}>
              Ready to verify: <Text style={{ fontWeight: '800', color: theme.business }}>{postedJobs.find(j => j.id === selectedJobId)?.title}</Text>
            </Text>

            <View style={styles.scanActions}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.business }]}
                onPress={() => handleMockScan('IN')}
              >
                <Ionicons name="enter-outline" size={20} color={theme.white} />
                <Text style={styles.actionButtonText}>Clock-IN</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.warning }]}
                onPress={() => handleMockScan('OUT')}
              >
                <Ionicons name="exit-outline" size={20} color={theme.white} />
                <Text style={styles.actionButtonText}>Clock-OUT</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedJobId(null)}>
              <Text style={[styles.backBtnText, { color: theme.muted }]}>Back to list</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { padding: 24, paddingTop: 60 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  headerIconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  primaryScanBox: { marginBottom: 24 },
  primaryScanBtn: { height: 64, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryScanText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  flowIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 },
  flowStep: { alignItems: 'center', gap: 6 },
  stepIcon: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  stepLabel: { fontSize: 10, fontWeight: '700' },
  flowLine: { flex: 1, height: 1, marginHorizontal: 8, marginTop: -16 },
  mainContent: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  jobCard: { padding: 16, borderRadius: 24, borderWidth: 1, marginBottom: 16 },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  jobTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  jobDetails: { gap: 4, marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, fontWeight: '500' },
  cardActionBtn: { height: 44, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  cardActionText: { fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', py: 40 },
  emptyText: { textAlign: 'center', marginTop: 12, fontSize: 14 },
  historySection: { marginTop: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1 },
  historyIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  historyWorker: { fontSize: 14, fontWeight: '700' },
  historyShift: { fontSize: 12 },
  historyType: { fontSize: 11, fontWeight: '800' },
  historyTime: { fontSize: 11 },
  scannerOverlay: { alignItems: 'center', padding: 24, marginTop: 20 },
  cameraFrame: { width: 260, height: 260, borderRadius: 40, borderWidth: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 32, position: 'relative', backgroundColor: 'rgba(0,0,0,0.02)' },
  corner: { position: 'absolute', width: 40, height: 40, borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 30 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 30 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 30 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 30 },
  scanLine: { position: 'absolute', width: '100%', height: 2, top: '50%' },
  selectedJobText: { fontSize: 16, marginBottom: 40, textAlign: 'center' },
  scanActions: { flexDirection: 'row', gap: 16, width: '100%' },
  actionButton: { flex: 1, height: 56, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  backBtn: { marginTop: 24 },
  backBtnText: { fontWeight: '600', fontSize: 14 },
});
