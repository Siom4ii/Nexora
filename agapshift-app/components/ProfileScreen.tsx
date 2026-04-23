import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { role, logout } = useAuth();
  const isWorker = role === 'WORKER';
  const accentColor = isWorker ? theme.worker : theme.business;

  const menuItems = [
    { icon: 'person-outline', label: 'Personal Information', sub: 'Verified' },
    { icon: 'shield-checkmark-outline', label: 'Security & Privacy', sub: 'SIM Linked' },
    { icon: 'notifications-outline', label: 'Notifications', sub: 'All Alerts On', badge: true, badgeColor: theme.warning },
    { icon: 'help-circle-outline', label: 'Support Center', sub: '24/7 Assistance', badgeColor: theme.info },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View entering={FadeInDown.duration(800)} style={[styles.header, { backgroundColor: theme.card }, Shadows.medium]}>
        <View style={[styles.avatarContainer, { borderColor: accentColor }]}>
          <Ionicons name="person" size={50} color={accentColor} />
          <View style={[styles.verifiedBadge, { backgroundColor: theme.success }]}>
            <Ionicons name="checkmark" size={12} color={theme.white} />
          </View>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>JUAN DELA CRUZ</Text>
        <Text style={[styles.role, { color: theme.muted }]}>{role} • DAVAO DEL SUR</Text>
      </Animated.View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} style={[styles.menuItem, { backgroundColor: theme.card, borderColor: theme.border }, Shadows.light]}>
            <View style={[styles.iconBox, { backgroundColor: (item.badgeColor || accentColor) + '15' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.badgeColor || accentColor} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.menuSub, { color: theme.muted }]}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.muted} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          onPress={logout}
          style={[styles.logoutBtn, { borderColor: theme.danger }]}
        >
          <Text style={[styles.logoutText, { color: theme.danger }]}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  header: { padding: 40, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 24 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 16 },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  name: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  role: { fontSize: 12, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
  menuContainer: { padding: 20, gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '700' },
  menuSub: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  logoutBtn: { marginTop: 20, padding: 18, borderRadius: 16, borderWidth: 1.5, alignItems: 'center' },
  logoutText: { fontSize: 12, fontWeight: '900', letterSpacing: 2 }
});
