import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, StatusBar } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout, FadeIn } from 'react-native-reanimated';
import { ElevatedCard } from './ui/ElevatedCard';
import { LinearGradient } from 'expo-linear-gradient';

export function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { role, logout, isKycVerified, isSimVerified, workerData, updateWorkerData } = useAuth();
  const isWorker = role === 'WORKER';
  const accentColor = isWorker ? theme.worker : theme.business;
  const isDark = colorScheme === 'dark';

  const stats = isWorker ? [
    { label: 'Shifts', value: '24', icon: 'time-outline' },
    { label: 'Earnings', value: '₱12.5k', icon: 'cash-outline', color: theme.success },
    { label: 'Rating', value: '4.8', icon: 'star', color: '#FFD700' },
    { label: 'Acceptance', value: '98%', icon: 'checkmark-circle-outline' },
  ] : [
    { label: 'Posted', value: '12', icon: 'briefcase-outline' },
    { label: 'Spent', value: '₱45k', icon: 'card-outline', color: theme.success },
    { label: 'Rating', value: '4.9', icon: 'star', color: '#FFD700' },
    { label: 'Hires', value: '38', icon: 'people-outline' },
  ];

  const quickActions = [
    { label: 'Payout', icon: 'wallet-outline', color: theme.info },
    { label: 'History', icon: 'list-outline', color: theme.success },
    { label: 'Settings', icon: 'settings-outline', color: theme.muted },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />
      
      {/* 1. Top Gradient Header */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={[theme.worker, theme.business]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTopActions}>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerProfileInfo}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="person" size={50} color="#fff" />
              </View>
              {isKycVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: theme.success }]}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
              )}
            </View>
            
            <View style={styles.nameSection}>
              <Text style={styles.nameText}>JUAN DELA CRUZ</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{role}</Text>
                <View style={styles.badgeDivider} />
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 2. Floating Stats Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.floatingStatsContainer}>
          <ElevatedCard style={styles.statsCard}>
            <View style={styles.statsGrid}>
              {stats.map((stat, idx) => (
                <View key={idx} style={styles.statItem}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color || theme.muted} />
                  <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.muted }]}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </ElevatedCard>
        </Animated.View>
      </View>

      <View style={styles.mainContent}>
        {/* 3. Availability Toggle */}
        <Animated.View entering={FadeIn.delay(400)}>
          <ElevatedCard style={styles.availabilityCard}>
            <View style={styles.availabilityInfo}>
              <View style={[styles.statusIndicator, { backgroundColor: workerData.isOnline ? theme.success : theme.muted }]} />
              <View>
                <Text style={[styles.availabilityTitle, { color: theme.text }]}>
                  {workerData.isOnline ? 'Active & Available' : 'Offline / Hidden'}
                </Text>
                <Text style={[styles.availabilitySub, { color: theme.muted }]}>
                  {workerData.isOnline ? 'Visible to employers nearby' : 'Your profile is currently hidden'}
                </Text>
              </View>
            </View>
            <Switch 
              value={workerData.isOnline} 
              onValueChange={(val) => updateWorkerData({ isOnline: val })}
              trackColor={{ false: theme.border, true: theme.worker + '80' }}
              thumbColor={workerData.isOnline ? theme.worker : '#f4f3f4'}
            />
          </ElevatedCard>
        </Animated.View>

        {/* 4. Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, idx) => (
            <TouchableOpacity key={idx} style={[styles.actionPill, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.actionIconBox, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={18} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. Trust & Verification Card */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>TRUST & SECURITY</Text>
        </View>
        <ElevatedCard style={styles.trustCard}>
          <View style={styles.trustRow}>
            <Ionicons name="id-card" size={20} color={isKycVerified ? theme.success : theme.warning} />
            <Text style={[styles.trustText, { color: theme.text }]}>KYC Identity Status</Text>
            <Text style={[styles.trustStatus, { color: isKycVerified ? theme.success : theme.warning }]}>
              {isKycVerified ? 'Verified' : 'Action Required'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.trustRow}>
            <Ionicons name="shield-checkmark" size={20} color={isSimVerified ? theme.success : theme.danger} />
            <Text style={[styles.trustText, { color: theme.text }]}>Biometric & SIM Verification</Text>
            <Text style={[styles.trustStatus, { color: isSimVerified ? theme.success : theme.danger }]}>
              {isSimVerified ? 'Secured' : 'Unlinked'}
            </Text>
          </View>
        </ElevatedCard>

        {/* 6. Sectioned Settings List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>ACCOUNT</Text>
        </View>
        <ElevatedCard style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="person-outline" size={20} color={theme.text} />
            <Text style={[styles.settingsLabel, { color: theme.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="options-outline" size={20} color={theme.text} />
            <Text style={[styles.settingsLabel, { color: theme.text }]}>Work Preferences</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </TouchableOpacity>
        </ElevatedCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>SYSTEM</Text>
        </View>
        <ElevatedCard style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
            <Text style={[styles.settingsLabel, { color: theme.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.text} />
            <Text style={[styles.settingsLabel, { color: theme.text }]}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </TouchableOpacity>
        </ElevatedCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>SUPPORT</Text>
        </View>
        <ElevatedCard style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="help-circle-outline" size={20} color={theme.text} />
            <Text style={[styles.settingsLabel, { color: theme.text }]}>Help Center</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="bug-outline" size={20} color={theme.text} />
            <Text style={[styles.settingsLabel, { color: theme.text }]}>Report an Issue</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </TouchableOpacity>
        </ElevatedCard>

        <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { borderColor: theme.danger + '40' }]}>
          <Ionicons name="log-out-outline" size={20} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>LOGOUT ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 140 },
  headerWrapper: { marginBottom: 40 },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTopActions: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerProfileInfo: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, borderWidth: 3, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  nameSection: { flex: 1 },
  nameText: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  badgeDivider: { width: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 8 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#fff', marginLeft: 4 },
  
  floatingStatsContainer: {
    marginTop: -50,
    paddingHorizontal: 20,
  },
  statsCard: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 8 },
    })
  },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4, width: '25%' },
  statValue: { fontSize: 16, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '800', opacity: 0.6, letterSpacing: 0.5 },

  mainContent: { paddingHorizontal: 20, gap: 16 },
  
  availabilityCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderRadius: 20,
    marginTop: 8
  },
  availabilityInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  availabilityTitle: { fontSize: 15, fontWeight: '800' },
  availabilitySub: { fontSize: 11, fontWeight: '600', marginTop: 2 },

  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 14, 
    borderWidth: 1,
    gap: 8,
    width: '31%'
  },
  actionIconBox: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '800' },

  sectionHeader: { marginTop: 16, marginBottom: 8, marginLeft: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, opacity: 0.5 },
  
  trustCard: { padding: 16, borderRadius: 20 },
  trustRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  trustText: { flex: 1, fontSize: 13, fontWeight: '700' },
  trustStatus: { fontSize: 11, fontWeight: '900' },
  divider: { height: 1, width: '100%', opacity: 0.1 },

  settingsGroup: { padding: 8, borderRadius: 20 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 16 },
  settingsLabel: { flex: 1, fontSize: 14, fontWeight: '700' },

  logoutBtn: { 
    marginTop: 24, 
    padding: 18, 
    borderRadius: 20, 
    borderWidth: 1.5, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12 
  },
  logoutText: { fontSize: 14, fontWeight: '900', letterSpacing: 1 }
});

