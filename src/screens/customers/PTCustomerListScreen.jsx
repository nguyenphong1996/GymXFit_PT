// PTCustomerListScreen - UI theo Material Header chuẩn (không có nút quay lại)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/* MATERIAL COLOR SYSTEM */
const MATERIAL_COLORS = {
  primary: '#1F8E4A',
  onPrimary: '#FFFFFF',
  primaryContainer: '#C2F0D4',
  surface: '#FFFFFF',
  surfaceVariant: '#E7EFE8',
  outline: '#D7E5DB',
  background: '#F5F7F6',
  textPrimary: '#10241A',
  textSecondary: '#47614F',
  success: '#4CAF50',
  warning: '#FFB300',
  error: '#E53935',
};

const PTCustomerListScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const customers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      endTime: '2025-12-20T19:00:00',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0934567890',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      endTime: '2025-12-20T21:00:00',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0912345678',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      endTime: '2025-12-20T17:30:00',
    },
  ];

  const now = new Date();
  const activeCustomers = customers.filter(
    item => new Date(item.endTime) > now,
  );

  const filtered = activeCustomers.filter(
    c =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.phone.includes(searchText),
  );

  const formatFullDateTime = dateString => {
    const date = new Date(dateString);
    return (
      date.getDate().toString().padStart(2, '0') +
      '/' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      date.getFullYear() +
      ' - ' +
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0')
    );
  };

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------- */}
      {/* MATERIAL HEADER (Không có nút quay lại)           */}
      {/* ------------------------------------------------- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greeting}>Khách đang book PT</Text>
              <Text style={styles.headerSubtitle}>
                Danh sách học viên đang active
              </Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </View>
      </View>

      {/* SEARCH BOX */}
      <View style={styles.searchBox}>
        <Icon name="search" size={22} color={MATERIAL_COLORS.primary} />
        <TextInput
          style={styles.input}
          placeholder="Tìm theo tên hoặc số điện thoại..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* RECENT BUTTON */}
      <TouchableOpacity
        style={styles.recentBtn}
        onPress={() => navigation.navigate('PTRecentCustomerScreen')}
      >
        <Icon name="history" size={22} color={MATERIAL_COLORS.onPrimary} />
        <Text style={styles.recentText}>Khách hàng gần đây</Text>
      </TouchableOpacity>

      {/* LIST */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {filtered.map(c => (
          <View key={c.id} style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: c.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.phone}>{c.phone}</Text>
                <Text style={styles.timeText}>
                  Hết hạn: {formatFullDateTime(c.endTime)}
                </Text>
              </View>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.btnSmall,
                  { backgroundColor: MATERIAL_COLORS.warning },
                ]}
                onPress={() =>
                  navigation.navigate('PTCustomerDetailScreen', { customer: c })
                }
              >
                <Text style={styles.btnSmallText}>Xem chi tiết</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnSmall,
                  { backgroundColor: MATERIAL_COLORS.primary },
                ]}
                onPress={() =>
                  navigation.navigate('PTLessonPlanScreen', { customer: c })
                }
              >
                <Text style={styles.btnSmallText}>Soạn GA</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSmall, { backgroundColor: '#1E88E5' }]}
                onPress={() =>
                  navigation.navigate('PTLessonHistoryScreen', { customer: c })
                }
              >
                <Text style={styles.btnSmallText}>Lịch sử</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PTCustomerListScreen;

/* --------------------------------------------------- */
/*                       STYLES                        */
/* --------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MATERIAL_COLORS.background },

  /* HEADER theo mẫu bạn gửi */
  header: {
    backgroundColor: MATERIAL_COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: MATERIAL_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: { marginBottom: 20 },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: MATERIAL_COLORS.onPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: MATERIAL_COLORS.primaryContainer,
    fontWeight: '500',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: MATERIAL_COLORS.outline,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: MATERIAL_COLORS.surface,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: MATERIAL_COLORS.textPrimary,
  },

  recentBtn: {
    backgroundColor: MATERIAL_COLORS.primary,
    marginHorizontal: 16,
    marginVertical: 14,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  recentText: {
    color: MATERIAL_COLORS.onPrimary,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: MATERIAL_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: MATERIAL_COLORS.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: MATERIAL_COLORS.textPrimary,
  },
  phone: { color: MATERIAL_COLORS.textSecondary, marginTop: 2 },
  timeText: { color: '#888', fontSize: 12, marginTop: 4 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },

  btnSmall: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnSmallText: {
    color: MATERIAL_COLORS.onPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
});
