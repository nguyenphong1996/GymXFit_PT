import React from 'react';
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

const PTLessonHistoryScreen = ({ route, navigation }) => {
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
      {/* Header (đồng bộ PTSchedule + PTCustomerList) */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <Icon name="arrow-back" size={22} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Lịch sử giáo án</Text>
          <Text style={styles.headerSub}>{customer.name}</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoName}>{customer.name}</Text>
        <Text style={styles.infoPhone}>📞 {customer.phone}</Text>
      </View>

      {/* List */}
      <FlatList
        data={lessons}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <Icon name="date-range" size={20} color={COLORS.primary} />
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

  lessonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outline,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  lessonDate: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  exercise: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 8,
    marginTop: 2,
  },
});
