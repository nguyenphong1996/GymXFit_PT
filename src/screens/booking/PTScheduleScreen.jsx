import React, { useState } from 'react';
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
const boxSize = (width - 16 * 2 - 6 * 6) / 7; // 7 cột, 6 khoảng cách

const PTScheduleScreen = ({ navigation }) => {
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [shiftData, setShiftData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // 🔄 Chuyển tháng
  const handleMonthChange = direction => {
    const newMonth = new Date(displayedMonth);
    newMonth.setMonth(displayedMonth.getMonth() + direction);
    setDisplayedMonth(newMonth);
  };

  // 🗓️ Dữ liệu tháng
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // CN=0

  // Tạo mảng ngày
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Tạo hàng hiển thị (ô trống đầu tháng)
  const totalSlots = firstDayOfWeek + daysInMonth;
  const rows = [];
  for (let i = 0; i < totalSlots; i++) {
    if (i < firstDayOfWeek) rows.push(null);
    else rows.push(i - firstDayOfWeek + 1);
  }

  // 🔹 Dữ liệu ca làm
  const shifts = [
    { id: 1, time: 'Ca 1: 6h - 9h' },
    { id: 2, time: 'Ca 2: 9h - 12h' },
    { id: 3, time: 'Ca 3: 13h - 16h' },
    { id: 4, time: 'Ca 4: 17h - 20h' },
  ];

  const handleSelectDay = day => {
    setSelectedDate(day);
    setModalVisible(true);
  };

  const handleReceiveShift = id => {
    const key = `${year}-${month + 1}-${selectedDate}`;
    const current = shiftData[key] || [];
    if (!current.includes(id)) {
      setShiftData(prev => ({
        ...prev,
        [key]: [...current, id],
      }));
    }
  };

  const getDayLabel = date => {
    const d = new Date(year, month, date);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[d.getDay()];
  };

  const getMonthName = m => {
    const months = [
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
    ];
    return months[m];
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch PT</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* 🔹 Tiêu đề tháng */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => handleMonthChange(-1)}>
            <Icon name="chevron-left" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {getMonthName(month)} - {year}
          </Text>
          <TouchableOpacity onPress={() => handleMonthChange(1)}>
            <Icon name="chevron-right" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Header thứ */}
        <View style={styles.weekHeader}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (
            <Text
              key={i}
              style={[
                styles.weekDay,
                i === 0 && { color: 'red', fontWeight: '700' },
              ]}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* 🔹 Lưới ngày */}
        <View style={styles.daysGrid}>
          {rows.map((day, index) =>
            day ? (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayBox,
                  selectedDate === day && styles.selectedDayBox,
                ]}
                onPress={() => handleSelectDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate === day && styles.selectedDayText,
                  ]}
                >
                  {day}
                </Text>
                {shiftData[`${year}-${month + 1}-${day}`] && (
                  <View style={styles.dotIndicator} />
                )}
              </TouchableOpacity>
            ) : (
              <View key={index} style={styles.emptyBox} />
            ),
          )}
        </View>
      </ScrollView>

      {/* 🔹 Modal xem ca làm */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Ngày {selectedDate} ({getDayLabel(selectedDate)})
            </Text>
            {shifts.map(shift => {
              const key = `${year}-${month + 1}-${selectedDate}`;
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
  monthText: { fontSize: 18, fontWeight: '700', color: '#000' },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
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
    marginHorizontal: 16,
    rowGap: 6,
  },
  emptyBox: { width: boxSize, height: boxSize },
  dayBox: {
    width: boxSize,
    height: boxSize,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    position: 'relative',
  },
  dayText: { fontSize: 15, color: '#000', fontWeight: '600' },
  selectedDayBox: { backgroundColor: '#20B24A' },
  selectedDayText: { color: '#fff' },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#20B24A',
    position: 'absolute',
    bottom: 6,
  },
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
    elevation: 5,
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
