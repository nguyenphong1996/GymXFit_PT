import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PTLessonPlanScreen = ({ route, navigation }) => {
  // ✅ Tránh crash nếu không có route.params
  const customer = route?.params?.customer || {
    name: 'Khách hàng chưa xác định',
    phone: 'N/A',
    request: 'Không có yêu cầu cụ thể',
  };

  const [selectedExercises, setSelectedExercises] = useState([]);

  const exercises = [
    { id: 1, name: 'Chạy bộ 10 phút' },
    { id: 2, name: 'Hít đất 15 cái' },
    { id: 3, name: 'Squat 20 cái' },
    { id: 4, name: 'Gập bụng 25 cái' },
    { id: 5, name: 'Plank 60 giây' },
  ];

  const toggleExercise = id => {
    if (selectedExercises.includes(id)) {
      setSelectedExercises(selectedExercises.filter(item => item !== id));
    } else {
      setSelectedExercises([...selectedExercises, id]);
    }
  };

  const handleSave = () => {
    alert(`Đã lưu giáo án cho ${customer.name}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soạn giáo án</Text>
      </View>

      <View style={styles.customerBox}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerPhone}>📞 {customer.phone}</Text>
        <Text style={styles.customerRequest}>Yêu cầu: {customer.request}</Text>
      </View>

      <Text style={styles.title}>Chọn bài tập</Text>

      <FlatList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.exerciseItem,
              selectedExercises.includes(item.id) && styles.selectedItem,
            ]}
            onPress={() => toggleExercise(item.id)}
          >
            <Text
              style={[
                styles.exerciseText,
                selectedExercises.includes(item.id) && styles.selectedText,
              ]}
            >
              {item.name}
            </Text>
            <Icon
              name={
                selectedExercises.includes(item.id)
                  ? 'check-circle'
                  : 'radio-button-unchecked'
              }
              size={22}
              color={selectedExercises.includes(item.id) ? '#20B24A' : '#ccc'}
            />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu giáo án</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PTLessonPlanScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 40,
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
  customerRequest: { fontSize: 14, color: '#555' },
  title: { fontSize: 18, fontWeight: '700', marginVertical: 10, color: '#000' },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  selectedItem: { backgroundColor: '#C8E6C9', borderColor: '#20B24A' },
  exerciseText: { fontSize: 16, color: '#000' },
  selectedText: { color: '#20B24A', fontWeight: '700' },
  saveButton: {
    backgroundColor: '#20B24A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
