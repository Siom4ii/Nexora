import { Platform } from 'react-native';

const neonWorker = '#00F0FF'; // Cyber Cyan
const neonBusiness = '#39FF14'; // Matrix Green
const midnight = '#050B18'; // Deep Space
const glass = 'rgba(255, 255, 255, 0.08)';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F0F4F8',
    tint: '#0062FF',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0062FF',
    worker: '#0062FF',
    business: '#00C853',
    card: '#FFFFFF',
    border: '#E9ECEF',
    muted: '#6C757D',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5856D6',
    white: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    background: midnight,
    tint: neonWorker,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: neonWorker,
    worker: neonWorker,
    business: neonBusiness,
    card: 'rgba(15, 23, 42, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    muted: '#94A3B8',
    glass: glass,
    success: '#32D74B',
    danger: '#FF453A',
    warning: '#FF9F0A',
    info: '#5E5CE6',
    white: '#FFFFFF',
  },
};

export const Shadows = {
  glow: {
    worker: {
      shadowColor: neonWorker,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 10,
    },
    business: {
      shadowColor: neonBusiness,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 10,
    }
  },
  light: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  medium: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    }),
  },
};
