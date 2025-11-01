// 📁 src/screens/booking/PTScheduleScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const paddingHorizontal = 16;
const gap = 8;
const boxSize = (width - paddingHorizontal * 2 - gap * 6) / 7;

const PTScheduleScreen = ({ navigation }) => {
  const [mode, setMode] = useState('week'); // 🔹 Mặc định là tuần
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [shiftData, setShiftData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const shifts = [
    { id: 1, time: 'Ca 1: 6h - 9h' },
    { id: 2, time: 'Ca 2: 9h - 12h' },
    { id: 3, time: 'Ca 3: 13h - 16h' },
    { id: 4, time: 'Ca 4: 17h - 20h' },
  ];

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

  // 🗓️ Tính thông tin tháng
  const { year, month } = useMemo(
    () => ({
      year: displayedDate.getFullYear(),
      month: displayedDate.getMonth(),
    }),
    [displayedDate],
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // ✅ Lịch tháng (đủ 7 cột/hàng)
  const monthDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    const remainder = days.length % 7;
    if (remainder !== 0) {
      const emptyEnd = 7 - remainder;
      for (let i = 0; i < emptyEnd; i++) days.push(null);
    }
    return days;
  }, [year, month]);

  // 🗓️ Lịch tuần
  const weekDays = useMemo(() => {
    const current = new Date(displayedDate);
    const start = new Date(current);
    start.setDate(current.getDate() - current.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [displayedDate]);

  const handleSelectDay = day => {
    setSelectedDate(day);
    setModalVisible(true);
  };

  const handleReceiveShift = id => {
    const key = selectedDate.toDateString();
    const current = shiftData[key] || [];
    if (!current.includes(id)) {
      setShiftData(prev => ({
        ...prev,
        [key]: [...current, id],
      }));
    }
  };

  const handlePrev = () => {
    const newDate = new Date(displayedDate);
    if (mode === 'month') newDate.setMonth(displayedDate.getMonth() - 1);
    else newDate.setDate(displayedDate.getDate() - 7);
    setDisplayedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(displayedDate);
    if (mode === 'month') newDate.setMonth(displayedDate.getMonth() + 1);
    else newDate.setDate(displayedDate.getDate() + 7);
    setDisplayedDate(newDate);
  };

  // 📋 Chỉ hiển thị ca đã nhận của ngày được chọn
  const receivedList = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toDateString();
    const receivedShiftIds = shiftData[key] || [];
    const shiftNames = receivedShiftIds.map(
      id => shifts.find(s => s.id === id)?.time,
    );
    return shiftNames.length > 0
      ? [
          {
            date: `${selectedDate.getDate()}/${
              selectedDate.getMonth() + 1
            }/${selectedDate.getFullYear()}`,
            shifts: shiftNames,
          },
        ]
      : [];
  }, [selectedDate, shiftData]);

  const today = new Date();

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch PT</Text>
        <TouchableOpacity
          onPress={() => setMode(mode === 'month' ? 'week' : 'month')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {mode === 'month' ? 'Tuần' : 'Tháng'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 🔹 Thanh điều hướng tháng/tuần */}
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
                  selectedDate &&
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
            {weekDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.weekDayBox,
                  selectedDate?.toDateString() === item.toDateString() &&
                    styles.selectedDayBox,
                ]}
                onPress={() => handleSelectDay(item)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate?.toDateString() === item.toDateString() && {
                      color: '#fff',
                    },
                  ]}
                >
                  {getDayLabel(item)}
                </Text>
                <Text
                  style={[
                    styles.dayText,
                    selectedDate?.toDateString() === item.toDateString() && {
                      color: '#fff',
                    },
                  ]}
                >
                  {item.getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 📋 Danh sách ca đã nhận (chỉ trong ngày được chọn) */}
        {receivedList.length > 0 && (
          <View style={styles.receivedContainer}>
            <Text style={styles.receivedTitle}>Ca làm đã nhận</Text>
            {receivedList.map((item, idx) => (
              <View key={idx} style={styles.receivedItem}>
                <Text style={styles.receivedDate}>{item.date}</Text>
                {item.shifts.map((shift, i) => (
                  <Text key={i} style={styles.receivedShift}>
                    • {shift}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 🔹 Modal chọn ca */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {selectedDate
                ? `Ngày ${selectedDate.getDate()} (${getDayLabel(
                    selectedDate,
                  )})`
                : 'Chọn ngày'}
            </Text>

            {shifts.map(shift => {
              const key = selectedDate?.toDateString();
              const received = shiftData[key]?.includes(shift.id);
              return (
                <TouchableOpacity
                  key={shift.id}
                  style={[
                    styles.shiftBox,
                    received && { backgroundColor: '#20B24A' },
                  ]}
                  onPress={() => !received && handleReceiveShift(shift.id)}
                  disabled={received}
                >
                  <Text
                    style={[styles.shiftText, received && { color: '#fff' }]}
                  >
                    {shift.time}
                  </Text>
                  {received && (
                    <Icon name="check-circle" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PTScheduleScreen;

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
  todayBox: {
    borderWidth: 2,
    borderColor: '#20B24A',
  },
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
  receivedContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#20B24A',
  },
  receivedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20B24A',
    marginBottom: 8,
  },
  receivedItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
  },
  receivedDate: { fontSize: 15, fontWeight: '700', color: '#000' },
  receivedShift: { fontSize: 14, color: '#333', marginLeft: 10 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  shiftBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#20B24A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  shiftText: { fontSize: 16, fontWeight: '600', color: '#000' },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#20B24A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
