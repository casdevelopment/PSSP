import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../../theme/theme';
import { useAuthStore } from '../../store/AuthStore';

export default function LiveChat() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const role = useAuthStore((state) => state.role);
  
  const [message, setMessage] = useState('');

  // Dynamic header background based on role
  const getHeaderGradient = () => {
    if (role === 'coordinator') return theme.gradients.purple;
    if (role === 'staff') return theme.gradients.green;
    return theme.gradients.blue; 
  };

  const getPrimaryColor = () => {
    if (role === 'coordinator') return theme.colors.purple;
    if (role === 'staff') return theme.colors.successStrong;
    return theme.colors.linkPrimary; 
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Text style={styles.pageTitle}>Live Chat</Text>
          <Text style={styles.pageSubtitle}>Chat with support</Text>
        </View>
      </LinearGradient>

      {/* Chat Messages Area */}
      <ScrollView contentContainerStyle={styles.chatScrollContent} showsVerticalScrollIndicator={false}>
        {/* Support Message Bubble */}
        <View style={[styles.messageBubble, styles.receivedMessage]}>
          <Text style={styles.messageText}>Hello! How can I help you today?</Text>
          <Text style={styles.timeText}>10:30 AM</Text>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.textMutedAlt}
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: getPrimaryColor() }]} activeOpacity={0.8}>
          <Icon name="send" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  headerBg: {
    paddingBottom: theme.spacing.lg,
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
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 15,
    color: theme.colors.white90,
  },
  chatScrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 4, // Chat bubble tail effect
  },
  messageText: {
    fontSize: 15,
    color: theme.colors.textHeading,
    lineHeight: 22,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.appBackground,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginRight: 12,
  },
  textInput: {
    fontSize: 15,
    color: theme.colors.textHeading,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
});