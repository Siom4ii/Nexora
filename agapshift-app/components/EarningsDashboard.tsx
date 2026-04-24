import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

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

export function EarningsDashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { role } = useAuth();
  const isBusiness = role === 'BUSINESS';
  const [timeRange, setTimeRange] = useState('This Week');
  const [activeFilter, setActiveFilter] = useState('All');

  const accentColor = isBusiness ? theme.business : theme.worker;

  const categories = [
    { name: 'Logistics', amount: 7000, color: '#3B82F6', percentage: 58 },
    { name: 'Barista', amount: 5000, color: '#10B981', percentage: 42 },
  ];

  const transactions = [
    { id: '1', title: 'Barista Help', worker: 'Maria S.', status: 'Completed', method: 'GCash', date: 'April 22, 2026', amount: 500, icon: 'cafe' },
    { id: '2', title: 'Logistics Aid', worker: 'Rico B.', status: 'Pending', method: 'Maya', date: 'April 21, 2026', amount: 750, icon: 'truck' },
    { id: '3', title: 'Delivery Unit', worker: 'John D.', status: 'Completed', method: 'Bank', date: 'April 20, 2026', amount: 1200, icon: 'bicycle' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Export */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.mainTitle, { color: theme.text }]}>{isBusiness ? 'Expenses' : 'Earnings'}</Text>
          <Text style={[styles.subTitle, { color: theme.muted }]}>Financial Overview</Text>
        </View>
        <TouchableOpacity style={[styles.exportBtn, { borderColor: theme.border }]}>
          <Ionicons name="download-outline" size={20} color={theme.business} />
          <Text style={[styles.exportText, { color: theme.business }]}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <Animated.View entering={FadeInDown.duration(600)}>
        <LinearGradient
          colors={isBusiness ? ['#10B981', '#059669'] : ['#3B82F6', '#2563EB']}
          style={[styles.headerCard, Shadows.medium]}
        >
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardTitle, { color: 'rgba(255,255,255,0.8)' }]}>
              {isBusiness ? 'Total Hiring Expenses' : 'Total Earnings'}
            </Text>
            <TouchableOpacity 
              style={styles.timeToggle}
              onPress={() => setTimeRange(timeRange === 'This Week' ? 'This Month' : 'This Week')}
            >
              <Text style={styles.timeToggleText}>{timeRange}</Text>
              <Ionicons name="chevron-down" size={12} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.amount, { color: theme.white }]}>
            {isBusiness ? '₱12,000.00' : '₱8,450.00'}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.trendIndicator}>
              <Ionicons name="trending-up" size={16} color="#FFF" />
              <Text style={styles.trendText}>↑ 12% from last week</Text>
            </View>
            <View style={styles.txCountBox}>
              <Text style={styles.txCountText}>24 Shifts</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Data Visualization Section */}
      <View style={styles.vizSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Category Breakdown</Text>
        <View style={[styles.vizCard, { backgroundColor: theme.card, borderColor: theme.border }, Shadows.light]}>
          <View style={styles.chartContainer}>
            {categories.map((cat, index) => (
              <View 
                key={index} 
                style={[
                  styles.chartBar, 
                  { width: `${cat.percentage}%`, backgroundColor: cat.color, borderTopLeftRadius: index === 0 ? 8 : 0, borderBottomLeftRadius: index === 0 ? 8 : 0, borderTopRightRadius: index === categories.length - 1 ? 8 : 0, borderBottomRightRadius: index === categories.length - 1 ? 8 : 0 }
                ]} 
              />
            ))}
          </View>
          <View style={styles.legendContainer}>
            {categories.map((cat, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                <View>
                  <Text style={[styles.legendName, { color: theme.text }]}>{cat.name}</Text>
                  <Text style={[styles.legendAmount, { color: theme.muted }]}>₱{cat.amount.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Transaction List Section */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Transaction History</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: theme.business }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {['All', 'This Week', 'This Month', 'GCash', 'Maya'].map(f => (
            <FilterChip 
              key={f} 
              label={f} 
              active={activeFilter === f} 
              onPress={() => setActiveFilter(f)}
              theme={theme}
            />
          ))}
        </ScrollView>
        
        {transactions.map((tx, idx) => (
          <Animated.View key={tx.id} entering={FadeInRight.delay(idx * 100)}>
            <Pressable 
              style={[
                styles.historyCard, 
                { backgroundColor: theme.card, borderColor: theme.border }, 
                Shadows.light
              ]}
            >
              <View style={[styles.txIconContainer, { backgroundColor: isBusiness ? theme.danger + '10' : theme.success + '10' }]}>
                <Ionicons name={tx.icon as any} size={22} color={isBusiness ? theme.danger : theme.success} />
              </View>
              
              <View style={styles.txMainInfo}>
                <Text style={[styles.txTitle, { color: theme.text }]}>{tx.title}</Text>
                <Text style={[styles.txSub, { color: theme.muted }]}>{tx.worker} • {tx.method}</Text>
                <Text style={[styles.txDate, { color: theme.muted }]}>{tx.date}</Text>
              </View>

              <View style={styles.txRightCol}>
                <Text style={[styles.txAmount, { color: isBusiness ? theme.danger : theme.success }]}>
                  {isBusiness ? '-' : '+'}₱{tx.amount.toFixed(2)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: tx.status === 'Completed' ? theme.success + '15' : theme.warning + '15' }]}>
                  <Text style={[styles.statusText, { color: tx.status === 'Completed' ? theme.success : theme.warning }]}>
                    {tx.status}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}

        <View style={[styles.insightBox, { backgroundColor: theme.business + '08', borderColor: theme.business + '20' }]}>
          <Ionicons name="bulb-outline" size={20} color={theme.business} />
          <Text style={[styles.insightText, { color: theme.text }]}>
            You've spent <Text style={{fontWeight: '800'}}>₱12,000</Text> on <Text style={{fontWeight: '800'}}>24 shifts</Text> this month. Top category: <Text style={{fontWeight: '800'}}>Logistics</Text>.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 40 },
  mainTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subTitle: { fontSize: 14, fontWeight: '500', marginTop: 2 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  exportText: { fontSize: 12, fontWeight: '700' },
  headerCard: { padding: 24, borderRadius: 24, marginBottom: 32 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  timeToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  timeToggleText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  amount: { fontSize: 36, fontWeight: '800', marginVertical: 12, letterSpacing: -1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  trendIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trendText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  txCountBox: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  txCountText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  vizSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16, letterSpacing: -0.2 },
  vizCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  chartContainer: { height: 12, width: '100%', flexDirection: 'row', borderRadius: 6, overflow: 'hidden', marginBottom: 20 },
  chartBar: { height: '100%' },
  legendContainer: { flexDirection: 'row', gap: 24 },
  legendItem: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendName: { fontSize: 13, fontWeight: '700' },
  legendAmount: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  historySection: { flex: 1 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllText: { fontSize: 13, fontWeight: '700' },
  filterRow: { flexDirection: 'row', marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  filterText: { fontSize: 12, fontWeight: '600' },
  historyCard: { padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1 },
  txIconContainer: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  txMainInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '700' },
  txSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  txDate: { fontSize: 10, fontWeight: '500', marginTop: 4 },
  txRightCol: { alignItems: 'flex-end', gap: 6 },
  txAmount: { fontSize: 16, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  insightBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 12 },
  insightText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
