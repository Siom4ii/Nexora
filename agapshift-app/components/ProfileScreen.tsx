import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadows } from '../constants/theme';
import { ModernButton } from './ui/ModernButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { role, logout, isKycVerified } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const accentColor = role === 'WORKER' ? theme.worker : theme.business;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: accentColor + '20' }]}>
            <Ionicons name="person" size={60} color={accentColor} />
            {isKycVerified && (
              <View style={[styles.verifiedBadge, { backgroundColor: theme.business }]}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {role === 'WORKER' ? 'Juan Dela Cruz' : 'AgapShift Partner'}
          </Text>
          <Text style={[styles.userRole, { color: theme.muted }]}>
            {role === 'WORKER' ? 'Verified Worker' : 'Business Owner'}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {role === 'BUSINESS' ? 'Enterprise Management' : 'Account Settings'}
          </Text>
          
          {role === 'BUSINESS' && (
            <>
              <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }, Shadows.light]}>
                <View style={[styles.iconBox, { backgroundColor: theme.business + '15' }]}>
                  <Ionicons name="analytics-outline" size={22} color={theme.business} />
                </View>
                <Text style={[styles.menuText, { color: theme.text }]}>Expense Reports</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.border} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }, Shadows.light]}>
                <View style={[styles.iconBox, { backgroundColor: theme.business + '15' }]}>
                  <Ionicons name="card-outline" size={22} color={theme.business} />
                </View>
                <Text style={[styles.menuText, { color: theme.text }]}>Escrow Bank Details</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.border} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }, Shadows.light]}>
            <View style={[styles.iconBox, { backgroundColor: theme.worker + '15' }]}>
              <Ionicons name="document-text-outline" size={22} color={theme.worker} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>
              {role === 'BUSINESS' ? 'Update KYC Documents' : 'Personal Information'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.border} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }, Shadows.light]}>
            <View style={[styles.iconBox, { backgroundColor: '#FF950015' }]}>
              <Ionicons name="notifications-outline" size={22} color="#FF9500" />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.border} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }, Shadows.light]}>
            <View style={[styles.iconBox, { backgroundColor: '#5856D615' }]}>
              <Ionicons name="help-circle-outline" size={22} color="#5856D6" />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.border} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.logoutSection}>
          <ModernButton 
            title="Log Out" 
            onPress={handleLogout} 
            style={styles.logoutButton}
            variant="default"
          />
          <Text style={[styles.versionText, { color: theme.muted }]}>Version 1.0.0</Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FF3B30',
  },
  versionText: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: '500',
  },
});
