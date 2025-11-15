import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PTLessonHistoryScreen = ({ route, navigation }) => {
  // ✅ Tránh crash khi route.params không có
  const customer = route?.params?.customer || {
    name: 'Khách hàng chưa xác định',
    phone: 'N/A',
  };

  const lessons = [
    {
      id: 1,
      date: '20/10/2025',
      exercises: ['Chạy bộ 10 phút', 'Hít đất 15 cái'],
    },
    { id: 2, date: '25/10/2025', exercises: ['Squat 20 cái', 'Plank 60 giây'] },
    {
      id: 3,
      date: '28/10/2025',
      exercises: ['Gập bụng 25 cái', 'Chạy bộ 15 phút'],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giáo án</Text>
      </View>

      <View style={styles.customerBox}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerPhone}>📞 {customer.phone}</Text>
      </View>

      <FlatList
        data={lessons}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.lessonItem}>
            <View style={styles.lessonHeader}>
              <Icon name="date-range" size={20} color="#20B24A" />
              <Text style={styles.lessonDate}>{item.date}</Text>
            </View>
            {item.exercises.map((ex, idx) => (
              <Text key={idx} style={styles.exercise}>
                • {ex}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default PTLessonHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 10 },
  customerBox: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  customerName: { fontSize: 18, fontWeight: '700', color: '#000' },
  customerPhone: { fontSize: 15, color: '#333' },
  lessonItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  lessonDate: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#20B24A',
  },
  exercise: { fontSize: 15, color: '#000', marginLeft: 6 },
});
