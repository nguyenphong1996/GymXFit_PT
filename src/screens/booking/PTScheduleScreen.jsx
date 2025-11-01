// 📁 src/screens/booking/PTScheduleScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const paddingHorizontal = 16;
const gap = 8;
const boxSize = (width - paddingHorizontal * 2 - gap * 6) / 7;

const PTScheduleScreen = ({ navigation }) => {
  // ✅ Hook luôn ở đầu — không đặt trong điều kiện nào
  const [mode, setMode] = useState('week');
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 📢 Dữ liệu demo thông báo công việc
  const notifications = useMemo(
    () => ({
      '2025-11-01': 'Buổi sáng: Dẫn nhóm tập tạ ngực. Chiều: Họp PT lúc 17h.',
      '2025-11-02': 'Ca 1: Kiểm tra sức khỏe học viên mới. Ca 3: Nghỉ.',
      '2025-11-03': 'Buổi sáng: Hướng dẫn kỹ thuật Squat cho nhóm B.',
    }),
    [],
  );

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

  // 🗓️ Thông tin tháng hiện tại
  const year = displayedDate.getFullYear();
  const month = displayedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // ✅ Tạo danh sách ngày trong tháng (đảm bảo đủ 7 cột/hàng)
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

  // 🗓️ Tạo danh sách 7 ngày trong tuần
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

  const selectedNotice = notifications[formatDateKey(selectedDate)] || '';

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

        {/* 📢 Thông báo công việc */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Thông báo công việc</Text>
          <View style={styles.noticeBox}>
            {selectedNotice ? (
              <Text style={styles.noticeText}>{selectedNotice}</Text>
            ) : (
              <Text style={styles.noticeEmpty}>
                (Chưa có thông báo công việc cho ngày này)
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
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
  noticeContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  noticeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20B24A',
    marginBottom: 8,
  },
  noticeBox: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#20B24A',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: { fontSize: 15, color: '#000', lineHeight: 22 },
  noticeEmpty: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },
});
