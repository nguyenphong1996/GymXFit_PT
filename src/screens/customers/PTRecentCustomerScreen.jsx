// PTRecentCustomerScreen - synced UI with PTScheduleScreen & PTCustomerListScreen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const PTRecentCustomerScreen = ({ navigation }) => {
  const now = new Date().getTime();

  const recentCustomers = [
    {
      id: 99,
      name: 'Lê Văn C',
      phone: '0912345678',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      bookStart: now - 1000 * 60 * 120,
      bookEnd: now - 1000 * 60 * 10,
    },
  ];

  const formatTime = ts => new Date(ts).toLocaleTimeString();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 40 }}
        >
          <Icon name="arrow-back" size={22} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Khách hàng gần đây</Text>
          <Text style={styles.headerSub}>Lịch sử khách vừa book PT</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {recentCustomers.map(c => (
          <View key={c.id} style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: c.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.phone}>{c.phone}</Text>
              </View>
            </View>

            <Text style={styles.timeText}>
              🕒 Bắt đầu: {formatTime(c.bookStart)}
            </Text>
            <Text style={styles.timeText}>
              🕘 Kết thúc: {formatTime(c.bookEnd)}
            </Text>

            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() =>
                navigation.navigate('PTCustomerDetailScreen', { customer: c })
              }
            >
              <Text style={styles.btnText}>Xem lại thông tin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.historyBtn}
              onPress={() =>
                navigation.navigate('PTLessonHistoryScreen', { customer: c })
              }
            >
              <Text style={styles.btnText}>Xem lịch sử giáo án</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PTRecentCustomerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 18 : 44,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
  },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { color: COLORS.onPrimary, fontSize: 18, fontWeight: '800' },
  headerSub: { color: '#C2F0D4', fontSize: 12, marginTop: 4 },

  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.outline,
    marginBottom: 14,
    elevation: 2,
  },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },

  name: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  phone: { color: COLORS.textSecondary },

  timeText: { marginTop: 4, color: '#1E88E5', fontSize: 13 },

  detailBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  historyBtn: {
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
