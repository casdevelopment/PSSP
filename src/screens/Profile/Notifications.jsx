import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

// Dummy Data exactly mapping to image
const NOTIFICATIONS_DATA = [
  { id: '1', title: 'Salary Payment Due', desc: 'Salary payment for Maple Valley School is due on Apr 30', time: '2 hours ago', unread: true, type: 'salary' },
  { id: '2', title: 'New Expense Request', desc: 'Greenwood High requested $2,400 for lab equipment', time: '5 hours ago', unread: true, type: 'expense' },
  { id: '3', title: 'Leave Request Pending', desc: 'John Smith from Riverside Academy requested 3 days leave', time: '1 day ago', unread: false, type: 'leave' },
  { id: '4', title: 'Monthly Report Available', desc: 'April monthly report is ready for review', time: '2 days ago', unread: false, type: 'report' },
  { id: '5', title: 'Salary Distributed', desc: 'Successfully distributed salary to Greenwood High School', time: '3 days ago', unread: false, type: 'salary_done' },
  { id: '6', title: 'Distributed', desc: 'Successfully distributed salary to Greenwood High School', time: '3 days ago', unread: false, type: 'salary_done' },
];

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.userType);

  // Dynamic header based on role
  const getHeaderGradient = () => {
    if (role === 'coordinator') return theme.gradients.purple;
    if (role === 'staff') return theme.gradients.green;
    return theme.gradients.blue;
  };

  const getIconProps = (type) => {
    switch (type) {
      case 'salary': return { name: 'dollar-sign', color: theme.colors.successStrong, bg: theme.colors.successSubtle };
      case 'salary_done': return { name: 'dollar-sign', color: theme.colors.successStrong, bg: theme.colors.successSubtle };
      case 'expense': return { name: 'file-text', color: '#EA580C', bg: '#FFF7ED' }; // Custom orange from theme
      case 'leave': return { name: 'calendar', color: theme.colors.linkPrimary, bg: theme.colors.blueSurface };
      case 'report': return { name: 'alert-circle', color: theme.colors.accentPurple, bg: theme.colors.purpleSubtle };
      default: return { name: 'bell', color: theme.colors.textMuted, bg: theme.colors.surfaceSubtle };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dynamic Header */}
      <LinearGradient
        colors={getHeaderGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBg, { paddingTop: insets.top + theme.spacing.md }]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerTitlesContainer}>
          <View style={styles.iconCircleHero}>
            <Icon name="bell" size={24} color={theme.colors.white} />
          </View>
          <View style={styles.titleTextGroup}>
            <Text style={styles.pageTitle}>Notifications</Text>
            <Text style={styles.pageSubtitle}>2 unread</Text>
          </View>
        </View>
      </LinearGradient>

      {/* List Area */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS_DATA.map((notif) => {
          const iconConfig = getIconProps(notif.type);

          return (
            <TouchableOpacity key={notif.id} style={styles.notifCard} activeOpacity={0.7}>
              {/* Unread Dot Indicator */}
              {notif.unread && <View style={styles.unreadDot} />}

              <View style={styles.notifContent}>
                <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
                  <Icon name={iconConfig.name} size={18} color={iconConfig.color} />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifDesc}>{notif.desc}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  headerBg: {
    paddingBottom: 40,
    zIndex: 0,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  headerTitlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  iconCircleHero: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  titleTextGroup: {
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 15,
    color: theme.colors.white90,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    marginTop: -20, // Negative overlap matching the design
    paddingBottom: theme.spacing.xxl,
    marginBottom: 20,
    zIndex: 2,
  },
  notifCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  notifContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.linkPrimary,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16, // Avoid text colliding with unread dot
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 6,
  },
  notifDesc: {
    fontSize: 14,
    color: theme.colors.textBody,
    lineHeight: 20,
    marginBottom: 8,
  },
  notifTime: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});