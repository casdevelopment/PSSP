import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme'; // Adjust path based on your folder structure

export function SectionCard({ title, children }) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            {children}
        </View>
    );
}

export function DetailRow({ label, value, icon, iconBg, iconColor, valueWeight = '500' }) {
    return (
        <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: iconBg || '#E8F0FE' }]}>
                <Icon name={icon} size={theme.iconSize.md} color={iconColor || theme.colors.linkPrimary} />
            </View>
            <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={[styles.detailValue, { fontWeight: valueWeight }]}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    cardTitle: {
        color: theme.colors.textHeading,
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailTextWrap: {
        flex: 1,
    },
    detailLabel: {
        color: theme.colors.textMuted,
        fontSize: 13,
        marginBottom: 2,
    },
    detailValue: {
        color: theme.colors.textHeading,
        fontSize: 15,
    },
});