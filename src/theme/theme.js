export const theme = {
  colors: {
    appBackground: '#F9FAFB',
    backgroundLight: '#FAFAFA', 
    surfaceSubtle: '#F3F4F6',
    borderSubtle: '#E5E7EB',
    purpleSurface: '#FAF5FF',
    blueSurface: '#EFF6FF',
    greenSurface: '#ECFDF5',
    
    // Text Colors
    textHeading: '#101828',
    textStrong: '#0A0A0A',
    textBody: '#4A5565',
    textMuted: '#6A7282',
    textMutedAlt: '#6B7280', 
    textOnDarkMuted: '#DBEAFE',
    
    // Core Colors
    linkPrimary: '#155DFC',
    bluePrimary: '#2B7FFF', 
    white: '#FFFFFF',
    white90: 'rgba(255, 255, 255, 0.9)', // Added opacity variant
    white80: 'rgba(255, 255, 255, 0.8)', // Added opacity variant
    black: '#000000',
    purple: '#6C5CE7',
    accentPurple: '#8B5CF6', 
    purpleSubtle: '#F3E8FF', 
    
    // Status Colors 
    success: '#10B981',
    successStrong: '#16A34A',
    successSubtle: '#ECFDF5',
    
    danger: '#E11D48',
    dangerStrong: '#DC2626',
    dangerSubtle: '#FEF2F2',
    
    warning: '#EA580C',
    warningSubtle: '#FFF7ED',

    approvalCardBg: '#FFF7ED',
    pendingChipBg: '#FFEDD4',
    pendingChipText: '#CA3500',
    tabActive: '#155DFC',
    tabInactive: '#6A7282',

    // Compatibility aliases
    background: '#F9FAFB',
    surface: '#FFFFFF',
    cardSurface: '#F9FAFB',
    border: '#E5E7EB',
    heading: '#101828',
    textPrimary: '#101828',
    textSecondary: '#4A5565',
    link: '#155DFC',
  },
  spacing: {
    xxs: 6,
    xs: 10,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    pill: 999,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: '#0A0A0A',
      lineHeight: 28,
      fontFamily: 'Outfit',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: '#101828',
      lineHeight: 30,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      color: '#101828',
      lineHeight: 32,
    },
    itemTitle: {
      fontSize: 20,
      fontWeight: '500',
      color: '#101828',
      lineHeight: 24,
    },
    body: {
      fontSize: 18,
      fontWeight: '500',
      color: '#101828',
      lineHeight: 24,
    },
    caption: {
      fontSize: 18,
      fontWeight: '400',
      color: '#6A7282',
      lineHeight: 20,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
  },
  iconSize: {
    sm: 14,
    md: 16,
  },
  dimensions: {
    statIconBox: 42,
    tabBarHeight: 74,
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    hero: {
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
  },
  gradients: {
    orange: [
      '#FFC107',
      '#FFA000',
    ],
    darkOrange: [
      '#FF6900',
      '#F54900'
    ],
    purple: [
      '#6C5CE7',
      '#6354D9',
      '#5849C7',
    ],
    green: [
      '#10B981',
      '#059669',
    ],
    blue: [
      '#2B7FFF',
      '#155DFC'
    ],
    button: [
      '#155DFC',
      '#9810FA',
    ],
  },
};