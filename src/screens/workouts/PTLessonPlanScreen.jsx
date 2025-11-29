import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
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

const PTLessonPlanScreen = ({ route, navigation }) => {
  const customer = route?.params?.customer || {
    name: 'Khách hàng chưa xác định',
    phone: 'N/A',
    request: 'Không có yêu cầu',
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
    setSelectedExercises(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    alert(`Đã lưu giáo án cho ${customer.name}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <Icon name="arrow-back" size={22} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Soạn giáo án</Text>
          <Text style={styles.headerSub}>{customer.name}</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoName}>{customer.name}</Text>
        <Text style={styles.infoPhone}>📞 {customer.phone}</Text>
        <Text style={styles.infoRequest}>Yêu cầu: {customer.request}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Chọn bài tập</Text>

      {/* List */}
      <FlatList
        data={exercises}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => {
          const active = selectedExercises.includes(item.id);

          return (
            <TouchableOpacity
              onPress={() => toggleExercise(item.id)}
              style={[styles.exerciseCard, active && styles.selectedCard]}
            >
              <Text
                style={[styles.exerciseText, active && styles.selectedText]}
              >
                {item.name}
              </Text>

              <Icon
                name={active ? 'check-circle' : 'radio-button-unchecked'}
                size={22}
                color={active ? COLORS.primary : '#999'}
              />
            </TouchableOpacity>
          );
        }}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu giáo án</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PTLessonPlanScreen;

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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  headerIcon: { width: 40 },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { color: COLORS.onPrimary, fontWeight: '800', fontSize: 18 },
  headerSub: { color: '#C2F0D4', fontSize: 12, marginTop: 4 },

  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outline,
    margin: 16,
    padding: 16,
  },
  infoName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoPhone: {
    marginTop: 4,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  infoRequest: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 10,
    color: COLORS.textPrimary,
  },

  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outline,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderColor: COLORS.primary,
  },

  exerciseText: { fontSize: 16, color: COLORS.textPrimary },
  selectedText: { color: COLORS.primary, fontWeight: '700' },

  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    margin: 16,
  },
  saveText: { color: COLORS.onPrimary, fontSize: 17, fontWeight: '700' },
});
