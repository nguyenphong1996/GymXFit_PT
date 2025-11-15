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

  const customers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      age: 28,
      weight: 70,
      height: 175,
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0934567890',
      age: 25,
      weight: 55,
      height: 165,
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0912345678',
      age: 30,
      weight: 80,
      height: 180,
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
    },
  ];

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.phone.includes(searchText),
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách khách hàng</Text>
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

      {/* 🔹 Danh sách */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {filtered.map(c => (
          <View key={c.id} style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: c.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.phone}>{c.phone}</Text>
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
  name: { fontSize: 16, fontWeight: '700', color: '#000' },
  phone: { color: '#555' },
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
