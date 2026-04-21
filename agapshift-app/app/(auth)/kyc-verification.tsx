import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DAVAO_DATA } from '../../constants/davaoAddressData';
import * as Haptics from 'expo-haptics';

// Conditionally import DateTimePicker for Native
let DateTimePicker: any;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function KycVerificationScreen() {
  const router = useRouter();
  const { role, verifyKyc } = useAuth();
  
  const bgColor = '#F8FAFC';
  const accentBlue = '#0062FF';
  const mutedText = '#64748B';
  const inputBg = '#FFFFFF';
  const borderColor = '#E2E8F0';

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [dateObj, setDateObj] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Address State
  const [province, setProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [barangay, setBarangay] = useState('');
  
  const [idUploaded, setIdUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFaceCheck, setShowFaceCheck] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  // Validation
  const isFormComplete = 
    fullName.length > 3 &&
    dob !== '' &&
    province !== '' &&
    municipality !== '' &&
    barangay !== '' &&
    idUploaded &&
    agreedToPrivacy;

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      const formatted = `${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getDate().toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setDob(formatted);
      setDateObj(selectedDate);
    }
  };

  const handleWebDateChange = (e: any) => {
    const val = e.target.value; 
    if (val) {
      const [y, m, d] = val.split('-');
      setDob(`${m}/${d}/${y}`);
      setDateObj(new Date(val));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      verifyKyc();
      setLoading(false);
      router.push(role === 'BUSINESS' ? '/(auth)/business-localization' : '/(auth)/worker-profile');
    }, 1500);
  };

  const renderDropdown = (label: string, value: string, setValue: (v: string) => void, data: any[], disabled: boolean) => (
    <View style={[styles.inputGroup, { opacity: disabled ? 0.4 : 1 }]}>
      <Text style={styles.inputLabel}>{label.toUpperCase()}</Text>
      <View style={[
        styles.dropdownContainer, 
        { 
          backgroundColor: inputBg, 
          borderColor: value ? accentBlue : borderColor,
          borderWidth: value ? 2 : 1.5 
        }
      ]}>
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%', height: 50, border: 'none', background: 'transparent',
            padding: '0 15px', fontSize: 15, outline: 'none', appearance: 'none',
            cursor: disabled ? 'default' : 'pointer', color: '#1E293B', fontWeight: '600'
          }}
        >
          <option value="">Select {label}</option>
          {data.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <Ionicons name="chevron-down" size={18} color={value ? accentBlue : mutedText} style={styles.dropdownIcon} />
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.headerTitle}>Identity Verification</Text>
          <Text style={styles.headerSubtitle}>Complete your profile with Davao Region credentials.</Text>
        </Animated.View>

        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: inputBg, 
                borderColor: fullName.length > 3 ? accentBlue : borderColor,
                borderWidth: fullName.length > 3 ? 2 : 1.5 
              }
            ]}>
              <Ionicons name="person" size={18} color={fullName.length > 3 ? accentBlue : mutedText} style={styles.fieldIcon} />
              <TextInput 
                style={styles.textInput}
                placeholder="e.g. Juan Dela Cruz"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Birthdate - Robust Web/Mobile Implementation */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DATE OF BIRTH</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => {
                if (Platform.OS === 'web') {
                  // Web: Logic handled by the hidden input or ref
                } else {
                  setShowDatePicker(true);
                }
              }}
              style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: inputBg, 
                  borderColor: dob ? accentBlue : borderColor,
                  borderWidth: dob ? 2 : 1.5 
                }
              ]}
            >
              <Ionicons name="calendar" size={18} color={dob ? accentBlue : mutedText} style={styles.fieldIcon} />
              
              {Platform.OS === 'web' ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%', position: 'relative' }}>
                  <Text style={[styles.dateText, { color: dob ? '#1E293B' : '#94A3B8' }]}>
                    {dob || 'MM/DD/YYYY'}
                  </Text>
                  <input
                    type="date"
                    style={{
                      position: 'absolute', top: 0, left: -40, right: -100, bottom: 0,
                      opacity: 0, cursor: 'pointer', width: '200%', height: '100%'
                    }}
                    onChange={handleWebDateChange}
                    onClick={(e) => {
                      // Ensure the native picker opens
                      if ('showPicker' in e.currentTarget) {
                        try { (e.currentTarget as any).showPicker(); } catch (err) {}
                      }
                    }}
                  />
                </div>
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dateText, { color: dob ? '#1E293B' : '#94A3B8' }]}>
                    {dob || 'MM/DD/YYYY'}
                  </Text>
                </View>
              )}
              
              <View style={styles.pickerHint}>
                <Text style={[styles.hintText, { color: accentBlue }]}>SELECT</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionDivider}>RESIDENTIAL ADDRESS (REGION XI)</Text>
          
          <View style={[styles.inputGroup, { opacity: 0.8 }]}>
            <Text style={styles.inputLabel}>REGION</Text>
            <View style={[styles.inputWrapper, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
              <Ionicons name="map" size={18} color={mutedText} style={styles.fieldIcon} />
              <Text style={[styles.dateText, { color: '#1E293B' }]}>{DAVAO_DATA.region.name}</Text>
            </View>
          </View>

          {renderDropdown('Province', province, (v) => { setProvince(v); setMunicipality(''); setBarangay(''); }, DAVAO_DATA.provinces, false)}
          {renderDropdown('Municipality', municipality, (v) => { setMunicipality(v); setBarangay(''); }, DAVAO_DATA.municipalities[province as keyof typeof DAVAO_DATA.municipalities] || [], !province)}
          {renderDropdown('Barangay', barangay, (v) => setBarangay(v), DAVAO_DATA.barangays[municipality as keyof typeof DAVAO_DATA.barangays] || [], !municipality)}

          <Text style={styles.sectionDivider}>DOCUMENTATION</Text>
          <TouchableOpacity 
            onPress={() => {
              setIdUploaded(true);
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={[
              styles.uploadZone, 
              { 
                borderColor: idUploaded ? accentBlue : '#CBD5E1', 
                backgroundColor: idUploaded ? '#F0F7FF' : '#F8FAFC',
                borderWidth: 2 
              }
            ]}
          >
            <Ionicons name={idUploaded ? "checkmark-circle" : "cloud-upload"} size={32} color={idUploaded ? accentBlue : '#94A3B8'} />
            <Text style={[styles.uploadTitle, { color: idUploaded ? accentBlue : '#1E293B' }]}>
              {idUploaded ? 'ID CAPTURED SUCCESSFULLY' : 'UPLOAD GOVERNMENT ID'}
            </Text>
            <Text style={styles.uploadSub}>Tap to open camera or select file</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: agreedToPrivacy ? accentBlue : '#CBD5E1', backgroundColor: agreedToPrivacy ? accentBlue : 'transparent' }]}>
              {agreedToPrivacy && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I authorize AgapShift to process my personal data and identity documents for verification in accordance with the <Text onPress={() => router.push('/privacy')} style={{ color: accentBlue, fontWeight: '800', textDecorationLine: 'underline' }}>Data Privacy Act of 2012</Text> and AgapShift's <Text onPress={() => router.push('/terms')} style={{ color: accentBlue, fontWeight: '800', textDecorationLine: 'underline' }}>Terms</Text>.
            </Text>
          </TouchableOpacity>

          <ModernButton 
            title="START FACE CHECK" 
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setShowFaceCheck(true);
            }}
            disabled={!isFormComplete}
            style={{ marginTop: 24, backgroundColor: isFormComplete ? accentBlue : '#CBD5E1', borderRadius: 14 }}
            textStyle={{ letterSpacing: 1, fontWeight: '800' }}
          />
          
          {!isFormComplete && (
            <View style={styles.errorRow}>
              <Ionicons name="information-circle" size={14} color="#EF4444" />
              <Text style={styles.errorNote}>Required: Name, DOB, Address, and ID Scan.</Text>
            </View>
          )}
        </View>
      </View>

      <Modal visible={showFaceCheck} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.faceCheckContainer}>
            <Text style={styles.modalTitle}>Liveness Check</Text>
            <Text style={styles.modalSub}>Position your face within the circle and blink slowly.</Text>
            <View style={[styles.cameraCircle, { borderColor: accentBlue }]}>
              <View style={[styles.cameraDot, { backgroundColor: accentBlue }]} />
            </View>
            <ModernButton 
              title="CAPTURE & SUBMIT" 
              onPress={() => { setShowFaceCheck(false); handleSubmit(); }}
              style={{ width: '80%', marginTop: 40, backgroundColor: accentBlue, borderRadius: 14 }}
            />
            <TouchableOpacity onPress={() => setShowFaceCheck(false)} style={styles.cancelBtn}>
              <Text style={{ color: mutedText, fontWeight: '700', letterSpacing: 0.5 }}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#1E293B', marginBottom: 8, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 16, color: '#64748B', lineHeight: 24, marginBottom: 40 },
  formSection: { gap: 24 },
  inputGroup: { width: '100%' },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', marginBottom: 8, letterSpacing: 1.5 },
  inputWrapper: {
    height: 60,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    ...Shadows.light
  },
  fieldIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  dateText: { fontSize: 16, fontWeight: '600' },
  pickerHint: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  hintText: { fontSize: 10, fontWeight: '900' },
  sectionDivider: { fontSize: 11, fontWeight: '900', color: '#94A3B8', marginTop: 16, marginBottom: -8, letterSpacing: 2 },
  dropdownContainer: {
    height: 60,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    ...Shadows.light
  },
  dropdownIcon: { position: 'absolute', right: 16, pointerEvents: 'none' },
  uploadZone: {
    height: 150,
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
    ...Shadows.light
  },
  uploadTitle: { fontSize: 14, fontWeight: '900', marginTop: 16, letterSpacing: 1 },
  uploadSub: { fontSize: 13, color: '#64748B', marginTop: 6, fontWeight: '500' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxLabel: { flex: 1, fontSize: 12, lineHeight: 18, color: '#475569', fontWeight: '600' },
  errorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  errorNote: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center' },
  faceCheckContainer: { 
    width: '90%', height: '75%', backgroundColor: '#fff', borderRadius: 40, 
    alignItems: 'center', padding: 32, justifyContent: 'center' 
  },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  modalSub: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 12, marginBottom: 48, lineHeight: 22 },
  cameraCircle: { width: 280, height: 280, borderRadius: 140, borderWidth: 4, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  cameraDot: { position: 'absolute', top: 20, width: 12, height: 12, borderRadius: 6 },
  cancelBtn: { marginTop: 24, padding: 12 }
});
