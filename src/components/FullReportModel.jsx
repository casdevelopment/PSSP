import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';

export default function FullReportmodel({ visible, onClose, student }) {
  const insets = useSafeAreaInsets();
  
  // Guard clause against undefined props on initial mount
  const currentStudent = student || { name: 'Student', rollNo: '-', attendance: '-' };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modelOverlay}>
        <View style={[styles.modelContainer, { marginTop: insets.top + 40, marginBottom: insets.bottom + 40 }]}>
          
          {/* Header */}
          <View style={styles.modelHeader}>
            <Text style={styles.modelTitle}>Full Student Report</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="x" size={20} color={theme.colors.textBody} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Student Information */}
            <View style={[styles.infoBlock, { backgroundColor: theme.colors.blueSurface }]}>
              <Text style={styles.blockTitle}>Student Information</Text>
              
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{currentStudent.studentName || currentStudent.name || 'Unknown'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Roll No:</Text>
                <Text style={styles.value}>{currentStudent.rollNumber || currentStudent.rollNo || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Class:</Text>
                <Text style={styles.valueStrong}>
                  {currentStudent.className || 'N/A'}{currentStudent.sectionName ? ` - ${currentStudent.sectionName}` : ''}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Overall Attendance:</Text>
                <Text style={[styles.valueStrong, { color: theme.colors.success }]}>{currentStudent.attendance || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Performance:</Text>
                <Text style={[styles.valueStrong, { color: theme.colors.accentPurple }]}>94%</Text>
              </View>
            </View>

            {/* Academic Performance */}
            <View style={[styles.infoBlock, { backgroundColor: theme.colors.purpleSurface }]}>
              <Text style={styles.blockTitle}>Academic Performance</Text>
              
              <View style={styles.subjectRow}>
                <View>
                  <Text style={styles.subjectName}>Mathematics</Text>
                  <Text style={styles.subjectDate}>Apr 28, 2026</Text>
                </View>
                <Text style={[styles.subjectScore, { color: theme.colors.accentPurple }]}>95%</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.subjectRow}>
                <View>
                  <Text style={styles.subjectName}>Physics</Text>
                  <Text style={styles.subjectDate}>Apr 25, 2026</Text>
                </View>
                <Text style={[styles.subjectScore, { color: theme.colors.accentPurple }]}>92%</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.subjectRow}>
                <View>
                  <Text style={styles.subjectName}>English</Text>
                  <Text style={styles.subjectDate}>Apr 22, 2026</Text>
                </View>
                <Text style={[styles.subjectScore, { color: theme.colors.accentPurple }]}>96%</Text>
              </View>

              <View style={styles.dividerStrong} />
              
              <View style={styles.averageRow}>
                <Text style={styles.averageLabel}>Average Score:</Text>
                <Text style={[styles.averageValue, { color: theme.colors.accentPurple }]}>94%</Text>
              </View>
            </View>

            {/* Attendance Summary */}
            <View style={[styles.infoBlock, { backgroundColor: theme.colors.successSubtle }]}>
              <Text style={styles.blockTitle}>Attendance Summary</Text>
              <View style={styles.summaryStatsRow}>
                <View style={styles.statCol}>
                  <Text style={[styles.statNum, { color: theme.colors.successStrong }]}>4</Text>
                  <Text style={styles.statLabel}>Present</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={[styles.statNum, { color: theme.colors.warning }]}>1</Text>
                  <Text style={styles.statLabel}>Late</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={[styles.statNum, { color: theme.colors.danger }]}>0</Text>
                  <Text style={styles.statLabel}>Absent</Text>
                </View>
              </View>
            </View>
            
          </ScrollView>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.closeReportBtn} onPress={onClose}>
              <Text style={styles.closeReportText}>Close Report</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modelOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modelContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  modelTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textHeading,
  },
  closeBtn: {
    backgroundColor: theme.colors.surfaceSubtle,
    padding: 6,
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoBlock: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textBody,
  },
  value: {
    fontSize: 14,
    color: theme.colors.textHeading,
  },
  valueStrong: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textHeading,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textHeading,
    marginBottom: 4,
  },
  subjectDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  subjectScore: {
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.white,
    opacity: 0.5,
    marginVertical: 12,
  },
  dividerStrong: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: 16,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textHeading,
  },
  averageValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  statCol: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textBody,
    fontWeight: '500',
  },
  actionContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  closeReportBtn: {
    backgroundColor: theme.colors.linkPrimary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeReportText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});