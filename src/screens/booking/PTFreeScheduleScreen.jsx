import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const paddingHorizontal = 16;
const gap = 8;
const boxSize = (width - paddingHorizontal * 2 - gap * 6) / 7;

// ✅ 4 ca mặc định
const SHIFTS = [
  { id: 'morning', label: 'Ca sáng (6h - 10h)' },
  { id: 'noon', label: 'Ca trưa (10h - 14h)' },
  { id: 'afternoon', label: 'Ca chiều (14h - 18h)' },
  { id: 'evening', label: 'Ca tối (18h - 22h)' },
];

const PTFreeScheduleScreen = ({ navigation }) => {
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 🗓️ PT lưu lịch rảnh (key = YYYY-MM-DD)
  const [availableSlots, setAvailableSlots] = useState({});

  const today = new Date();
  const year = displayedDate.getFullYear();
  const month = displayedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const getMonthName = m =>
    [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ][m];

  const formatDateKey = date =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;

  // 🗓️ Danh sách ngày trong tháng
  const monthDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    const remainder = days.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) days.push(null);
    }
    return days;
  }, [year, month]);

  const handlePrev = () => {
    const newDate = new Date(displayedDate);
    newDate.setMonth(month - 1);
    setDisplayedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(displayedDate);
    newDate.setMonth(month + 1);
    setDisplayedDate(newDate);
  };

  const handleSelectDay = day => {
    if (day) setSelectedDate(new Date(year, month, day));
  };

  const toggleShift = shiftId => {
    const key = formatDateKey(selectedDate);
    const current = availableSlots[key] || [];
    let updated = [];

    if (current.includes(shiftId)) {
      updated = current.filter(s => s !== shiftId);
    } else {
      updated = [...current, shiftId];
    }

    setAvailableSlots(prev => ({ ...prev, [key]: updated }));
  };

  const handleSave = () => {
    const key = formatDateKey(selectedDate);
    const shifts = availableSlots[key] || [];
    Alert.alert('Lưu thành công', `Đã lưu ${shifts.length} ca rảnh cho ${key}`);
    // 🔸 Tại đây bạn có thể gọi API để lưu lên server
    // e.g., saveAvailableShiftsAPI(ptId, key, shifts)
  };

  const key = formatDateKey(selectedDate);
  const selectedShifts = availableSlots[key] || [];

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch Rảnh Của PT</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 🔹 Điều hướng tháng */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrev}>
            <Icon name="chevron-left" size={30} color="#000" />
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {getMonthName(month)} - {year}
          </Text>

          <TouchableOpacity onPress={handleNext}>
            <Icon name="chevron-right" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 🗓️ Lịch tháng */}
        <View style={styles.calendarBox}>
          <View style={styles.weekHeader}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (
              <Text key={i} style={styles.weekDay}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {monthDays.map((day, index) => {
              const isToday =
                day &&
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const isSelected =
                day &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <View key={index} style={styles.dayWrapper}>
                  {day ? (
                    <TouchableOpacity
                      style={[
                        styles.dayBox,
                        isToday && styles.todayBox,
                        isSelected && styles.selectedDayBox,
                      ]}
                      onPress={() => handleSelectDay(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && { color: '#fff' },
                          isToday && !isSelected && { color: '#20B24A' },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyBox} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 🕒 Chọn ca làm */}
        <View style={styles.shiftContainer}>
          <Text style={styles.shiftTitle}>
            Chọn ca rảnh cho {formatDateKey(selectedDate)}
          </Text>

          {SHIFTS.map(shift => {
            const isSelected = selectedShifts.includes(shift.id);
            return (
              <TouchableOpacity
                key={shift.id}
                style={[styles.shiftBox, isSelected && styles.shiftSelected]}
                onPress={() => toggleShift(shift.id)}
              >
                <Text
                  style={[styles.shiftText, isSelected && { color: '#fff' }]}
                >
                  {shift.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu lịch rảnh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PTFreeScheduleScreen;

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
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  monthText: { fontSize: 16, fontWeight: '700', color: '#000' },
  calendarBox: {
    borderWidth: 1,
    borderColor: '#20B24A',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekDay: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    width: boxSize,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayWrapper: { width: boxSize, height: boxSize, marginBottom: gap },
  dayBox: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  todayBox: { borderWidth: 2, borderColor: '#20B24A' },
  selectedDayBox: { backgroundColor: '#20B24A' },
  emptyBox: { width: '100%', height: '100%' },
  dayText: { fontSize: 15, fontWeight: '600', color: '#000' },

  shiftContainer: { marginTop: 20, marginHorizontal: 16 },
  shiftTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20B24A',
    marginBottom: 8,
  },
  shiftBox: {
    borderWidth: 1,
    borderColor: '#20B24A',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  shiftSelected: { backgroundColor: '#20B24A' },
  shiftText: { fontSize: 15, color: '#000', fontWeight: '600' },
  saveButton: {
    backgroundColor: '#20B24A',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
});
