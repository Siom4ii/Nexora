import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export function EarningsDashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { role } = useAuth();
  const isBusiness = role === 'BUSINESS';

  const accentColor = isBusiness ? theme.business : theme.worker;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerCard, { backgroundColor: accentColor }, Shadows.medium]}>
        <Text style={[styles.cardTitle, { color: theme.white }]}>
          {isBusiness ? 'Total Hiring Expenses' : 'Total Earnings'}
        </Text>
        <Text style={[styles.amount, { color: theme.white }]}>
          {isBusiness ? '₱12,000.00' : '₱8,450.00'}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Transaction History</Text>
      
      {[1, 2, 3].map((i) => (
        <View key={i} style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }, Shadows.light]}>
          <View>
            <Text style={[styles.historyTitle, { color: theme.text }]}>
              {isBusiness ? 'Shift Payment #824' : 'Completed Shift'}
            </Text>
            <Text style={[styles.historyDate, { color: theme.muted }]}>April 22, 2026</Text>
          </View>
          <Text style={[styles.historyAmount, { color: isBusiness ? theme.danger : theme.success }]}>
            {isBusiness ? '-₱500.00' : '+₱500.00'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerCard: { padding: 25, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  amount: { fontSize: 40, fontWeight: 'bold', marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, letterSpacing: 1 },
  historyCard: { padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  historyTitle: { fontSize: 15, fontWeight: '700' },
  historyDate: { fontSize: 12, marginTop: 4 },
  historyAmount: { fontSize: 16, fontWeight: 'bold' }
});
