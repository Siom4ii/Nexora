import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { ModernButton } from '../../components/ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const SKILLS = ['Service Crew', 'Delivery', 'Encoding', 'Dishwashing', 'Event Staff', 'Barista', 'Sales Assistant', 'Others'];

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { updateWorkerData } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [bio, setBio] = useState('');
  const [emergency, setEmergency] = useState({ name: '', number: '' });
  const [emergencyError, setEmergencyError] = useState<string | null>(null);

  const handleEmergencyNameChange = (v: string) => {
    const validated = v.replace(/[^a-zA-Z\s]/g, '');
    setEmergency({ ...emergency, name: validated });
    if (emergencyError) setEmergencyError(null);
  };

  const handleEmergencyNumberChange = (v: string) => {
    const validated = v.replace(/[^0-9]/g, '').slice(0, 10);
    setEmergency({ ...emergency, number: validated });
    if (emergencyError) setEmergencyError(null);
  };

  const toggleSkill = (skill: string) => {
    if (skill === 'Others') {
      setShowCustomInput(true);
      return;
    }

    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else if (selectedSkills.length < 10) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleComplete = () => {
    if (emergency.number.length > 0 && (emergency.number.length !== 10 || !emergency.number.startsWith('9'))) {
      setEmergencyError('Enter a valid 10-digit PH number starting with 9');
      return;
    }
    updateWorkerData({ skills: selectedSkills, bio, emergencyContact: emergency });
    router.push('/(auth)/financial-setup');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(800)}>
          <Text style={[styles.title, { color: theme.text }]}>DIGITAL RESUME</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>MAPPING CORE COMPETENCIES</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.worker }]}>SKILL TAGS (SELECT 3-5)</Text>
          <View style={styles.skillsContainer}>
            {SKILLS.filter(s => s !== 'Others').map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <TouchableOpacity 
                  key={skill}
                  onPress={() => toggleSkill(skill)}
                  style={[
                    styles.skillChip, 
                    { 
                      backgroundColor: isSelected ? theme.worker + '20' : 'transparent',
                      borderColor: isSelected ? theme.worker : theme.border 
                    }
                  ]}
                >
                  <Text style={[styles.skillText, { color: isSelected ? theme.worker : theme.muted }]}>
                    {skill.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            {/* Display custom skills that are not in the main list */}
            {selectedSkills.filter(s => !SKILLS.includes(s)).map(skill => (
              <TouchableOpacity 
                key={skill}
                onPress={() => toggleSkill(skill)}
                style={[
                  styles.skillChip, 
                  { 
                    backgroundColor: theme.worker + '20',
                    borderColor: theme.worker 
                  }
                ]}
              >
                <Text style={[styles.skillText, { color: theme.worker }]}>
                  {skill.toUpperCase()}
                </Text>
                <Ionicons name="close-circle" size={14} color={theme.worker} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              onPress={() => toggleSkill('Others')}
              style={[
                styles.skillChip, 
                { 
                  backgroundColor: 'transparent',
                  borderColor: theme.border,
                  borderStyle: 'dashed'
                }
              ]}
            >
              <Text style={[styles.skillText, { color: theme.muted }]}>+ OTHERS</Text>
            </TouchableOpacity>
          </View>

          {showCustomInput && (
            <Animated.View entering={FadeInRight} style={styles.customInputContainer}>
              <TextInput 
                style={[styles.cyberInput, { flex: 1, borderBottomWidth: 2, borderColor: theme.worker }]}
                placeholder="SPECIFY CUSTOM SKILL..."
                placeholderTextColor={theme.muted}
                value={customSkill}
                onChangeText={setCustomSkill}
                autoFocus
                onSubmitEditing={addCustomSkill}
              />
              <TouchableOpacity onPress={addCustomSkill} style={[styles.addBtn, { backgroundColor: theme.worker }]}>
                <Ionicons name="add" size={24} color={theme.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowCustomInput(false)} style={{ padding: 10 }}>
                <Ionicons name="close" size={24} color={theme.muted} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.worker }]}>PROFESSIONAL BIO</Text>
          <TextInput 
            style={[styles.cyberInput, { color: theme.text, borderColor: theme.border, height: 100 }]}
            placeholder="DESCRIBE YOUR WORK ETHIC..."
            placeholderTextColor={theme.muted}
            multiline
            value={bio}
            onChangeText={setBio}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.worker }]}>EMERGENCY CONTACT</Text>
          <TextInput 
            style={[styles.cyberInput, { color: theme.text, borderColor: theme.border }]}
            placeholder="CONTACT NAME"
            placeholderTextColor={theme.muted}
            value={emergency.name}
            onChangeText={handleEmergencyNameChange}
          />
          <TextInput 
            style={[
              styles.cyberInput, 
              { 
                color: theme.text, 
                borderColor: emergencyError ? theme.danger : theme.border, 
                marginTop: 12,
                borderBottomWidth: emergencyError ? 2 : 1
              }
            ]}
            placeholder="CONTACT NUMBER (E.G. 917 123 4567)"
            placeholderTextColor={theme.muted}
            keyboardType="phone-pad"
            maxLength={10}
            value={emergency.number}
            onChangeText={handleEmergencyNumberChange}
          />
          {emergencyError && <Text style={{ color: theme.danger, fontSize: 10, fontWeight: '700', marginTop: 8 }}>{emergencyError}</Text>}
        </View>

        <ModernButton 
          title="COMPLETE PROFILE" 
          onPress={handleComplete}
          variant="worker"
          disabled={selectedSkills.length < 3}
          style={{ marginTop: 40, marginBottom: 60 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  subtitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 40 },
  section: { marginBottom: 32 },
  label: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 16 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1 },
  skillText: { fontSize: 12, fontWeight: '800' },
  cyberInput: { padding: 18, borderBottomWidth: 1, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  customInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 12 },
  addBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});
