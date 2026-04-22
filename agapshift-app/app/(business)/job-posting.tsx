import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, FlatList, Modal, TextInput, Alert, Platform } from 'react-native';
import { LocationService } from '../../services/locationService';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight, SlideInDown, Layout, FadeIn, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { useAuth } from '../../context/AuthContext';
import { ModernButton } from '../../components/ui/ModernButton';
import * as Haptics from 'expo-haptics';

export default function BusinessDashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { postedJobs, addJob, hireWorker } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'DISCOVERY' | 'PENDING' | 'HISTORY'>('DISCOVERY');
  const [workers, setWorkers] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', rate: '' });

  const [applicants, setApplicants] = useState<any[]>([
    { id: 'app1', name: 'Maria Santos', rating: 4.9, role: 'Cashier', distance: '0.8km' },
    { id: 'app2', name: 'Rico Blanco', rating: 4.7, role: 'Service Crew', distance: '1.2km' },
  ]);

  useEffect(() => {
    LocationService.getNearbyWorkers(5).then(setWorkers);
  }, []);

  const handleTabChange = (tab: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handlePostJob = () => {
    if (!newJob.title || !newJob.rate) return;
    addJob({ title: newJob.title, rate: newJob.rate });
    setNewJob({ title: '', rate: '' });
    setModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleHire = (applicant: any) => {
    const pendingJob = postedJobs.find(j => j.status === 'PENDING');
    if (!pendingJob) {
      Alert.alert('NO OPEN SHIFTS', 'Please post a new shift first before hiring.');
      return;
    }
    hireWorker(pendingJob.id, applicant.id, applicant.name);
    setApplicants(prev => prev.filter(a => a.id !== applicant.id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('HIRED', `${applicant.name} has been assigned to ${pendingJob.title}.`);
  };

  const renderWorkerCard = ({ item, index }: { item: any, index: number }) => (
    <ElevatedCard style={styles.workerCard} delay={index * 100}>
      <View style={styles.workerInfo}>
        <View style={[styles.avatarBox, { borderColor: theme.business }]}>
          <Ionicons name="person" size={24} color={theme.business} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.workerName, { color: theme.text }]}>{item.name.toUpperCase()}</Text>
          <Text style={[styles.workerSub, { color: theme.muted }]}>SKILL: {item.skill.toUpperCase()} • DIST: {item.distance}KM</Text>
        </View>
        <TouchableOpacity 
          style={[styles.neonBtn, { borderColor: theme.business }]}
          onPress={() => Alert.alert('COMMAND SENT', `Invite transmitted to ${item.name}`)}
        >
          <Text style={[styles.neonBtnText, { color: theme.business }]}>INVITE</Text>
        </TouchableOpacity>
      </View>
    </ElevatedCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={FadeIn.duration(1000)} style={[styles.commandHeader, { backgroundColor: isDark ? 'transparent' : theme.business + '10' }]}>
        <View style={[styles.radarCircle, { borderColor: theme.business + '30' }]} />
        <View style={[styles.radarCircleSmall, { borderColor: theme.business + '50' }]} />
        <Ionicons name="scan-outline" size={48} color={theme.business} />
        <Text style={[styles.commandTitle, { color: theme.text }]}>OPERATIONS CENTER</Text>
        <View style={[styles.statusStrip, { backgroundColor: theme.business + '20' }]}>
          <View style={[styles.activeDot, { backgroundColor: theme.business }]} />
          <Text style={[styles.statusText, { color: theme.business }]}>SYSTEM ACTIVE: {workers.length} NODES DETECTED</Text>
        </View>
      </Animated.View>

      <View style={[styles.cyberTabs, { backgroundColor: isDark ? theme.white + '08' : theme.card }]}>
        {['DISCOVERY', 'PENDING', 'HISTORY'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => handleTabChange(tab as any)}
            style={[
              styles.cyberTab, 
              activeTab === tab && { borderBottomColor: theme.business, borderBottomWidth: 2 }
            ]}
          >
            <Text style={[
              styles.cyberTabText, 
              { color: activeTab === tab ? theme.business : theme.muted }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'DISCOVERY' && (
          <FlatList
            data={workers}
            keyExtractor={item => item.id}
            renderItem={renderWorkerCard}
            contentContainerStyle={styles.listPadding}
          />
        )}

        {activeTab === 'PENDING' && (
          <Animated.View entering={FadeInRight} style={styles.pendingContainer}>
            <Text style={[styles.subSectionTitle, { color: theme.muted }]}>ACTIVE REQUESTS</Text>
            {postedJobs.filter(j => j.status === 'PENDING').map((job, idx) => (
              <ElevatedCard key={job.id} style={styles.cyberJobInfo} delay={idx * 100}>
                <Ionicons name="pulse" size={20} color={theme.business} />
                <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title} • ₱{job.rate}</Text>
                <Text style={[styles.blinkText, { color: theme.warning }]}>[WAITING]</Text>
              </ElevatedCard>
            ))}
            
            <Text style={[styles.subSectionTitle, { color: theme.muted, marginTop: 32 }]}>APPLICANT QUEUE</Text>
            {applicants.map((app, idx) => (
              <ElevatedCard key={app.id} style={styles.applicantCard} delay={idx * 150}>
                <View style={styles.workerInfo}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.workerName, { color: theme.text }]}>{app.name.toUpperCase()}</Text>
                    <Text style={[styles.workerSub, { color: theme.muted }]}>{app.role.toUpperCase()} • {app.distance.toUpperCase()} • ⭐ {app.rating}</Text>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.declineBtn, { borderColor: theme.danger }]}><Ionicons name="close" size={20} color={theme.danger} /></TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.hireBtn, { backgroundColor: theme.business }]}
                      onPress={() => handleHire(app)}
                    >
                      <Text style={styles.neonBtnText}>HIRE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ElevatedCard>
            ))}
          </Animated.View>
        )}

        {activeTab === 'HISTORY' && (
          <Animated.View entering={FadeInRight} style={styles.historyContainer}>
            <Text style={[styles.subSectionTitle, { color: theme.muted }]}>DEPLOYED UNITS</Text>
            {postedJobs.filter(j => j.status === 'ACTIVE').map((job, idx) => (
              <ElevatedCard key={job.id} style={styles.activeUnitCard} delay={idx * 100}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.workerName, { color: theme.text }]}>{job.workerName?.toUpperCase()}</Text>
                  <Text style={{ color: theme.muted, fontSize: 11 }}>SECTOR: {job.title.toUpperCase()}</Text>
                </View>
                <View style={[styles.glitchBadge, { backgroundColor: theme.business }]}>
                  <Text style={[styles.glitchText, { color: theme.card }]}>LIVE DATA</Text>
                </View>
              </ElevatedCard>
            ))}
            <Text style={[styles.subSectionTitle, { color: theme.muted, marginTop: 32 }]}>PAST TALENT</Text>
            <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 20, fontSize: 12 }}>NO PREVIOUS DATA FOUND</Text>
          </Animated.View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.fabCyber, { borderColor: theme.business, backgroundColor: theme.background + 'E6' }, isDark && Shadows.glow.business]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color={theme.business} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: theme.text + 'CC' }]}>
          <Animated.View entering={SlideInDown} style={[styles.cyberModal, { backgroundColor: isDark ? theme.background : theme.card, borderColor: theme.business }]}>
            <View style={styles.modalHeaderCyber}>
              <Text style={[styles.modalTitleCyber, { color: theme.text }]}>INITIALIZE NEW SHIFT</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                <Ionicons name="close-outline" size={24} color={theme.business} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cyberInputWrapper}>
              <Text style={[styles.cyberLabel, { color: theme.business }]}>UNIT ROLE</Text>
              <TextInput 
                style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="E.G. LOGISTICS MANAGER"
                placeholderTextColor={theme.muted}
                value={newJob.title}
                onChangeText={v => setNewJob({...newJob, title: v})}
              />
            </View>

            <View style={styles.cyberInputWrapper}>
              <Text style={[styles.cyberLabel, { color: theme.business }]}>CREDIT ALLOCATION (₱)</Text>
              <TextInput 
                style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="1000"
                placeholderTextColor={theme.muted}
                keyboardType="number-pad"
                value={newJob.rate}
                onChangeText={v => setNewJob({...newJob, rate: v})}
              />
            </View>
            
            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={[styles.cancelActionBtn, { borderColor: theme.border }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelActionText, { color: theme.muted }]}>ABORT COMMAND</Text>
              </TouchableOpacity>
              <ModernButton 
                title="EXECUTE" 
                onPress={handlePostJob}
                variant="business"
                style={{ flex: 1 }}
                textStyle={{ fontSize: 13 }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  commandHeader: { height: 220, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  radarCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1 },
  radarCircleSmall: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1 },
  commandTitle: { fontSize: 22, fontWeight: '900', marginTop: 16, letterSpacing: 4 },
  statusStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginTop: 12 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cyberTabs: { flexDirection: 'row', paddingHorizontal: 10 },
  cyberTab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  cyberTabText: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  content: { flex: 1 },
  listPadding: { padding: 20, paddingBottom: 120 },
  workerCard: { marginBottom: 16 },
  workerInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarBox: { width: 50, height: 50, borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  workerName: { fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  workerSub: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  neonBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  neonBtnText: { fontSize: 10, fontWeight: '900', color: '#FFFFFF' },
  pendingContainer: { padding: 20 },
  subSectionTitle: { fontSize: 11, fontWeight: '900', marginBottom: 20, letterSpacing: 2 },
  cyberJobInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  jobTitle: { flex: 1, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  blinkText: { fontSize: 10, fontWeight: '900' },
  historyContainer: { padding: 20 },
  activeUnitCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  glitchBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 2 },
  glitchText: { color: '#000', fontSize: 9, fontWeight: '900' },
  fabCyber: { position: 'absolute', bottom: 100, right: 24, width: 64, height: 64, borderRadius: 12, borderWidth: 2, backgroundColor: 'rgba(5, 11, 24, 0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  cyberModal: { padding: 24, borderRadius: 20, borderWidth: 1 },
  modalHeaderCyber: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitleCyber: { fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  closeModalBtn: { padding: 4 },
  cyberInputWrapper: { marginBottom: 20 },
  cyberLabel: { fontSize: 10, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  cyberInput: { padding: 16, borderBottomWidth: 1, fontSize: 16, fontWeight: '700' },
  modalActionRow: { flexDirection: 'row', gap: 12, marginTop: 16, alignItems: 'center' },
  cancelActionBtn: { paddingVertical: 18, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelActionText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  applicantCard: { marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  declineBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: '#FF3B30', justifyContent: 'center', alignItems: 'center' },
  hireBtn: { paddingHorizontal: 22, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
});
