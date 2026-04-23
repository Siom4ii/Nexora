import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Data Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>
          Last Updated: April 20, 2026{"\n\n"}
          1. Data Collection{"\n"}
          We collect personal and professional information including name, contact details, government-issued IDs, and location to facilitate shift connections.{"\n\n"}
          2. Use of Information{"\n"}
          Your data is used to verify identities, ensure platform security, process payments, and provide job matches.{"\n\n"}
          3. Sharing and Disclosure{"\n"}
          We do not sell your personal data. Worker information (e.g., name, rating, skills) is shared with businesses for hiring purposes. Business information is shared with workers for shift execution.{"\n\n"}
          4. Security{"\n"}
          We implement industry-standard encryption to protect your sensitive data, including document uploads and payment information.{"\n\n"}
          5. User Rights{"\n"}
          You have the right to access, correct, or request deletion of your personal data by contacting our support team.
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
