import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const email = useAuthStore((state) => state.email);
  const phoneNo = useAuthStore((state) => state.phoneNo);
  const userType = useAuthStore((state) => state.userType);
  const image = useAuthStore((state) => state.image);
  const schoolCount = useAuthStore((state) => state.schoolCount);
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation();
  console.log(image, 'image')


  const getProfileData = () => {
    const displayName = user?.name || user?.userName || 'User Name';
    const displayEmail = email || user?.email || 'N/A';
    const displayPhone = phoneNo || user?.phoneNo || 'N/A';
    const displayUserType = userType || user?.userType || 'User';

    switch (role) {
      case 'coordinator':
        return {
          gradient: theme.gradients.purple,
          name: displayName,
          roleTitle: displayUserType,
          subtitle: 'Super Admin',
          email: displayEmail,
          phone: displayPhone,
          thirdLabel: 'Assigned Schools',
          thirdValue: schoolCount ? `${schoolCount} Schools` : 'N/A',
          thirdIcon: 'trello',
          thirdIconBg: theme.colors.purpleSubtle,
          thirdIconColor: theme.colors.purple,
          showEdit: false,
          showStats: false,
        };
      case 'principal':
        return {
          gradient: theme.gradients.blue,
          name: displayName,
          roleTitle: displayUserType,
          subtitle: user?.schoolName || 'Greenwood High School',
          email: displayEmail,
          phone: displayPhone,
          thirdLabel: 'School',
          thirdValue: user?.schoolName || 'Greenwood High School',
          thirdIcon: 'trello',
          thirdIconBg: theme.colors.blueSurface,
          thirdIconColor: theme.colors.linkPrimary,
          showEdit: true,
          showStats: false,
        };
      case 'staff':
      default:
        return {
          gradient: theme.gradients.green,
          name: displayName,
          roleTitle: displayUserType || 'Teacher',
          subtitle: 'Mathematics Department',
          email: displayEmail,
          phone: displayPhone,
          thirdLabel: 'Subject',
          thirdValue: 'Mathematics',
          thirdIcon: 'book-open',
          thirdIconBg: theme.colors.purpleSubtle,
          thirdIconColor: theme.colors.purple,
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
        /* FIXED: Amplified bottom padding buffer structure safely to prevent tab bar overlay clipping issues */
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={data.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, theme.shadow.hero]}
        >
          <View style={styles.heroContent}>
            <View style={styles.avatarCircle}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ height: 80, width: 80, resizeMode: 'contain' }}
                />) : (
                <Icon name="user" size={32} color={theme.colors.white} />
              )}
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
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editLink}>Edit Details</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueSurface }]}>
              <Icon name="mail" size={20} color={theme.colors.linkPrimary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{data.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.greenSurface }]}>
              <Icon name="phone" size={20} color={theme.colors.success} />
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
              <View style={[styles.statBox, { backgroundColor: theme.colors.blueSurface }]}>
                <Text style={[styles.statValue, { color: theme.colors.linkPrimary }]}>5</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.greenSurface }]}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>142</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.purpleSubtle }]}>
                <Text style={[styles.statValue, { color: theme.colors.purple }]}>98%</Text>
                <Text style={styles.statLabel}>Attendance</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
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

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
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
          <Icon name="log-out" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 16,
    // Removed alternative conflicting hardcoded paddingBottom entry line from here
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

  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  heroTextContainer: {
    flex: 1,
  },

  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 4,
  },
  heroRole: {
    fontSize: 16,
    color: theme.colors.white90,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.white80,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
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
    color: theme.colors.textStrong,
  },
  editLink: {
    fontSize: 14,
    color: theme.colors.linkPrimary,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.appBackground,
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
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textStrong,
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
    borderColor: theme.colors.borderSubtle,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textBody,
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
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
    color: theme.colors.textStrong,
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSubtle,
    marginHorizontal: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dangerSubtle,
    borderRadius: 12,
    paddingVertical: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.danger,
  },
});