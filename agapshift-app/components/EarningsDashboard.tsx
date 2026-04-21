import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function EarningsDashboard() {
  const { role } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {role === 'WORKER' ? (
        <>
          <View style={styles.headerCard}>
            <Text style={styles.cardTitle}>Total Earnings</Text>
            <Text style={styles.amount}>₱4,500.00</Text>
            <Text style={styles.subtext}>Available in Wallet (GCash Connected)</Text>
          </View>
          <Text style={styles.sectionTitle}>Recent Shifts</Text>
          <View style={styles.historyCard}>
            <Text style={styles.historyJob}>Barista (4 hrs)</Text>
            <Text style={styles.historyAmount}>+₱500.00</Text>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.headerCard, { backgroundColor: '#FF3B30' }]}>
            <Text style={[styles.cardTitle, { color: '#fff' }]}>Total Hiring Expenses</Text>
            <Text style={[styles.amount, { color: '#fff' }]}>₱12,000.00</Text>
            <Text style={[styles.subtext, { color: 'rgba(255,255,255,0.8)' }]}>This Month</Text>
          </View>
          <Text style={styles.sectionTitle}>Escrow History</Text>
          <View style={styles.historyCard}>
            <Text style={styles.historyJob}>Paid: Juan Dela Cruz</Text>
            <Text style={[styles.historyAmount, { color: '#FF3B30' }]}>-₱500.00</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  headerCard: { backgroundColor: '#34C759', padding: 25, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  cardTitle: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  amount: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginVertical: 10 },
  subtext: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  historyCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  historyJob: { fontSize: 16, fontWeight: 'bold' },
  historyAmount: { fontSize: 16, fontWeight: 'bold', color: '#34C759' }
});
