import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadows } from '../constants/theme';
import { ModernButton } from '../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ResponsiveContainer } from '../components/ui/ResponsiveContainer';

export default function LoginScreen() {
  const router = useRouter();
  const { role, verifySim } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const otpInputs = useRef<Array<TextInput | null>>([]);

  const accentColor = role === 'BUSINESS' ? theme.business : theme.worker;

  const handleSendOtp = () => {
    // PH Format check: must start with 9 and be exactly 10 digits
    if (mobileNumber.length === 10 && mobileNumber.startsWith('9')) {
      setOtpSent(true);
      setError(null);
    } else {
      setError('Invalid Format: Enter a 10-digit number starting with 9');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '' && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    setError(null);

    if (numericValue !== '' && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleMobileChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setMobileNumber(numericValue);
    if (error) setError(null);
  };

  const handleConfirm = () => {
    if (otp.every(digit => digit !== '')) {
      verifySim();
      if (role === 'BUSINESS') {
        router.push('/(auth)/business-registration');
      } else {
        router.push('/(auth)/kyc-verification');
      }
    } else {
      setError('Please enter the full 6-digit code');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ResponsiveContainer maxWidth={500}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(800)}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>
              {otpSent ? 'Confirm Identity' : 'Mobile Security'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              {otpSent 
                ? `A 6-digit code was sent to +63 ${mobileNumber}. Type it in to become SIM-verified.` 
                : 'Enter your Business Mobile Number to generate a secure OTP.'}
            </Text>
          </Animated.View>

          {!otpSent ? (
            <Animated.View entering={FadeInUp.delay(200).duration(800)}>
              <View style={[
                styles.inputContainer, 
                { backgroundColor: theme.card, borderColor: error ? theme.danger : 'transparent', borderWidth: error ? 2 : 0 }, 
                Shadows.light
              ]}>
                <Text style={[styles.prefix, { color: theme.text }]}>+63</Text>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="917 123 4567"
                  placeholderTextColor={theme.muted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={handleMobileChange}
                  autoFocus
                />
              </View>
              {error && <Text style={[styles.errorMessage, { color: theme.danger }]}>{error}</Text>}
              <ModernButton 
                title="Generate OTP" 
                onPress={handleSendOtp}
                disabled={mobileNumber.length < 10}
                variant={role === 'BUSINESS' ? 'business' : 'worker'}
                style={styles.button}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.delay(200).duration(800)}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref: TextInput | null) => { otpInputs.current[index] = ref; }}
                    style={[
                      styles.otpInput, 
                      { 
                        backgroundColor: theme.card, 
                        color: theme.text,
                        borderColor: error ? theme.danger : (digit ? accentColor : theme.border)
                      },
                      Shadows.light
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                        otpInputs.current[index - 1]?.focus();
                      }
                    }}
                  />
                ))}
              </View>
              {error && <Text style={[styles.errorMessage, { color: theme.danger, textAlign: 'center', marginBottom: 20 }]}>{error}</Text>}
              <ModernButton 
                title="Confirm" 
                onPress={handleConfirm}
                style={styles.button}
                variant={role === 'BUSINESS' ? 'business' : 'worker'}
              />
              <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.resendButton}>
                <Text style={[styles.resendText, { color: accentColor }]}>Resend Code</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.privacyFooter}>
            <Text style={[styles.privacyText, { color: theme.muted }]}>
              By proceeding, you agree to AgapShift&apos;s{' '}
              <Text onPress={() => router.push('/terms')} style={[styles.linkText, { color: accentColor }]}>Terms of Service</Text> and{' '}
              <Text onPress={() => router.push('/privacy')} style={[styles.linkText, { color: accentColor }]}>Data Privacy Policy</Text>. We use your data to verify your identity and ensure platform security.
            </Text>
          </View>
        </View>
      </ResponsiveContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 48,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 24,
  },
  prefix: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
  },
  errorMessage: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: -16,
    marginBottom: 16,
    marginLeft: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
  resendButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    fontWeight: '700',
  },
  privacyFooter: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  privacyText: {
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: '800',
  },
});
