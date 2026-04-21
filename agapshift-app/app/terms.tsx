import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Terms of Service</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>
          Last Updated: April 20, 2026{"\n\n"}
          1. Acceptance of Terms{"\n"}
          By accessing AgapShift, you agree to comply with these terms. If you do not agree, please do not use the platform.{"\n\n"}
          2. Platform Purpose{"\n"}
          AgapShift connects business entities with temporary workers. We provide the technology to facilitate these connections but are not the employer of the workers.{"\n\n"}
          3. User Verification{"\n"}
          Users must provide accurate legal information and valid government IDs. Misrepresentation will lead to immediate account termination.{"\n\n"}
          4. Payments and Escrow{"\n"}
          Businesses must deposit funds into escrow before a shift begins. Funds are released to workers upon verified clock-out. AgapShift takes a 10% platform commission.{"\n\n"}
          5. Liability{"\n"}
          AgapShift is not liable for on-site incidents, theft, or quality of work, though we provide a bilateral rating system for community trust.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 16, paddingBottom: 20 },
  backButton: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { padding: 24, paddingBottom: 100 },
  text: { fontSize: 14, lineHeight: 22 },
});
