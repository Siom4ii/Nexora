import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LocationService } from '../../services/locationService';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInRight, 
  SlideInDown, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  useSharedValue,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { useAuth } from '../../context/AuthContext';
import { ModernButton } from '../../components/ui/ModernButton';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FilterChip = ({ label, active, onPress, theme }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      styles.filterChip, 
      { backgroundColor: active ? theme.business : theme.card, borderColor: active ? theme.business : theme.border }
    ]}
  >
    <Text style={[styles.filterText, { color: active ? theme.white : theme.muted }]}>{label}</Text>
  </TouchableOpacity>
);

export default function BusinessDashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { postedJobs, addJob, hireWorker } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'DISCOVERY' | 'PENDING' | 'HISTORY'>('DISCOVERY');
  const [workers, setWorkers] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', rate: '' });
  const [activeFilter, setActiveFilter] = useState('Nearest');

  const [applicants, setApplicants] = useState<any[]>([
    { id: 'app1', name: 'Maria Santos', rating: 4.9, role: 'Cashier', distance: '0.8km', status: 'Available Now' },
    { id: 'app2', name: 'Rico Blanco', rating: 4.7, role: 'Service Crew', distance: '1.2km', status: 'Available Now' },
  ]);

  const radarScale = useSharedValue(1);
  const radarOpacity = useSharedValue(0.5);

  useEffect(() => {
    LocationService.getNearbyWorkers(5).then(setWorkers);
    
    radarScale.value = withRepeat(
      withTiming(1.5, { duration: 2000 }),
      -1,
      false
    );
    radarOpacity.value = withRepeat(
      withTiming(0, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const animatedRadarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: radarScale.value }],
    opacity: radarOpacity.value,
  }));

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
        <View style={[styles.avatarBox, { backgroundColor: theme.business + '10', borderColor: theme.business + '30' }]}>
          <Ionicons name="person" size={24} color={theme.business} />
          <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.workerName, { color: theme.text }]}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.text }]}>4.8</Text>
            </View>
          </View>
          <Text style={[styles.workerSub, { color: theme.muted }]}>{item.skill} • {item.distance}KM • <Text style={{ color: theme.success }}>Available Now</Text></Text>
        </View>
        <TouchableOpacity 
          style={[styles.hireNowBtn, { backgroundColor: theme.business }]}
          onPress={() => Alert.alert('COMMAND SENT', `Invite transmitted to ${item.name}`)}
        >
          <Text style={styles.hireNowBtnText}>Invite to Job</Text>
        </TouchableOpacity>
      </View>
    </ElevatedCard>
  );

  const getTabCount = (tab: string) => {
    if (tab === 'DISCOVERY') return workers.length;
    if (tab === 'PENDING') return postedJobs.filter(j => j.status === 'PENDING').length + applicants.length;
    if (tab === 'HISTORY') return postedJobs.filter(j => j.status === 'ACTIVE').length;
    return 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={FadeIn.duration(1000)} style={[styles.commandHeader, { backgroundColor: isDark ? 'transparent' : theme.business + '08' }]}>
        <Animated.View style={[styles.radarPulse, animatedRadarStyle, { borderColor: theme.business }]} />
        <View style={[styles.radarCircle, { borderColor: theme.business + '20' }]} />
        <Ionicons name="locate-outline" size={48} color={theme.business} />
        <Text style={[styles.commandTitle, { color: theme.text }]}>OPERATIONS CENTER</Text>
        <View style={[styles.statusStrip, { backgroundColor: theme.business + '15' }]}>
          <View style={[styles.activeDot, { backgroundColor: theme.business }]} />
          <Text style={[styles.statusText, { color: theme.business }]}>{workers.length} WORKERS AVAILABLE NEARBY</Text>
          <TouchableOpacity onPress={() => {}} style={{ marginLeft: 4 }}>
            <Ionicons name="refresh-outline" size={14} color={theme.business} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        {['DISCOVERY', 'PENDING', 'HISTORY'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => handleTabChange(tab as any)}
            style={[
              styles.tabItem, 
              activeTab === tab && { borderBottomColor: theme.business, borderBottomWidth: 3 }
            ]}
          >
            <View style={styles.tabContent}>
              <Text style={[
                styles.tabText, 
                { color: activeTab === tab ? theme.business : theme.muted }
              ]}>
                {tab}
              </Text>
              <View style={[styles.tabBadge, { backgroundColor: activeTab === tab ? theme.business : theme.muted + '20' }]}>
                <Text style={[styles.tabBadgeText, { color: activeTab === tab ? theme.white : theme.muted }]}>{getTabCount(tab)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'DISCOVERY' && (
          <View style={{ flex: 1 }}>
            <View style={styles.filterRow}>
              {['Nearest', 'Top Rated', 'Available Now'].map(f => (
                <FilterChip 
                  key={f} 
                  label={f} 
                  active={activeFilter === f} 
                  onPress={() => setActiveFilter(f)}
                  theme={theme}
                />
              ))}
            </View>
            <FlatList
              data={workers}
              keyExtractor={item => item.id}
              renderItem={renderWorkerCard}
              contentContainerStyle={styles.listPadding}
              ListFooterComponent={() => (
                <View style={styles.footerSuggestions}>
                  <Text style={[styles.sectionHeader, { color: theme.text }]}>Suggested Workers</Text>
                  <Text style={[styles.footerSub, { color: theme.muted }]}>Based on your recent history</Text>
                </View>
              )}
            />
          </View>
        )}

        {activeTab === 'PENDING' && (
          <ScrollView contentContainerStyle={styles.pendingContainer}>
            <Animated.View entering={FadeInRight}>
              <Text style={[styles.subSectionTitle, { color: theme.muted }]}>ACTIVE REQUESTS ({postedJobs.filter(j => j.status === 'PENDING').length})</Text>
              {postedJobs.filter(j => j.status === 'PENDING').map((job, idx) => (
                <ElevatedCard key={job.id} style={styles.cyberJobInfo} delay={idx * 100}>
                  <Ionicons name="pulse" size={20} color={theme.business} />
                  <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title} • ₱{job.rate}</Text>
                  <View style={[styles.waitingBadge, { backgroundColor: theme.warning + '20' }]}>
                    <Text style={[styles.blinkText, { color: theme.warning }]}>WAITING</Text>
                  </View>
                </ElevatedCard>
              ))}
              
              <Text style={[styles.subSectionTitle, { color: theme.muted, marginTop: 32 }]}>APPLICANT QUEUE ({applicants.length})</Text>
              {applicants.map((app, idx) => (
                <ElevatedCard key={app.id} style={styles.applicantCard} delay={idx * 150}>
                  <View style={styles.workerInfo}>
                    <View style={[styles.avatarBox, { backgroundColor: theme.info + '10', borderColor: theme.info + '30' }]}>
                      <Ionicons name="person" size={24} color={theme.info} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.workerName, { color: theme.text }]}>{app.name}</Text>
                      <Text style={[styles.workerSub, { color: theme.muted }]}>{app.role} • ⭐ {app.rating}</Text>
                    </View>
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={[styles.declineBtn, { borderColor: theme.border }]}><Ionicons name="close" size={20} color={theme.danger} /></TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.hireBtn, { backgroundColor: theme.business }]}
                        onPress={() => handleHire(app)}
                      >
                        <Text style={styles.hireBtnText}>HIRE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ElevatedCard>
              ))}
            </Animated.View>
          </ScrollView>
        )}

        {activeTab === 'HISTORY' && (
          <ScrollView contentContainerStyle={styles.historyContainer}>
            <Animated.View entering={FadeInRight}>
              <Text style={[styles.subSectionTitle, { color: theme.muted }]}>DEPLOYED UNITS</Text>
              {postedJobs.filter(j => j.status === 'ACTIVE').map((job, idx) => (
                <ElevatedCard key={job.id} style={styles.activeUnitCard} delay={idx * 100}>
                  <View style={styles.avatarBox}>
                    <Ionicons name="flash" size={20} color={theme.business} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.workerName, { color: theme.text }]}>{job.workerName}</Text>
                    <Text style={{ color: theme.muted, fontSize: 12 }}>Sector: {job.title}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: theme.business + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: theme.business }]}>LIVE</Text>
                  </View>
                </ElevatedCard>
              ))}
              <Text style={[styles.subSectionTitle, { color: theme.muted, marginTop: 32 }]}>PAST TALENT</Text>
              <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 40, fontSize: 13 }}>No previous activity data found.</Text>
            </Animated.View>
          </ScrollView>
        )}
      </View>

      <View style={styles.fabContainer}>
        <View style={[styles.fabTooltip, { backgroundColor: theme.text }]}>
          <Text style={[styles.fabTooltipText, { color: theme.background }]}>Create Job</Text>
        </View>
        <TouchableOpacity 
          style={[styles.fabCyber, { backgroundColor: theme.business }, Shadows.medium]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setModalVisible(true);
          }}
        >
          <Ionicons name="briefcase" size={28} color={theme.white} />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <Animated.View entering={SlideInDown} style={[styles.cyberModal, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeaderCyber}>
              <Text style={[styles.modalTitleCyber, { color: theme.text }]}>New Shift</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={24} color={theme.muted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cyberInputWrapper}>
              <Text style={[styles.cyberLabel, { color: theme.muted }]}>UNIT ROLE</Text>
              <TextInput 
                style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. Service Crew"
                placeholderTextColor={theme.muted}
                value={newJob.title}
                onChangeText={v => setNewJob({...newJob, title: v})}
              />
            </View>

            <View style={styles.cyberInputWrapper}>
              <Text style={[styles.cyberLabel, { color: theme.muted }]}>CREDIT ALLOCATION (₱)</Text>
              <TextInput 
                style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="500"
                placeholderTextColor={theme.muted}
                keyboardType="number-pad"
                value={newJob.rate}
                onChangeText={v => setNewJob({...newJob, rate: v})}
              />
            </View>
            
            <View style={styles.modalActionRow}>
              <ModernButton 
                title="Post Shift" 
                onPress={handlePostJob}
                variant="business"
                style={{ flex: 1 }}
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
  commandHeader: { height: 200, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  radarPulse: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 2 },
  radarCircle: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1 },
  commandTitle: { fontSize: 20, fontWeight: '800', marginTop: 16, letterSpacing: 2 },
  statusStrip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1 },
  tabItem: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  tabContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tabText: { fontSize: 12, fontWeight: '700' },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  tabBadgeText: { fontSize: 10, fontWeight: '800' },
  content: { flex: 1 },
  filterRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 15 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '600' },
  listPadding: { paddingHorizontal: 20, paddingBottom: 120 },
  workerCard: { marginBottom: 12, borderRadius: 16 },
  workerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  onlineIndicator: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workerName: { fontSize: 16, fontWeight: '700' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700' },
  workerSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  hireNowBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  hireNowBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  sectionHeader: { fontSize: 18, fontWeight: '700', marginTop: 24 },
  footerSuggestions: { paddingVertical: 20 },
  footerSub: { fontSize: 13, marginTop: 4 },
  pendingContainer: { padding: 20, paddingBottom: 150 },
  subSectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 16, letterSpacing: 1 },
  cyberJobInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, borderRadius: 16 },
  jobTitle: { flex: 1, fontWeight: '700', fontSize: 14 },
  waitingBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  blinkText: { fontSize: 10, fontWeight: '800' },
  historyContainer: { padding: 20, paddingBottom: 150 },
  activeUnitCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, borderRadius: 16 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 10, fontWeight: '800' },
  fabContainer: { position: 'absolute', bottom: 100, right: 24, alignItems: 'center', zIndex: 100 },
  fabTooltip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
  fabTooltipText: { fontSize: 10, fontWeight: '700' },
  fabCyber: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  cyberModal: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, borderWidth: 1, borderBottomWidth: 0 },
  modalHeaderCyber: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitleCyber: { fontSize: 20, fontWeight: '700' },
  closeModalBtn: { padding: 4 },
  cyberInputWrapper: { marginBottom: 24 },
  cyberLabel: { fontSize: 11, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 },
  cyberInput: { paddingVertical: 12, borderBottomWidth: 1.5, fontSize: 17, fontWeight: '600' },
  modalActionRow: { marginTop: 8 },
  applicantCard: { marginBottom: 12, borderRadius: 16 },
  actionRow: { flexDirection: 'row', gap: 8 },
  declineBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  hireBtn: { paddingHorizontal: 20, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  hireBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
});
