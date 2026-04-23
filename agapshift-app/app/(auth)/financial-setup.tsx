import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';

const BANKS = ['BDO', 'BPI', 'LANDBANK'];
const EWALLETS = ['GCash', 'Maya'];

export default function FinancialSetupScreen() {
  const router = useRouter();
  const { role, login } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const [method, setMethod] = useState<'BANK' | 'EWALLET' | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const accentColor = role === 'WORKER' ? theme.worker : theme.business;

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string | null } = {};
    
    if (!method) return false;
    if (!provider) return false;
    
    if (!holderName.trim()) {
      newErrors.holderName = 'Account name is required';
    } else if (holderName.trim().length < 3) {
      newErrors.holderName = 'Enter a valid full name';
    }

    if (method === 'EWALLET') {
      if (!accountNumber.startsWith('09') || accountNumber.length !== 11) {
        newErrors.accountNumber = 'Enter 11-digit PH mobile number (09XXXXXXXXX)';
      }
    } else {
      if (accountNumber.length < 10 || accountNumber.length > 16) {
        newErrors.accountNumber = 'Bank account number should be 10-16 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [method, provider, holderName, accountNumber]);

  useEffect(() => {
    if (method || provider || holderName || accountNumber) {
      validate();
    }
  }, [method, provider, holderName, accountNumber, validate]);

  const handleNumberChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    if (method === 'EWALLET') {
      setAccountNumber(numeric.slice(0, 11));
    } else {
      setAccountNumber(numeric.slice(0, 16));
    }
  };

  const handleAuthorize = () => {
    if (!validate()) return;
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

  const isFormValid = method && provider && holderName.trim().length >= 3 && 
    (method === 'EWALLET' ? (accountNumber.startsWith('09') && accountNumber.length === 11) : (accountNumber.length >= 10));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(800)}>
          <Text style={[styles.title, { color: theme.text }]}>
            {role === 'WORKER' ? 'PAYOUT DESTINATION' : 'SECURE PAYMENTS'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {role === 'WORKER' 
              ? 'WHERE SHOULD WE TRANSFER YOUR EARNINGS?' 
              : 'LINK BUSINESS ACCOUNT TO FUEL ESCROW VAULT'}
          </Text>
        </Animated.View>

        <View style={styles.choiceContainer}>
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[
              styles.choiceCard, 
              { 
                backgroundColor: theme.card, 
                borderColor: method === 'BANK' ? accentColor : theme.border,
                borderWidth: method === 'BANK' ? 2 : 1
              }, 
              method === 'BANK' ? (role === 'WORKER' ? Shadows.glow.worker : Shadows.glow.business) : Shadows.light
            ]}
            onPress={() => {
              setMethod('BANK');
              setProvider(null);
            }}
          >
            <View style={[styles.iconCircle, { backgroundColor: method === 'BANK' ? accentColor + '20' : theme.background }]}>
              <Ionicons name="business" size={24} color={method === 'BANK' ? accentColor : theme.muted} />
            </View>
            <Text style={[styles.choiceText, { color: theme.text, fontWeight: method === 'BANK' ? '900' : '700' }]}>LINK BANK ACCOUNT</Text>
            <View style={[styles.radio, { borderColor: method === 'BANK' ? accentColor : theme.border }]}>
              {method === 'BANK' && <View style={[styles.radioFill, { backgroundColor: accentColor }]} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            style={[
              styles.choiceCard, 
              { 
                backgroundColor: theme.card, 
                borderColor: method === 'EWALLET' ? accentColor : theme.border,
                borderWidth: method === 'EWALLET' ? 2 : 1
              }, 
              method === 'EWALLET' ? (role === 'WORKER' ? Shadows.glow.worker : Shadows.glow.business) : Shadows.light
            ]}
            onPress={() => {
              setMethod('EWALLET');
              setProvider(null);
            }}
          >
            <View style={[styles.iconCircle, { backgroundColor: method === 'EWALLET' ? accentColor + '20' : theme.background }]}>
              <Ionicons name="wallet" size={24} color={method === 'EWALLET' ? accentColor : theme.muted} />
            </View>
            <Text style={[styles.choiceText, { color: theme.text, fontWeight: method === 'EWALLET' ? '900' : '700' }]}>LINK E-WALLET</Text>
            <View style={[styles.radio, { borderColor: method === 'EWALLET' ? accentColor : theme.border }]}>
              {method === 'EWALLET' && <View style={[styles.radioFill, { backgroundColor: accentColor }]} />}
            </View>
          </TouchableOpacity>
        </View>

        {method && (
          <Animated.View entering={FadeInDown} layout={Layout.springify()} style={styles.form}>
            <View style={styles.providerSection}>
              <Text style={[styles.sectionLabel, { color: accentColor }]}>SELECT {method === 'BANK' ? 'BANK' : 'E-WALLET'}</Text>
              <View style={styles.providerList}>
                {(method === 'BANK' ? BANKS : EWALLETS).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.providerChip,
                      { 
                        borderColor: provider === p ? accentColor : theme.border,
                        backgroundColor: provider === p ? accentColor + '10' : 'transparent'
                      }
                    ]}
                    onPress={() => setProvider(p)}
                  >
                    <Text style={[styles.providerText, { color: provider === p ? accentColor : theme.muted }]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.sectionLabel, { color: accentColor }]}>ACCOUNT DETAILS</Text>
              
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={theme.muted} style={styles.inputIcon} />
                <TextInput 
                  style={[styles.cyberInput, { color: theme.text, borderColor: errors.holderName ? theme.danger : theme.border }]}
                  placeholder="Account Name (e.g. Juan Dela Cruz)"
                  placeholderTextColor={theme.muted}
                  value={holderName}
                  onChangeText={setHolderName}
                />
              </View>
              {errors.holderName && <Text style={styles.errorMessage}>{errors.holderName}</Text>}

              <View style={styles.inputWrapper}>
                <Ionicons name={method === 'BANK' ? "card-outline" : "phone-portrait-outline"} size={18} color={theme.muted} style={styles.inputIcon} />
                <TextInput 
                  style={[styles.cyberInput, { color: theme.text, borderColor: errors.accountNumber ? theme.danger : theme.border }]}
                  placeholder={method === 'BANK' ? "Account Number (10–16 digits)" : "Mobile Number (e.g. 0917XXXXXXX)"}
                  placeholderTextColor={theme.muted}
                  keyboardType="number-pad"
                  value={accountNumber}
                  onChangeText={handleNumberChange}
                  maxLength={method === 'EWALLET' ? 11 : 16}
                />
              </View>
              {errors.accountNumber && <Text style={styles.errorMessage}>{errors.accountNumber}</Text>}
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleLabel, { color: theme.text }]}>Set as Primary Payout Method</Text>
                <Text style={[styles.toggleSub, { color: theme.muted }]}>Use this for all future earnings automatically</Text>
              </View>
              <Switch
                value={isPrimary}
                onValueChange={setIsPrimary}
                trackColor={{ false: theme.border, true: accentColor + '80' }}
                thumbColor={isPrimary ? accentColor : '#f4f3f4'}
              />
            </View>
            
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

            <View style={styles.securityNote}>
              <Ionicons name="lock-closed" size={14} color={theme.success} />
              <Text style={[styles.securityText, { color: theme.muted }]}>
                Your payout details are securely encrypted and protected.
              </Text>
            </View>

            <ModernButton 
              title={role === 'WORKER' ? "CONFIRM PAYOUT METHOD" : "AUTHORIZE & SECURE"} 
              onPress={handleAuthorize}
              loading={loading}
              disabled={!isFormValid}
              variant={role === 'WORKER' ? 'worker' : 'business'}
              style={{ 
                marginTop: 16, 
                marginBottom: 40,
                opacity: isFormValid ? 1 : 0.6
              }}
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
  choiceContainer: { gap: 16, marginBottom: 32 },
  choiceCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1 
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: { flex: 1, fontSize: 13, marginLeft: 16, letterSpacing: 0.5 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioFill: { width: 12, height: 12, borderRadius: 6 },
  form: { gap: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  providerSection: {},
  providerList: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  providerChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5 },
  providerText: { fontSize: 13, fontWeight: '800' },
  inputGroup: { gap: 16 },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 18, zIndex: 1 },
  cyberInput: { 
    padding: 16, 
    paddingLeft: 44,
    borderWidth: 1, 
    borderRadius: 14,
    fontSize: 15, 
    fontWeight: '600',
  },
  errorMessage: { color: '#FF3B30', fontSize: 11, fontWeight: '600', marginTop: -8, marginLeft: 4 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  toggleLabel: { fontSize: 14, fontWeight: '700' },
  toggleSub: { fontSize: 11, marginTop: 2 },
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  securityText: { fontSize: 11, fontWeight: '500' },
  escrowConfig: { padding: 20, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginTop: 0 },
  escrowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  escrowTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  bufferOptions: { flexDirection: 'row', gap: 10 },
  bufferChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1 },
  bufferText: { fontSize: 10, fontWeight: '900' },
});

