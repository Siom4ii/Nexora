import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme, FlatList } from 'react-native';
import { QRService } from '../../services/qrService';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function QRScannerScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { postedJobs, updateJobStatus } = useAuth();
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const activeJobs = postedJobs.filter(j => j.status === 'PENDING' || j.status === 'ACTIVE');

  const handleMockScan = async (action: 'IN' | 'OUT') => {
    if (!selectedJobId) {
      Alert.alert('Selection Required', 'Please select a shift to scan for first.');
      return;
    }

    setScanning(true);
    // Simulating scanning a QR code
    setTimeout(async () => {
      const mockQrData = await QRService.generateOfflineSignedQR('worker_123', selectedJobId, action === 'IN' ? 'CLOCK_IN' : 'CLOCK_OUT');
      const isValid = await QRService.verifyScannedQR(mockQrData, selectedJobId);
      
      if (isValid) {
        if (action === 'IN') {
          updateJobStatus(selectedJobId, 'ACTIVE', 'clockInTime');
          Alert.alert('Clock-In Success', 'Worker attendance verified. Shift timer started.');
        } else {
          updateJobStatus(selectedJobId, 'COMPLETED', 'clockOutTime');
          Alert.alert('Clock-Out Success', 'Shift completed. Escrow funds released to worker.');
        }
        setScanning(false);
        setSelectedJobId(null);
      } else {
        Alert.alert('Verification Failed', 'Invalid or expired QR code.');
        setScanning(false);
      }
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Attendance Scanner</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Verify worker arrival and departure via QR.</Text>
      </View>

      {!selectedJobId ? (
        <Animated.View entering={FadeInDown} style={styles.selectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Shift to Scan</Text>
          <FlatList
            data={activeJobs}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.jobItem, { backgroundColor: theme.card }, Shadows.light]}
                onPress={() => setSelectedJobId(item.id)}
              >
                <Ionicons 
                  name={item.status === 'ACTIVE' ? "radio-button-on" : "time-outline"} 
                  size={20} 
                  color={theme.business} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jobName, { color: theme.text }]}>{item.title}</Text>
                  <Text style={{ color: theme.muted }}>Status: {item.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.border} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.muted }]}>No active or pending shifts available.</Text>
            }
          />
        </Animated.View>
      ) : (
        <View style={styles.scannerContainer}>
          <View style={[styles.cameraFrame, { borderColor: theme.business }]}>
            <Ionicons name="qr-code-outline" size={120} color={theme.business} style={{ opacity: 0.3 }} />
            {scanning && (
              <View style={[styles.scanLine, { backgroundColor: theme.business }]} />
            )}
          </View>
          
          <Text style={[styles.selectedJobText, { color: theme.text }]}>
            Scanning for: <Text style={{ fontWeight: '800' }}>{postedJobs.find(j => j.id === selectedJobId)?.title}</Text>
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.scanBtn, { backgroundColor: theme.business }]}
              onPress={() => handleMockScan('IN')}
            >
              <Text style={styles.btnText}>Clock-IN</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.scanBtn, { backgroundColor: '#FF9500' }]}
              onPress={() => handleMockScan('OUT')}
            >
              <Text style={styles.btnText}>Clock-OUT</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedJobId(null)}>
            <Text style={[styles.cancelText, { color: theme.muted }]}>Cancel Scanning</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 16, marginTop: 4 },
  selectionContainer: { flex: 1, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  jobItem: { padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  jobName: { fontSize: 16, fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 40 },
  scannerContainer: { flex: 1, alignItems: 'center', padding: 24 },
  cameraFrame: { width: 280, height: 280, borderRadius: 32, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 32 },
  scanLine: { position: 'absolute', width: '100%', height: 2, top: '50%' },
  selectedJobText: { fontSize: 16, marginBottom: 40 },
  buttonRow: { flexDirection: 'row', gap: 16, width: '100%' },
  scanBtn: { flex: 1, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 24 },
  cancelText: { fontWeight: '600' },
});
