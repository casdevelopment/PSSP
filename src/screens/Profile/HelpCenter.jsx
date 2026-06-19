import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function HelpCenter() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const role = useAuthStore((state) => state.userType);

    // Dynamic header background based on role
    const getHeaderGradient = () => {
        if (role === 'coordinator') return theme.gradients.purple;
        if (role === 'staff') return theme.gradients.green;
        return theme.gradients.blue;
    };

    const getRoleColor = () => {
        if (role === 'coordinator') return theme.colors.purple;
        if (role === 'staff') return theme.colors.successStrong;
        return theme.colors.linkPrimary;
    };

    const getRoleSurfaceColor = () => {
        if (role === 'coordinator') return theme.colors.purpleSurface;
        if (role === 'staff') return theme.colors.greenSurface;
        return theme.colors.blueSurface;
    };

    const topics = [
        { id: 1, title: 'Getting Started', articles: '8 articles', icon: 'book-open' },
        { id: 2, title: 'Managing Staff', articles: '15 articles', icon: 'book-open' },
        { id: 3, title: 'Attendance Tracking', articles: '10 articles', icon: 'book-open' },
        { id: 4, title: 'Salary Management', articles: '6 articles', icon: 'book-open' },
        { id: 5, title: 'Leave Approvals', articles: '5 articles', icon: 'book-open' },
        { id: 6, title: 'Class Management', articles: '7 articles', icon: 'book-open' },
    ];

    const SupportCard = ({ title, subtitle, icon, bgColor, iconColor, onPress }) => (
        <TouchableOpacity style={[styles.supportCard, { backgroundColor: bgColor }]} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.supportLeft}>
                <View style={[styles.supportIconCircle, { backgroundColor: theme.colors.white }]}>
                    <Icon name={icon} size={20} color={iconColor} />
                </View>
                <View style={styles.supportTextContainer}>
                    <Text style={styles.supportTitle}>{title}</Text>
                    <Text style={styles.supportSubtitle}>{subtitle}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                    <Text style={styles.pageTitle}>Help Center</Text>
                    <Text style={styles.pageSubtitle}>Find answers and get support</Text>
                </View>
            </LinearGradient>


            {/* Floating Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for help..."
                    placeholderTextColor={theme.colors.textMuted}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>



                <View style={styles.contentWrap}>
                    {/* Browse Topics */}
                    <Text style={styles.sectionTitle}>Browse Topics</Text>
                    {topics.map(t => (
                        <TouchableOpacity
                            key={t.id}
                            style={styles.topicCard}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('ArticleList', { title: t.title, articlesCount: t.articles })}
                        >
                            <View style={styles.topicLeft}>
                                <View style={[styles.topicIconCircle, { backgroundColor: getRoleSurfaceColor() }]}>
                                    <Icon name={t.icon} size={20} color={getRoleColor()} />
                                </View>
                                <View>
                                    <Text style={styles.topicTitle}>{t.title}</Text>
                                    <Text style={styles.topicSubtitle}>{t.articles}</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={20} color={theme.colors.textMutedAlt} />
                        </TouchableOpacity>
                    ))}

                    {/* Contact Support */}
                    <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Contact Support</Text>

                    <SupportCard
                        title="Live Chat"
                        subtitle="Chat with our support team"
                        icon="message-circle"
                        bgColor={theme.colors.blueSurface}
                        iconColor={theme.colors.linkPrimary}
                        onPress={() => navigation.navigate('LiveChat')}
                    />

                    <SupportCard
                        title="Email Support"
                        subtitle="support@school.edu"
                        icon="mail"
                        bgColor={theme.colors.greenSurface}
                        iconColor={theme.colors.successStrong}
                    />

                    <SupportCard
                        title="Phone Support"
                        subtitle="+1 (555) 123-4567"
                        icon="phone"
                        bgColor={theme.colors.purpleSurface}
                        iconColor={theme.colors.purple}
                    />

                    <View style={{ height: 40 }} />
                </View>

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
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xs,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 16,
        color: theme.colors.white90,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xxl,
    },
    searchContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginTop: -28, // Float over header curve
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchInput: {
        fontSize: 16,
        color: theme.colors.textStrong,
        fontFamily: theme.typography.body.fontFamily,
    },
    contentWrap: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textHeading,
        marginBottom: 16,
    },
    topicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    topicLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topicIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    topicTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginBottom: 4,
    },
    topicSubtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    supportCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    supportLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    supportIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    supportTextContainer: {
        flex: 1,
    },
    supportTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginBottom: 2,
    },
    supportSubtitle: {
        fontSize: 14,
        color: theme.colors.textBody,
    },
});