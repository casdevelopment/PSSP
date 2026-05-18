import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  const getProfileData = () => {
    switch (role) {
      case 'coordinator':
        return {
          gradient: theme.gradients.purple,
          name: 'Dr. Robert Anderson',
          roleTitle: 'Coordinator',
          subtitle: 'Super Admin',
          email: 'robert.anderson@school.edu',
          phone: '+1 (555) 123-4567',
          thirdLabel: 'Assigned Schools',
          thirdValue: '12 Schools',
          thirdIcon: 'trello', 
          thirdIconBg: '#F3E8FF',
          thirdIconColor: '#6C5CE7',
          showEdit: false,
          showStats: false,
        };
      case 'principal':
        return {
          gradient: theme.gradients.blue,
          name: 'Sarah Johnson',
          roleTitle: 'Principal',
          subtitle: 'Greenwood High School',
          email: 'sarah.johnson@greenwood.edu',
          phone: '+1 (555) 234-5678',
          thirdLabel: 'School',
          thirdValue: 'Greenwood High School',
          thirdIcon: 'trello', 
          thirdIconBg: '#EFF6FF',
          thirdIconColor: '#155DFC',
          showEdit: true,
          showStats: false,
        };
      case 'staff':
      default:
        return {
          gradient: theme.gradients.green,
          name: 'John Smith',
          roleTitle: 'Teacher',
          subtitle: 'Mathematics Department',
          email: 'john.smith@greenwood.edu',
          phone: '+1 (555) 345-6789',
          thirdLabel: 'Subject',
          thirdValue: 'Mathematics',
          thirdIcon: 'book-open',
          thirdIconBg: '#F3E8FF',
          thirdIconColor: '#6C5CE7',
          showEdit: true,
          showStats: true,
        };
    }
  };

  const data = getProfileData();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Profile</Text>

        <LinearGradient
          colors={data.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, theme.shadow.hero]}
        >
          <View style={styles.heroContent}>
            <View style={styles.avatarCircle}>
              <Icon name="user" size={32} color="#FFF" />
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroName}>{data.name}</Text>
              <Text style={styles.heroRole}>{data.roleTitle}</Text>
              <Text style={styles.heroSubtitle}>{data.subtitle}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Contact Information</Text>
            {data.showEdit && (
              <TouchableOpacity>
                <Text style={styles.editLink}>Edit Details</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Icon name="mail" size={20} color="#155DFC" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{data.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Icon name="phone" size={20} color="#10B981" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{data.phone}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, marginBottom: 0 }]}>
            <View style={[styles.iconCircle, { backgroundColor: data.thirdIconBg }]}>
              <Icon name={data.thirdIcon} size={20} color={data.thirdIconColor} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>{data.thirdLabel}</Text>
              <Text style={styles.infoValue}>{data.thirdValue}</Text>
            </View>
          </View>
        </View>

        {data.showStats && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Teaching Stats</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.statValue, { color: '#155DFC' }]}>5</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>142</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.statValue, { color: '#6C5CE7' }]}>98%</Text>
                <Text style={styles.statLabel}>Attendance</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="bell" size={20} color={theme.colors.textBody} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <View style={styles.menuItemRight}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.borderSubtle} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="shield" size={20} color={theme.colors.textBody} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.borderSubtle} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="help-circle" size={20} color={theme.colors.textBody} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.borderSubtle} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Icon name="log-out" size={20} color="#E11D48" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  heroRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  editLink: {
    fontSize: 14,
    color: '#155DFC',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6A7282',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0A0A0A',
  },
  statsCard: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#4A5565',
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A0A0A',
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E11D48',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#E11D48',
  },
});
