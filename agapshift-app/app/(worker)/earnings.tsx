import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, TextInput } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkerWalletScreen() {
  const { postedJobs, workerData } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [showBalance, setShowBalance] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const completedJobs = postedJobs.filter(j => j.status === 'COMPLETED');
  
  const weeklyStats = [
    { day: 'Mon', amount: 500, height: '40%' },
    { day: 'Tue', amount: 0, height: '0%' },
    { day: 'Wed', amount: 750, height: '60%' },
    { day: 'Thu', amount: 1200, height: '90%' },
    { day: 'Fri', amount: 500, height: '40%' },
    { day: 'Sat', amount: 0, height: '0%' },
    { day: 'Sun', amount: 0, height: '0%' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>My Wallet</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>Manage your earnings & payouts</Text>
        </View>
        <TouchableOpacity style={[styles.profileIcon, { backgroundColor: theme.worker + '15' }]}>
          <Ionicons name="wallet-outline" size={24} color={theme.worker} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Balance Card */}
        <Animated.View entering={FadeInUp.duration(600)}>
          <LinearGradient
            colors={['#0062FF', '#0046B8']}
            style={[styles.balanceCard, Shadows.medium]}
          >
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {showBalance ? `₱${workerData.walletBalance.toLocaleString()}` : '••••••'}
            </Text>
            <View style={styles.balanceFooter}>
              <View style={styles.balanceStat}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={styles.statValue}>₱1,250</Text>
              </View>
              <View style={styles.balanceStat}>
                <Text style={styles.statLabel}>Total Earned</Text>
                <Text style={styles.statValue}>₱15,400</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: theme.worker + '10' }]}>
              <Ionicons name="arrow-up-outline" size={24} color={theme.worker} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: theme.success + '10' }]}>
              <Ionicons name="add-outline" size={24} color={theme.success} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Add Method</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: theme.info + '10' }]}>
              <Ionicons name="receipt-outline" size={24} color={theme.info} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Statement</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Earnings This Week</Text>
          <ElevatedCard style={styles.chartCard}>
            <View style={styles.chartWrapper}>
              {weeklyStats.map((item, idx) => (
                <View key={idx} style={styles.chartBarCol}>
                  <View style={styles.chartBarBase}>
                    <View style={[styles.chartBarFill, { height: item.height, backgroundColor: theme.worker }]} />
                  </View>
                  <Text style={[styles.chartDay, { color: theme.muted }]}>{item.day}</Text>
                </View>
              ))}
            </View>
          </ElevatedCard>
        </View>

        {/* Withdrawal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Withdrawal</Text>
          <ElevatedCard style={styles.withdrawCard}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputPrefix, { color: theme.text }]}>₱</Text>
              <TextInput
                style={[styles.withdrawInput, { color: theme.text }]}
                placeholder="0.00"
                placeholderTextColor={theme.muted}
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
              />
            </View>
            <View style={styles.methodInfo}>
              <Ionicons name="phone-portrait-outline" size={16} color={theme.success} />
              <Text style={[styles.methodText, { color: theme.muted }]}>To GCash: 0917 ••• 4455</Text>
            </View>
            <TouchableOpacity 
              style={[styles.mainWithdrawBtn, { backgroundColor: theme.worker }]}
              disabled={!withdrawAmount}
            >
              <Text style={styles.withdrawBtnText}>Request Withdrawal</Text>
            </TouchableOpacity>
            <Text style={[styles.processingNote, { color: theme.muted }]}>
              Processed within 24 hours • Min ₱500
            </Text>
          </ElevatedCard>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
            <TouchableOpacity><Text style={[styles.viewAll, { color: theme.worker }]}>View All</Text></TouchableOpacity>
          </View>
          
          {completedJobs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={40} color={theme.border} />
              <Text style={[styles.emptyText, { color: theme.muted }]}>No recent activity</Text>
            </View>
          ) : (
            completedJobs.map((job, idx) => (
              <Animated.View key={job.id} entering={FadeInRight.delay(idx * 100)}>
                <Pressable style={[styles.txCard, { borderBottomColor: theme.border }]}>
                  <View style={[styles.txIconBox, { backgroundColor: theme.success + '10' }]}>
                    <Ionicons name="cafe-outline" size={20} color={theme.success} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txTitle, { color: theme.text }]}>{job.title}</Text>
                    <Text style={[styles.txDate, { color: theme.muted }]}>April 22, 2026 • 10:45 AM</Text>
                  </View>
                  <View style={styles.txAmountCol}>
                    <Text style={[styles.txAmount, { color: theme.success }]}>+₱{parseFloat(job.rate).toLocaleString()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: theme.success + '15' }]}>
                      <Text style={[styles.statusText, { color: theme.success }]}>Paid</Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))
          )}
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed-outline" size={14} color={theme.muted} />
          <Text style={[styles.securityText, { color: theme.muted }]}>
            All transactions are encrypted and secured by AgapShift
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  header: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 2 },
  profileIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20 },
  balanceCard: { padding: 24, borderRadius: 28, height: 200, justifyContent: 'space-between' },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  balanceAmount: { color: '#FFF', fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  balanceFooter: { flexDirection: 'row', gap: 32 },
  balanceStat: { gap: 4 },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },
  statValue: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 32, paddingHorizontal: 10 },
  actionItem: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 12, fontWeight: '700' },
  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  viewAll: { fontSize: 13, fontWeight: '700' },
  chartCard: { padding: 20, borderRadius: 24 },
  chartWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  chartBarCol: { alignItems: 'center', gap: 8 },
  chartBarBase: { width: 30, height: 100, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 15, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 15 },
  chartDay: { fontSize: 10, fontWeight: '700' },
  withdrawCard: { padding: 20, borderRadius: 24 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  inputPrefix: { fontSize: 24, fontWeight: '700', marginRight: 8 },
  withdrawInput: { flex: 1, fontSize: 32, fontWeight: '800' },
  methodInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 20 },
  methodText: { fontSize: 13, fontWeight: '500' },
  mainWithdrawBtn: { height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  withdrawBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  processingNote: { textAlign: 'center', fontSize: 11, marginTop: 12, fontWeight: '500' },
  txCard: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 1 },
  txIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '700' },
  txDate: { fontSize: 12, marginTop: 2 },
  txAmountCol: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 16, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 12, fontSize: 13 },
  securityNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  securityText: { fontSize: 11, fontWeight: '500' },
});
