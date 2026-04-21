import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

export default function FinancialSetupScreen() {
  const router = useRouter();
  const { role, login } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const [method, setMethod] = useState<'BANK' | 'EWALLET' | null>(null);
  const [loading, setLoading] = useState(false);

  const accentColor = role === 'WORKER' ? theme.worker : theme.business;

  const handleAuthorize = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      if (role === 'BUSINESS') {
        router.replace('/(business)/job-posting');
      } else {
        router.replace('/(worker)/gig-map');
      }
    }, 1500);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(800)}>
          <Text style={[styles.title, { color: theme.text }]}>
            {role === 'WORKER' ? 'PAYOUT DESTINATION' : 'SECURE PAYMENTS'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {role === 'WORKER' 
              ? '// WHERE SHOULD WE TRANSFER YOUR EARNINGS?' 
              : '// LINK BUSINESS ACCOUNT TO FUEL ESCROW VAULT'}
          </Text>
        </Animated.View>

        <View style={styles.choiceContainer}>
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              { backgroundColor: theme.card, borderColor: method === 'BANK' ? accentColor : theme.border }, 
              Shadows.light
            ]}
            onPress={() => setMethod('BANK')}
          >
            <Ionicons name="business-outline" size={28} color={method === 'BANK' ? accentColor : theme.muted} />
            <Text style={[styles.choiceText, { color: theme.text }]}>LINK BANK ACCOUNT</Text>
            <View style={[styles.radio, { borderColor: theme.border }]}>
              {method === 'BANK' && <View style={[styles.radioFill, { backgroundColor: accentColor }]} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              { backgroundColor: theme.card, borderColor: method === 'EWALLET' ? accentColor : theme.border }, 
              Shadows.light
            ]}
            onPress={() => setMethod('EWALLET')}
          >
            <Ionicons name="wallet-outline" size={28} color={method === 'EWALLET' ? accentColor : theme.muted} />
            <Text style={[styles.choiceText, { color: theme.text }]}>LINK E-WALLET (GCASH/MAYA)</Text>
            <View style={[styles.radio, { borderColor: theme.border }]}>
              {method === 'EWALLET' && <View style={[styles.radioFill, { backgroundColor: accentColor }]} />}
            </View>
          </TouchableOpacity>
        </View>

        {method && (
          <Animated.View entering={FadeInRight} style={styles.form}>
            <Text style={[styles.sectionLabel, { color: accentColor }]}>ACCOUNT CREDENTIALS</Text>
            <TextInput 
              style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="HOLDER NAME (E.G. JUAN DELA CRUZ)"
              placeholderTextColor={theme.muted}
            />
            <TextInput 
              style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
              placeholder={method === 'BANK' ? "ACCOUNT_NUMBER" : "MOBILE_NUMBER"}
              placeholderTextColor={theme.muted}
              keyboardType="number-pad"
            />
            
            {role === 'BUSINESS' && (
              <View style={styles.escrowConfig}>
                <View style={styles.escrowHeader}>
                  <Ionicons name="shield-checkmark" size={20} color={accentColor} />
                  <Text style={[styles.escrowTitle, { color: theme.text }]}>ESCROW CONFIGURATION</Text>
                </View>
                <View style={styles.bufferOptions}>
                  {['₱500', '₱1,000', 'PER-SHIFT'].map((opt) => (
                    <TouchableOpacity key={opt} style={[styles.bufferChip, { borderColor: theme.border }]}>
                      <Text style={[styles.bufferText, { color: theme.text }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <ModernButton 
              title={role === 'WORKER' ? "CONFIRM PAYOUT METHOD" : "AUTHORIZE & SECURE"} 
              onPress={handleAuthorize}
              loading={loading}
              variant={role === 'WORKER' ? 'worker' : 'business'}
              style={{ marginTop: 32, marginBottom: 40 }}
            />
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  subtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 40 },
  choiceContainer: { gap: 16, marginBottom: 40 },
  choiceCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1 },
  choiceText: { flex: 1, fontSize: 13, fontWeight: '900', marginLeft: 16, letterSpacing: 0.5 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioFill: { width: 12, height: 12, borderRadius: 6 },
  form: { gap: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  cyberInput: { padding: 18, borderBottomWidth: 1, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  escrowConfig: { padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', marginTop: 10 },
  escrowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  escrowTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  bufferOptions: { flexDirection: 'row', gap: 10 },
  bufferChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1 },
  bufferText: { fontSize: 10, fontWeight: '900' },
});
