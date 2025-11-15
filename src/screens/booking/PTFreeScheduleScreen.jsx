// 📁 src/screens/PT/PTFreeScheduleScreen.js
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
import { useLayoutEffect } from 'react';

const { width } = Dimensions.get('window');
const paddingHorizontal = 16;
const gap = 8;
const boxSize = (width - paddingHorizontal * 2 - gap * 6) / 7;

const PTFreeScheduleScreen = ({ navigation }) => {
  // ✅ Ẩn header mặc định của navigation
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [mode, setMode] = useState('week');
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState({});

  const slots = [
    { label: 'Ca 1 (06:00 - 10:00)', key: 'Ca 1' },
    { label: 'Ca 2 (10:00 - 12:00)', key: 'Ca 2' },
    { label: 'Ca 3 (14:00 - 17:00)', key: 'Ca 3' },
    { label: 'Ca 4 (17:00 - 21:00)', key: 'Ca 4' },
  ];

  const toggleSlot = (dateKey, slotKey) => {
    setSelectedSlots(prev => {
      const current = prev[dateKey] || [];
      const updated = current.includes(slotKey)
        ? current.filter(s => s !== slotKey)
        : [...current, slotKey];
      return { ...prev, [dateKey]: updated };
    });
  };

  const handleSave = () => {
    const key = formatDateKey(selectedDate);
    const chosen = selectedSlots[key] || [];
    if (chosen.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 ca rảnh để lưu.');
      return;
    }
    Alert.alert(
      'Đã lưu lịch rảnh',
      `Ngày ${key}\nCác ca rảnh: ${chosen.join(
        ', ',
      )}\nThông tin đã gửi đến Admin.`,
    );
  };

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

  const getDayLabel = date => {
    if (!date) return '';
    const d = new Date(date);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[d.getDay()];
  };

  const year = displayedDate.getFullYear();
  const month = displayedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

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

  const weekDays = useMemo(() => {
    const current = new Date(displayedDate);
    const start = new Date(current);
    start.setDate(current.getDate() - current.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [displayedDate]);

  const handleSelectDay = day => {
    if (day) setSelectedDate(day);
  };

  const handlePrev = () => {
    const newDate = new Date(displayedDate);
    if (mode === 'month') newDate.setMonth(month - 1);
    else newDate.setDate(displayedDate.getDate() - 7);
    setDisplayedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(displayedDate);
    if (mode === 'month') newDate.setMonth(month + 1);
    else newDate.setDate(displayedDate.getDate() + 7);
    setDisplayedDate(newDate);
  };

  const today = new Date();
  const formatDateKey = date => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const dateKey = formatDateKey(selectedDate);
  const selectedForDay = selectedSlots[dateKey] || [];

  return (
    <View style={styles.container}>
      {/* ✅ Header xanh lá custom */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerLeft}
        >
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lịch PT</Text>

        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => setMode(mode === 'month' ? 'week' : 'month')}
        >
          <Text style={styles.headerRightText}>
            {mode === 'month' ? 'Tuần' : 'Tháng'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 🔹 Điều hướng tháng / tuần */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrev}>
            <Icon name="chevron-left" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode(mode === 'month' ? 'week' : 'month')}
          >
            <Text style={styles.monthText}>
              {mode === 'month'
                ? `${getMonthName(month)} - ${year}`
                : `${getDayLabel(
                    weekDays[0],
                  )} ${weekDays[0].getDate()} → ${getDayLabel(
                    weekDays[6],
                  )} ${weekDays[6].getDate()} ${getMonthName(
                    weekDays[6].getMonth(),
                  )}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Icon name="chevron-right" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 🗓️ Lịch hiển thị */}
        {mode === 'month' ? (
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
                        onPress={() =>
                          handleSelectDay(new Date(year, month, day))
                        }
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
        ) : (
          <View style={styles.weekContainer}>
            {weekDays.map((item, index) => {
              const isSelected =
                selectedDate.toDateString() === item.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.weekDayBox,
                    isSelected && styles.selectedDayBox,
                  ]}
                  onPress={() => handleSelectDay(item)}
                >
                  <Text
                    style={[styles.dayText, isSelected && { color: '#fff' }]}
                  >
                    {getDayLabel(item)}
                  </Text>
                  <Text
                    style={[styles.dayText, isSelected && { color: '#fff' }]}
                  >
                    {item.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 📢 Chọn ca rảnh trong ngày */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Chọn ca rảnh trong ngày</Text>
          <View style={styles.slotContainer}>
            {slots.map((slot, i) => {
              const isSelected = selectedForDay.includes(slot.key);
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.slotBox, isSelected && styles.slotSelectedBox]}
                  onPress={() => toggleSlot(dateKey, slot.key)}
                >
                  <Text
                    style={[styles.slotText, isSelected && { color: '#fff' }]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Lưu lịch rảnh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PTFreeScheduleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // ✅ Header custom xanh lá
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#20B24A',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerRight: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  headerRightText: { color: '#20B24A', fontSize: 15, fontWeight: '600' },

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
  dayWrapper: {
    width: boxSize,
    height: boxSize,
    marginBottom: gap,
  },
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
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  weekDayBox: {
    width: boxSize,
    height: boxSize * 1.1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  dayText: { fontSize: 15, fontWeight: '600', color: '#000' },
  noticeContainer: { marginTop: 20, marginHorizontal: 16 },
  noticeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20B24A',
    marginBottom: 10,
  },
  slotContainer: { flexDirection: 'column', gap: 10, marginBottom: 20 },
  slotBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#20B24A',
    backgroundColor: '#E8F5E9',
  },
  slotSelectedBox: { backgroundColor: '#20B24A' },
  slotText: { fontSize: 15, fontWeight: '600', color: '#000' },
  saveButton: {
    backgroundColor: '#20B24A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
