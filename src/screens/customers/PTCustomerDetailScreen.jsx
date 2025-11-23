import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const COLORS = {
  primary: '#1F8E4A',
  onPrimary: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#E7EFE8',
  outline: '#D7E5DB',
  background: '#F5F7F6',
  textPrimary: '#10241A',
  textSecondary: '#47614F',
};

const PTCustomerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { customer } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={26} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.greeting}>Thông tin khách hàng</Text>
          <Text style={styles.headerSub}>Chi tiết hồ sơ khách hàng</Text>
        </View>

        <View style={styles.todayBtn} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarBox}>
            <Icon
              name="person-circle-outline"
              size={110}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.name}>{customer?.name || 'Chưa có tên'}</Text>
        </View>

        {/* Info Section */}
        <View style={styles.formBox}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tuổi</Text>
            <View style={styles.inputBox}>
              <Text style={styles.value}>{customer?.age || '—'}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputBox}>
              <Text style={styles.value}>{customer?.phone || '—'}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cân nặng (kg)</Text>
            <View style={styles.inputBox}>
              <Text style={styles.value}>{customer?.weight || '—'}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Chiều cao (cm)</Text>
            <View style={styles.inputBox}>
              <Text style={styles.value}>{customer?.height || '—'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PTCustomerDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },

  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onPrimary,
    letterSpacing: 0.5,
  },

  headerSub: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.primaryContainer || '#C2F0D4',
    fontWeight: '500',
  },

  todayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  avatarBox: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 80,
    padding: 6,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  formBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  formGroup: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.outline,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});
