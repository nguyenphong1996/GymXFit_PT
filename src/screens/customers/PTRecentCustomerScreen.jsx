import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PTRecentCustomerScreen = ({ navigation }) => {
  const now = new Date().getTime();

  // ❗ Dữ liệu mẫu — sau này thay bằng API
  const recentCustomers = [
    {
      id: 99,
      name: 'Lê Văn C',
      phone: '0912345678',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      bookStart: now - 1000 * 60 * 120,
      bookEnd: now - 1000 * 60 * 10, // vừa kết thúc 10 phút
    },
  ];

  const formatTime = ts => new Date(ts).toLocaleTimeString();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khách hàng gần đây</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
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

            {/* 🔹 Nút xem lại thông tin */}
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() =>
                navigation.navigate('PTCustomerDetailScreen', { customer: c })
              }
            >
              <Text style={styles.btnText}>Xem lại thông tin</Text>
            </TouchableOpacity>

            {/* 🔥 Nút mới: xem lịch sử giáo án */}
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
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#20B24A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  card: {
    backgroundColor: '#F8FFF9',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4EEDB',
    marginBottom: 12,
  },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },

  name: { fontSize: 16, fontWeight: '700' },
  phone: { color: '#555' },

  timeText: { color: '#1E88E5', marginBottom: 4 },

  detailBtn: {
    backgroundColor: '#20B24A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  historyBtn: {
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
