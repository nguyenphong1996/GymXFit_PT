import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PTCustomerListScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  // 🔥 DANH SÁCH KHÁCH ĐANG BOOK
  const customers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      endTime: '2025-11-20T19:00:00',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0934567890',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      endTime: '2025-11-20T21:00:00',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0912345678',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      endTime: '2025-11-20T17:30:00',
    },
  ];

  const now = new Date();

  // 🔥 Lọc khách chưa hết hạn
  const activeCustomers = customers.filter(
    item => new Date(item.endTime) > now,
  );

  // 🔥 Tìm kiếm
  const filtered = activeCustomers.filter(
    c =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.phone.includes(searchText),
  );

  // Format ngày + giờ
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
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách khách đang book PT</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 🔹 Ô tìm kiếm */}
      <View style={styles.searchBox}>
        <Icon name="search" size={22} color="#20B24A" />
        <TextInput
          style={styles.input}
          placeholder="Tìm theo tên hoặc số điện thoại..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 🔥 NÚT “KHÁCH HÀNG GẦN ĐÂY” (đã đổi sang xanh lá) */}
      <TouchableOpacity
        style={styles.recentBtn}
        onPress={() => navigation.navigate('PTRecentCustomerScreen')}
      >
        <Icon name="history" size={22} color="#fff" />
        <Text style={styles.recentText}>Khách hàng gần đây</Text>
      </TouchableOpacity>

      {/* 🔹 Danh sách khách */}
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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#FFA000' }]}
                onPress={() =>
                  navigation.navigate('PTCustomerDetailScreen', { customer: c })
                }
              >
                <Text style={styles.btnText}>Xem chi tiết</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#20B24A' }]}
                onPress={() =>
                  navigation.navigate('PTLessonPlanScreen', { customer: c })
                }
              >
                <Text style={styles.btnText}>Soạn giáo án</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#1E88E5' }]}
                onPress={() =>
                  navigation.navigate('PTLessonHistoryScreen', { customer: c })
                }
              >
                <Text style={styles.btnText}>Lịch sử</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PTCustomerListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#20B24A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#20B24A',
    borderWidth: 1,
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 10,
  },
  input: { flex: 1, height: 40, marginLeft: 6 },

  // 🔥 NÚT KHÁCH GẦN ĐÂY → ĐÃ ĐỔI MÀU XANH LÁ
  recentBtn: {
    backgroundColor: '#20B24A',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F8FFF9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4EEDB',
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },

  name: { fontSize: 16, fontWeight: '700' },
  phone: { color: '#555' },
  timeText: { color: '#888', fontSize: 12, marginTop: 2 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
