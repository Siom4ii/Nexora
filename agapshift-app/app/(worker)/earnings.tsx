import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { ElevatedCard } from '../../components/ui/ElevatedCard';

export default function WorkerEarningsScreen() {
  const { postedJobs, workerData } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const completedJobs = postedJobs.filter(j => j.status === 'COMPLETED');
  const platformCommissionRate = 0.10; // 10%

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>DIGITAL WALLET</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>// FINANCIAL DISBURSEMENT HUB</Text>
      </View>

      <View style={styles.content}>
        {/* Futuristic Wallet Card */}
        <Animated.View entering={FadeInUp.duration(800)}>
          <View style={[styles.walletCard, { backgroundColor: isDark ? theme.worker + '10' : theme.worker }, Shadows.glow.worker]}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletLabel}>TOTAL AVAILABLE CREDITS</Text>
              <Ionicons name="shield-checkmark" size={20} color={isDark ? theme.worker : "#fff"} />
            </View>
            <Text style={[styles.balanceText, { color: isDark ? theme.worker : "#fff" }]}>
              ₱{workerData.walletBalance.toLocaleString()}
            </Text>
            <View style={styles.walletFooter}>
              <Text style={styles.payoutStatus}>PAYOUT READY: YES</Text>
              <TouchableOpacity style={styles.transferBtn}>
                <Text style={[styles.transferText, { color: isDark ? theme.worker : theme.text }]}>WITHDRAW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>// TRANSACTION LOGS</Text>
          
          {completedJobs.length === 0 ? (
            <ElevatedCard style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>NO TRANSACTIONS FOUND</Text>
            </ElevatedCard>
          ) : (
            completedJobs.map((job, idx) => {
              const gross = parseFloat(job.rate);
              const commission = gross * platformCommissionRate;
              const net = gross - commission;

              return (
                <ElevatedCard key={job.id} style={styles.historyCard} delay={idx * 100}>
                  <View style={styles.historyHeader}>
                    <View>
                      <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title.toUpperCase()}</Text>
                      <Text style={[styles.jobMeta, { color: theme.muted }]}>ENTITY: {job.businessName?.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.netAmount, { color: theme.business }]}>+₱{net.toFixed(2)}</Text>
                  </View>
                  
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  
                  <View style={styles.mathRow}>
                    <Text style={[styles.mathLabel, { color: theme.muted }]}>GROSS ALLOCATION</Text>
                    <Text style={[styles.mathValue, { color: theme.text }]}>₱{gross.toFixed(2)}</Text>
                  </View>
                  <View style={styles.mathRow}>
                    <Text style={[styles.mathLabel, { color: theme.muted }]}>PLATFORM FEE (10%)</Text>
                    <Text style={[styles.mathValue, { color: '#FF3B30' }]}>-₱{commission.toFixed(2)}</Text>
                  </View>
                </ElevatedCard>
              );
            })
          )}
        </View>

        <View style={styles.reputationSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>// REPUTATION METRICS</Text>
          <ElevatedCard style={styles.repCard}>
            <View style={styles.ratingRow}>
              <View>
                <Text style={[styles.repLabel, { color: theme.worker }]}>RELIABILITY SCORE</Text>
                <Text style={[styles.ratingValue, { color: theme.text }]}>98.4%</Text>
              </View>
              <View style={styles.starsBox}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={16} color={theme.worker} />)}
              </View>
            </View>
            <Text style={[styles.feedbackQuote, { color: theme.muted }]}>
              "Worker was punctual and efficient. Highly recommended for logistics operations."
            </Text>
            <Text style={[styles.feedbackAuthor, { color: theme.worker }]}>// ANONYMOUS ENTITY FEEDBACK</Text>
          </ElevatedCard>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  subtitle: { fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 120 },
  walletCard: { padding: 24, borderRadius: 20, minHeight: 180, justifyContent: 'space-between' },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  balanceText: { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  walletFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payoutStatus: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '800' },
  transferBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  transferText: { fontSize: 10, fontWeight: '900' },
  historySection: { marginTop: 40 },
  sectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  historyCard: { padding: 20, marginBottom: 12 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  jobTitle: { fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  jobMeta: { fontSize: 9, fontWeight: '700', marginTop: 2 },
  netAmount: { fontSize: 18, fontWeight: '900' },
  divider: { height: 1, marginVertical: 16, opacity: 0.3 },
  mathRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  mathLabel: { fontSize: 9, fontWeight: '800' },
  mathValue: { fontSize: 11, fontWeight: '900' },
  reputationSection: { marginTop: 40 },
  repCard: { padding: 24 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  repLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  ratingValue: { fontSize: 24, fontWeight: '900' },
  starsBox: { flexDirection: 'row', gap: 4 },
  feedbackQuote: { fontSize: 13, fontStyle: 'italic', lineHeight: 20, marginBottom: 12 },
  feedbackAuthor: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  emptyCard: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});
