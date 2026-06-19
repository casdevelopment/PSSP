import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function ArticleList() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const role = useAuthStore((state) => state.userType);

    // Retrieve topic info or use fallback
    const { title, articlesCount } = route.params || {
        title: 'Managing Staff',
        articlesCount: '3 helpful articles',
    };

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

    const articles = [
        {
            id: 1,
            title: 'Adding new staff members',
            description: 'How to onboard new teachers and staff to your school.',
            icon: 'book-open'
        },
        {
            id: 2,
            title: 'Editing staff profiles',
            description: 'Update staff information, roles, and permissions.',
            icon: 'book-open'
        },
        {
            id: 3,
            title: 'Monitoring staff performance',
            description: 'Track attendance and performance metrics.',
            icon: 'book-open'
        },
    ];

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
                    <Text style={styles.pageTitle}>{title}</Text>
                    <Text style={styles.pageSubtitle}>{articlesCount}</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentWrap}>
                    {articles.map(article => (
                        <TouchableOpacity key={article.id} style={styles.articleCard} activeOpacity={0.7}>
                            <View style={styles.articleLeft}>
                                <View style={[styles.articleIconCircle, { backgroundColor: getRoleSurfaceColor() }]}>
                                    <Icon name={article.icon} size={20} color={getRoleColor()} />
                                </View>
                                <View style={styles.articleTextContainer}>
                                    <Text style={styles.articleTitle}>{article.title}</Text>
                                    <Text style={styles.articleDescription}>{article.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
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
        zIndex: 1,
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
    scrollView: {
        marginTop: -30,
        zIndex: 5,
        elevation: 5,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xxl,
    },
    contentWrap: {
        paddingHorizontal: 16,
    },
    articleCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        // Optional subtle shadow
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    articleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    articleIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    articleTextContainer: {
        flex: 1,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textHeading,
        marginBottom: 4,
    },
    articleDescription: {
        fontSize: 14,
        color: theme.colors.textBody,
        lineHeight: 20,
    },
});