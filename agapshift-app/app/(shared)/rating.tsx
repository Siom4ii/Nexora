import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ModernButton } from '../../components/ui/ModernButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RatingScreen() {
  const { role } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const targetName = role === 'WORKER' ? 'BUSINESS ENTITY' : 'FIELD UNIT';
  const accentColor = role === 'WORKER' ? theme.worker : theme.business;

  const handleSubmit = () => {
    console.log(`Rating submitted for ${targetName}: ${rating} Stars. Feedback: ${feedback}`);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>TRANSACTION FEEDBACK</Text>
      </View>

      <Animated.View entering={FadeInDown.duration(800)} style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>RATE {targetName}</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>EVALUATING PERFORMANCE METRICS</Text>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={44} 
                color={star <= rating ? accentColor : theme.border} 
                style={star <= rating && isDark ? { shadowColor: accentColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 } : {}}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, { color: accentColor }]}>COMMENTS LOG</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="INPUT FEEDBACK DATA..."
            placeholderTextColor={theme.muted}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>
        
        <ModernButton 
          title="TRANSMIT REPORT" 
          onPress={handleSubmit}
          variant={role === 'WORKER' ? 'worker' : 'business'}
          style={styles.submitBtn}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 100, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 40 
  },
  closeBtn: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginRight: 44 },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 12, fontWeight: '700', marginBottom: 40, letterSpacing: 1 },
  starsContainer: { flexDirection: 'row', gap: 12, marginBottom: 48 },
  inputWrapper: { width: '100%', marginBottom: 40 },
  label: { fontSize: 10, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  input: { 
    width: '100%', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 20, 
    height: 120, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  submitBtn: { width: '100%' }
});
