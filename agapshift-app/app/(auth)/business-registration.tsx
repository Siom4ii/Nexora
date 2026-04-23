import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Image } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type RegType = 'SOLE_PROP' | 'PARTNERSHIP' | 'CORPORATION' | null;

export default function BusinessRegistrationScreen() {
  const router = useRouter();
  const { updateBusinessData } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const [regType, setRegType] = useState<RegType>(null);
  const [formData, setFormData] = useState<any>({});
  const [docs, setDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectType = (type: RegType) => {
    setRegType(type);
    setFormData({});
    setDocs([]);
    setError(null);
  };

  const handleInputChange = (key: string, value: string) => {
    let validatedValue = value;
    if (key === 'tin') {
      validatedValue = value.replace(/[^0-9]/g, '').slice(0, 12);
      if (validatedValue.length > 0 && validatedValue.length < 9) {
        setError('TIN must be at least 9 digits');
      } else {
        setError(null);
      }
    }
    setFormData({ ...formData, [key]: validatedValue });
  };

  const validateForm = (fields: any[], requiredDocs: string[]) => {
    const allFieldsFilled = fields.every(f => formData[f.key] && formData[f.key].trim().length > 0);
    const docsUploaded = docs.length >= requiredDocs.length;
    const tinValid = formData.tin ? formData.tin.length >= 9 : true;
    return allFieldsFilled && docsUploaded && tinValid;
  };

  const handleUpload = (docName: string) => {
    if (!docs.includes(docName)) {
      setDocs([...docs, docName]);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      updateBusinessData({ type: regType as any });
      setLoading(false);
      router.push('/(auth)/kyc-verification');
    }, 1500);
  };

  const renderTypeSelection = () => (
    <Animated.View entering={FadeInDown} style={styles.selectionContainer}>
      <Text style={[styles.title, { color: theme.text }]}>How is your business registered?</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>Select the legal structure of your entity.</Text>
      
      <View style={styles.cardGrid}>
        <TouchableOpacity 
          style={[styles.typeCard, { backgroundColor: theme.card }, Shadows.medium]}
          onPress={() => handleSelectType('SOLE_PROP')}
        >
          <Ionicons name="person-outline" size={32} color={theme.business} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Sole Proprietorship</Text>
          <Text style={[styles.cardDesc, { color: theme.muted }]}>Solo Business</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeCard, { backgroundColor: theme.card }, Shadows.medium]}
          onPress={() => handleSelectType('PARTNERSHIP')}
        >
          <Ionicons name="people-outline" size={32} color={theme.business} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Partnership</Text>
          <Text style={[styles.cardDesc, { color: theme.muted }]}>Shared Ownership</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeCard, { backgroundColor: theme.card }, Shadows.medium]}
          onPress={() => handleSelectType('CORPORATION')}
        >
          <Ionicons name="business-outline" size={32} color={theme.business} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>Corporation</Text>
          <Text style={[styles.cardDesc, { color: theme.muted }]}>Registered SEC Entity</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderForm = () => {
    let title = "";
    let fields: { key: string, label: string, icon: string, keyboard?: string }[] = [];
    let requiredDocs: string[] = [];

    if (regType === 'SOLE_PROP') {
      title = "Sole Proprietorship Setup";
      fields = [
        { key: 'ownerName', label: "Owner's Legal Name", icon: 'person' },
        { key: 'tradeName', label: "Business Trade Name", icon: 'briefcase' },
        { key: 'tin', label: "TIN", icon: 'card', keyboard: 'number-pad' }
      ];
      requiredDocs = ['DTI Certificate', "Mayor's Permit"];
    } else if (regType === 'PARTNERSHIP') {
      title = "Partnership Setup";
      fields = [
        { key: 'partnerName', label: "Managing Partner Name", icon: 'people' },
        { key: 'partnershipName', label: "Registered Partnership Name", icon: 'business' }
      ];
      requiredDocs = ['Articles of Partnership', "Mayor's Permit"];
    } else if (regType === 'CORPORATION') {
      title = "Corporation Setup";
      fields = [
        { key: 'secNum', label: "SEC Registration Number", icon: 'id-card' },
        { key: 'corpName', label: "Corporate Name", icon: 'business' },
        { key: 'repTitle', label: "Authorized Representative Title", icon: 'ribbon' }
      ];
      requiredDocs = ['SEC Certificate of Incorporation', "Mayor's Permit", "Secretary's Certificate"];
    }

    return (
      <Animated.View entering={FadeInRight} style={styles.formContainer}>
        <TouchableOpacity onPress={() => setRegType(null)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
          <Text style={{ color: theme.text, marginLeft: 8, fontWeight: '600' }}>Change Type</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Please provide the following legal details.</Text>

        <View style={styles.fieldsContainer}>
          {fields.map(f => (
            <View key={f.key}>
              <View style={[
                styles.inputGroup, 
                { 
                  backgroundColor: theme.card,
                  borderColor: (f.key === 'tin' && error) ? theme.danger : 'transparent',
                  borderWidth: (f.key === 'tin' && error) ? 2 : 0
                }, 
                Shadows.light
              ]}>
                <Ionicons name={f.icon as any} size={20} color={theme.muted} style={{ marginRight: 12 }} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={f.label}
                  placeholderTextColor={theme.muted}
                  keyboardType={(f.keyboard as any) || 'default'}
                  value={formData[f.key]}
                  onChangeText={(v) => handleInputChange(f.key, v)}
                  maxLength={f.key === 'tin' ? 12 : 100}
                />
              </View>
              {f.key === 'tin' && error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.business }]}>DOCUMENT UPLOADS</Text>
        <View style={styles.docsContainer}>
          {requiredDocs.map(doc => {
            const isUploaded = docs.includes(doc);
            return (
              <TouchableOpacity 
                key={doc}
                style={[
                  styles.docBtn, 
                  { backgroundColor: isUploaded ? theme.business + '10' : theme.card, borderColor: isUploaded ? theme.business : theme.border },
                  Shadows.light
                ]}
                onPress={() => handleUpload(doc)}
              >
                <Ionicons 
                  name={isUploaded ? "checkmark-circle" : "cloud-upload-outline"} 
                  size={24} 
                  color={isUploaded ? theme.business : theme.muted} 
                />
                <Text style={[styles.docBtnText, { color: isUploaded ? theme.business : theme.text }]}>
                  {isUploaded ? `${doc} Captured` : `Upload ${doc}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ModernButton 
          title="Submit for Verification" 
          onPress={handleSubmit}
          loading={loading}
          disabled={!validateForm(fields, requiredDocs)}
          variant="business"
          style={{ 
            marginTop: 40, 
            marginBottom: 24,
            backgroundColor: validateForm(fields, requiredDocs) ? theme.business : theme.border
          }}
        />

        <View style={styles.privacyFooter}>
          <Text style={[styles.privacyText, { color: theme.muted }]}>
            By submitting, you agree that AgapShift will process your business data in accordance with our{' '}
            <Text onPress={() => router.push('/privacy')} style={styles.linkText}>Privacy Policy</Text> and{' '}
            <Text onPress={() => router.push('/terms')} style={styles.linkText}>Terms of Service</Text>.
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {!regType ? renderTypeSelection() : renderForm()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 32 },
  selectionContainer: { flex: 1 },
  cardGrid: { gap: 16 },
  typeCard: { padding: 24, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  cardTitle: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  cardDesc: { fontSize: 13, marginTop: 4 },
  formContainer: { flex: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  fieldsContainer: { gap: 16, marginBottom: 32 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16 },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  errorText: { color: '#FF3B30', fontSize: 10, fontWeight: '700', marginTop: 8, marginLeft: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, marginTop: 8 },
  docsContainer: { gap: 12 },
  docBtn: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1.5, gap: 12 },
  docBtnText: { fontSize: 14, fontWeight: '700' },
  privacyFooter: { marginTop: 10, paddingBottom: 40 },
  privacyText: { fontSize: 11, lineHeight: 18, textAlign: 'center', fontWeight: '600' },
  linkText: { textDecorationLine: 'underline', fontWeight: '800' },
});
