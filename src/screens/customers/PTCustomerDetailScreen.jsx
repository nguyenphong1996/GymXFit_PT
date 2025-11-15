import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native'; // ✅ thêm hook

const PTCustomerDetailScreen = () => {
  const navigation = useNavigation(); // ✅ đảm bảo back hoạt động trong mọi context
  const route = useRoute();
  const { customer } = route.params || {}; // tránh lỗi nếu không truyền params

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.6}
          onPress={() => navigation.goBack()} // ✅ hoạt động chuẩn
        >
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thông tin khách hàng</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* 🔹 Nội dung */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 🧍‍♂️ Avatar bằng icon vector */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBox}>
            <Icon name="person-circle-outline" size={110} color="#20B24A" />
          </View>
          <Text style={styles.name}>{customer?.name || 'Chưa có tên'}</Text>
        </View>

        {/* 🧾 Thông tin chi tiết */}
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
  container: { flex: 1, backgroundColor: '#fff' },

  // 🟩 Header
  header: {
    backgroundColor: '#20B24A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // 🧍‍♂️ Avatar Section
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
    backgroundColor: '#E9F8EE',
    borderRadius: 80,
    padding: 6,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  // 🧾 Form Section
  formBox: {
    backgroundColor: '#F9FDFB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCEFE1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  formGroup: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCEFE1',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});
