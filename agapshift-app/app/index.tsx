import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ResponsiveContainer } from '../components/ui/ResponsiveContainer';
import { Colors, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RoleCardProps {
  role: 'WORKER' | 'BUSINESS';
  onPress: (role: 'WORKER' | 'BUSINESS') => void;
  title: string;
  subtitle: string;
  benefits: string[];
  icon: keyof typeof Ionicons.glyphMap;
  badge: string;
  badgeIcon: keyof typeof Ionicons.glyphMap;
  theme: any;
  isDark: boolean;
  delay?: number;
}

function RoleCard({ role, onPress, title, subtitle, benefits, icon, badge, badgeIcon, theme, isDark, delay = 0 }: RoleCardProps) {
  const scale = useSharedValue(1);
  const accentColor = role === 'WORKER' ? theme.worker : theme.business;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).springify()} 
      style={[styles.cardWrapper, animatedStyle]}
    >
      <AnimatedPressable
        onPressIn={() => (scale.value = withSpring(0.98))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => onPress(role)}
        style={[
          styles.roleCard,
          { backgroundColor: theme.white, borderColor: theme.border },
          Shadows.medium
        ]}
      >
        {/* Top Badge */}
        <View style={[styles.badgeContainer, { backgroundColor: accentColor + '15' }]}>
          <Ionicons name={badgeIcon} size={10} color={accentColor} />
          <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
        </View>

        <View style={styles.cardHeader}>
          {/* Left Icon */}
          <View style={[styles.iconContainer, { backgroundColor: accentColor + '10' }]}>
            <Ionicons name={icon} size={28} color={accentColor} />
          </View>

          {/* Center Content */}
          <View style={styles.cardMainContent}>
            <Text style={[styles.roleTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.roleDesc, { color: theme.muted }]}>{subtitle}</Text>
          </View>

          {/* Right Arrow */}
          <Ionicons name="arrow-forward" size={20} color={theme.muted} />
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={[styles.benefitDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.benefitText, { color: theme.text }]}>{benefit}</Text>
            </View>
          ))}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const { width } = useWindowDimensions();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const handleSelectRole = (role: 'WORKER' | 'BUSINESS') => {
    setRole(role);
    router.push('/login');
  };

  const bgGradient = isDark 
    ? [theme.background, '#0A0F1E'] 
    : ['#F8FAFC', '#E2E8F0'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={bgGradient as any}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResponsiveContainer maxWidth={600} style={styles.responsiveInner}>
          <View style={styles.content}>
            {/* Header section with smaller logo and subtitle */}
            <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
              <Image 
                source={require('../assets/images/logo1.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
              <Text style={[styles.mainSubtitle, { color: theme.muted }]}>
                Choose your role to continue
              </Text>
            </Animated.View>

            {/* Role selection cards */}
            <View style={styles.cardsContainer}>
              <RoleCard 
                role="WORKER"
                onPress={handleSelectRole}
                title="Start Working"
                subtitle="Field Operative"
                icon="flash"
                badge="WORKER"
                badgeIcon="person"
                benefits={['Nearby Jobs', 'Instant Payout', 'Secure Transactions']}
                theme={theme}
                isDark={isDark}
                delay={200}
              />

              <RoleCard 
                role="BUSINESS"
                onPress={handleSelectRole}
                title="Start Hiring"
                subtitle="Enterprise Hub"
                icon="business"
                badge="BUSINESS"
                badgeIcon="briefcase"
                benefits={['Trusted Workers', 'Easy Management', 'Flexible Hiring']}
                theme={theme}
                isDark={isDark}
                delay={400}
              />
            </View>

            {/* Footer with updated user-friendly messaging */}
            <Animated.View entering={FadeIn.delay(800)} style={styles.footer}>
              <View style={styles.footerDivider} />
              <View style={styles.footerContent}>
                <Ionicons name="shield-checkmark-outline" size={14} color={theme.success} />
                <Text style={[styles.footerText, { color: theme.muted }]}>
                  Secure and verified transactions for every shift.
                </Text>
              </View>
            </Animated.View>
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  responsiveInner: { flex: 1, justifyContent: 'center' },
  content: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 32,
    marginTop: -20, // Bring higher
  },
  logoImage: { width: 140, height: 140 }, // Reduced logo size
  mainSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: -10,
    textAlign: 'center',
  },
  cardsContainer: { 
    gap: 16,
    width: '100%',
  },
  cardWrapper: { width: '100%' },
  roleCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardMainContent: {
    flex: 1,
  },
  roleTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
  },
  roleDesc: { 
    fontSize: 13, 
    fontWeight: '500', 
    marginTop: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: { 
    marginTop: 40, 
    alignItems: 'center',
  },
  footerDivider: {
    width: 40,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
    borderRadius: 1,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: { 
    fontSize: 12, 
    fontWeight: '500', 
    textAlign: 'center',
  },
});
