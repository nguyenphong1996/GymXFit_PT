// 📁 src/screens/booking/PTScheduleScreen.js
// Reference screenshot (provided asset): /mnt/data/496b10e5-3dbc-4ef3-b557-c5ce6fe05a42.png
// Material-like schedule screen:
// - Header shows: "Thứ X, dd/mm/yyyy" between prev/next arrows
// - Tap that label to open Year Picker modal
// - Year Picker shows 7 visible rows, starts at 2015 and appends forward infinitely

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Modal,
  Pressable,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 64;
const YEAR_ROW_HEIGHT = 56;
const VISIBLE_YEAR_ROWS = 7;

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

const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const fullDayNames = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const pad2 = n => String(n).padStart(2, '0');

const formatDateKey = date => {
  if (!date) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate(),
  )}`;
};

const dayLabelFull = date =>
  `${fullDayNames[date.getDay()]}, ${pad2(date.getDate())}/${pad2(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;

/* Day pill component */
const DayItem = ({ item, isSelected, isToday, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => onPress(item)}
    style={[
      styles.dayContainer,
      isSelected && styles.selectedDayContainer,
      isToday && !isSelected && styles.todayContainer,
    ]}
  >
    <Text
      style={[
        styles.dayName,
        isSelected && styles.selectedDayName,
        isToday && !isSelected && styles.todayText,
      ]}
    >
      {item.label}
    </Text>

    <Text
      style={[
        styles.dayDate,
        isSelected && styles.selectedDayDate,
        isToday && !isSelected && styles.todayText,
      ]}
    >
      {item.dayNumber}
    </Text>

    {isToday && !isSelected && <View style={styles.todayDot} />}
  </TouchableOpacity>
);

/* YearPickerList: starts from `startYear`, initial end `initialEndYear`,
   shows VISIBLE_YEAR_ROWS, appends forward when scrolling near end */
const YearPickerList = ({
  startYear = 2015,
  initialEndYear = new Date().getFullYear() + 5,
  rowHeight = YEAR_ROW_HEIGHT,
  visibleRows = VISIBLE_YEAR_ROWS,
  selectedYear,
  onSelectYear,
}) => {
  const [years, setYears] = useState(() => {
    const a = [];
    for (let y = startYear; y <= initialEndYear; y++) a.push(y);
    return a;
  });

  const listRef = useRef(null);
  const isAppendingRef = useRef(false);

  // ensure selectedYear exists in list and scroll to it
  useEffect(() => {
    if (!listRef.current) return;
    const idx = years.findIndex(y => y === selectedYear);
    if (idx >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: idx,
          animated: false,
          viewPosition: 0.5,
        });
      }, 40);
      return;
    }
    // if selectedYear is beyond end, append until included
    if (selectedYear > years[years.length - 1]) {
      // append chunks until selectedYear included
      const to = selectedYear + 5;
      const append = [];
      for (let y = years[years.length - 1] + 1; y <= to; y++) append.push(y);
      setYears(prev => [...prev, ...append]);
      setTimeout(() => {
        const newIdx = years.findIndex(y => y === selectedYear);
        if (newIdx >= 0) {
          listRef.current?.scrollToIndex({
            index: newIdx,
            animated: false,
            viewPosition: 0.5,
          });
        }
      }, 80);
    } else {
      // shouldn't happen often — just attempt to find & scroll
      const idx2 = years.findIndex(y => y === selectedYear);
      if (idx2 >= 0) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index: idx2,
            animated: false,
            viewPosition: 0.5,
          });
        }, 40);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const appendMore = useCallback(() => {
    if (isAppendingRef.current) return;
    isAppendingRef.current = true;
    setTimeout(() => {
      setYears(prev => {
        const last = prev[prev.length - 1];
        const next = [];
        for (let y = last + 1; y <= last + 10; y++) next.push(y);
        return [...prev, ...next];
      });
      isAppendingRef.current = false;
    }, 120);
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      const isCurrent = item === selectedYear;
      return (
        <TouchableOpacity
          style={[styles.yearRow, isCurrent && styles.yearRowSelected]}
          activeOpacity={0.8}
          onPress={() => onSelectYear(item)}
        >
          <Text style={[styles.yearText, isCurrent && styles.yearTextSelected]}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedYear, onSelectYear],
  );

  return (
    <FlatList
      ref={listRef}
      data={years}
      keyExtractor={y => String(y)}
      renderItem={renderItem}
      style={{ maxHeight: rowHeight * visibleRows }}
      getItemLayout={(_, index) => ({
        length: rowHeight,
        offset: rowHeight * index,
        index,
      })}
      showsVerticalScrollIndicator={true}
      onEndReachedThreshold={0.4}
      onEndReached={appendMore}
      initialNumToRender={visibleRows + 2}
      nestedScrollEnabled
    />
  );
};

const PTScheduleScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const todayRef = useRef(new Date());
  todayRef.current.setHours(0, 0, 0, 0);

  const flatListRef = useRef(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);

  // notifications demo
  const notifications = useMemo(
    () => ({
      '2025-11-01': 'Buổi sáng: Dẫn nhóm tập ngực.\nChiều: Họp PT lúc 17h.',
      '2025-11-02': 'Ca 1: Kiểm tra sức khỏe học viên mới.\nCa 3: Nghỉ.',
      '2025-11-03': 'Buổi sáng: Hướng dẫn kỹ thuật Squat cho nhóm B.',
    }),
    [],
  );

  const daysInMonthCount = useCallback((year, month) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const daysForMonth = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const total = daysInMonthCount(y, m);
    const arr = [];
    for (let i = 1; i <= total; i++) {
      const d = new Date(y, m, i);
      d.setHours(0, 0, 0, 0);
      arr.push({
        id: `${d.getTime()}`,
        index: i - 1,
        dateObj: d,
        dayNumber: i,
        label: dayNames[d.getDay()],
        isToday: isSameDay(d, todayRef.current),
      });
    }
    return arr;
  }, [currentMonth, daysInMonthCount]);

  // sync selected index and scroll when month or selectedDate changes
  useEffect(() => {
    const idx = daysForMonth.findIndex(d => isSameDay(d.dateObj, selectedDate));
    if (idx >= 0) {
      setSelectedDateIndex(idx);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: idx,
          animated: true,
          viewPosition: 0.5,
        });
      }, 60);
      return;
    }

    // clamp day if selectedDate not in current month
    const dayNum = selectedDate.getDate();
    const clamped = Math.min(Math.max(1, dayNum), daysForMonth.length);
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      clamped,
    );
    newDate.setHours(0, 0, 0, 0);
    const newIdx = clamped - 1;
    setSelectedDate(newDate);
    setSelectedDateIndex(newIdx);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: newIdx,
        animated: true,
        viewPosition: 0.5,
      });
    }, 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysForMonth]);

  const goToPreviousMonth = useCallback(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const newMonth = new Date(y, m - 1, 1);
    setCurrentMonth(newMonth);

    const desired = selectedDate.getDate();
    const max = daysInMonthCount(newMonth.getFullYear(), newMonth.getMonth());
    const clamped = Math.min(desired, max);
    const newSel = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      clamped,
    );
    newSel.setHours(0, 0, 0, 0);
    setSelectedDate(newSel);
  }, [currentMonth, selectedDate, daysInMonthCount]);

  const goToNextMonth = useCallback(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const newMonth = new Date(y, m + 1, 1);
    setCurrentMonth(newMonth);

    const desired = selectedDate.getDate();
    const max = daysInMonthCount(newMonth.getFullYear(), newMonth.getMonth());
    const clamped = Math.min(desired, max);
    const newSel = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      clamped,
    );
    newSel.setHours(0, 0, 0, 0);
    setSelectedDate(newSel);
  }, [currentMonth, selectedDate, daysInMonthCount]);

  const goToToday = useCallback(() => {
    const t = new Date(todayRef.current);
    setCurrentMonth(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDate(t);
  }, []);

  const handlePressDay = useCallback(dayItem => {
    setSelectedDate(dayItem.dateObj);
    setSelectedDateIndex(dayItem.index);
    flatListRef.current?.scrollToIndex({
      index: dayItem.index,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  const renderDay = useCallback(
    ({ item }) => (
      <DayItem
        item={item}
        isSelected={item.index === selectedDateIndex}
        isToday={item.isToday}
        onPress={handlePressDay}
      />
    ),
    [selectedDateIndex, handlePressDay],
  );

  const dateKey = formatDateKey(selectedDate);
  const selectedNotice = notifications[dateKey] || '';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const onDaysLayout = useCallback(() => {
    setTimeout(() => {
      if (selectedDateIndex >= 0 && selectedDateIndex < daysForMonth.length) {
        flatListRef.current?.scrollToIndex({
          index: selectedDateIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }
    }, 80);
  }, [selectedDateIndex, daysForMonth.length]);

  // month / year label shown between arrows (full day + date)
  const headerLabel = dayLabelFull(selectedDate);

  // Year selection handler (from YearPickerList)
  const onSelectYear = useCallback(
    year => {
      const month = currentMonth.getMonth();
      const desiredDay = selectedDate.getDate();
      const maxDays = daysInMonthCount(year, month);
      const clampedDay = Math.min(desiredDay, maxDays);

      const newCurrentMonth = new Date(year, month, 1);
      const newSelected = new Date(year, month, clampedDay);
      newSelected.setHours(0, 0, 0, 0);

      setCurrentMonth(newCurrentMonth);
      setSelectedDate(newSelected);
      setYearModalVisible(false);
    },
    [currentMonth, selectedDate, daysInMonthCount],
  );

  const monthNames = [
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
  const monthYearLabel = `${
    monthNames[currentMonth.getMonth()]
  }, ${currentMonth.getFullYear()}`;

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
          <Text style={styles.greeting}>Lịch PT</Text>
          <Text style={styles.headerSub}>Xem thông báo công việc</Text>
        </View>

        <View style={{ width: 40 }}>
          <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
            <Icon name="today" size={20} color={COLORS.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar section */}
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.calendarNavButton}
            onPress={goToPreviousMonth}
          >
            <Icon name="chevron-left" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Middle label (full day + date) - tappable to open year modal */}
          <TouchableOpacity
            style={styles.monthYearButton}
            activeOpacity={0.85}
            onPress={() => setYearModalVisible(true)}
          >
            <Text style={styles.monthYearText}>{headerLabel}</Text>
            <Icon
              name="event"
              size={16}
              color={COLORS.primary}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.calendarNavButton}
            onPress={goToNextMonth}
          >
            <Icon name="chevron-right" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Horizontal day pills */}
        <FlatList
          ref={flatListRef}
          horizontal
          data={daysForMonth}
          keyExtractor={it => it.id}
          renderItem={renderDay}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScrollContainer}
          initialScrollIndex={selectedDateIndex}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH + 12,
            offset: (ITEM_WIDTH + 12) * index,
            index,
          })}
          onScrollToIndexFailed={info => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: Math.min(info.index, daysForMonth.length - 1),
                animated: true,
                viewPosition: 0.5,
              });
            }, 300);
          }}
          windowSize={11}
          maxToRenderPerBatch={15}
          removeClippedSubviews={Platform.OS === 'android'}
          onLayout={onDaysLayout}
        />
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.daySummary}>
          <Text style={styles.daySummaryTitle}>
            {fullDayNames[selectedDate.getDay()]}, {selectedDate.getDate()}/
            {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
          </Text>
          <Text style={styles.daySummarySubtitle}>Thông báo công việc</Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
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

      {/* Year Picker modal */}
      <Modal
        visible={yearModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setYearModalVisible(false)}
      >
        <Pressable
          style={modalStyles.backdrop}
          onPress={() => setYearModalVisible(false)}
        >
          <Pressable style={[modalStyles.dialog]} onPress={() => {}}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Chọn năm</Text>
              <TouchableOpacity
                onPress={() => setYearModalVisible(false)}
                style={modalStyles.closeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <YearPickerList
              startYear={2015}
              initialEndYear={Math.max(new Date().getFullYear(), 2015) + 5}
              rowHeight={YEAR_ROW_HEIGHT}
              visibleRows={VISIBLE_YEAR_ROWS}
              selectedYear={selectedDate.getFullYear()}
              onSelectYear={onSelectYear}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default PTScheduleScreen;

/* Styles */
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
  headerIcon: { width: 40, alignItems: 'flex-start' },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  greeting: { color: COLORS.onPrimary, fontWeight: '800', fontSize: 18 },
  headerSub: { color: '#C2F0D4', fontSize: 12, marginTop: 4 },
  todayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },

  calendarSection: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.outline,
  },

  monthYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  monthYearText: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },

  daysScrollContainer: { paddingHorizontal: 16, paddingBottom: 10 },
  dayContainer: {
    width: ITEM_WIDTH,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.outline,
    marginRight: 12,
  },
  selectedDayContainer: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  todayContainer: { borderColor: COLORS.primary, borderWidth: 2 },

  dayName: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  dayDate: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  selectedDayName: { color: '#C2F0D4' },
  selectedDayDate: { color: COLORS.onPrimary },
  todayText: { color: COLORS.primary },
  todayDot: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  body: { flex: 1 },
  daySummary: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
    backgroundColor: COLORS.surface,
  },
  daySummaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  daySummarySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  noticeBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outline,
    backgroundColor: COLORS.surface,
    minHeight: 80,
    justifyContent: 'center',
  },
  noticeText: { color: COLORS.textPrimary, fontSize: 15, lineHeight: 20 },
  noticeEmpty: { color: COLORS.textSecondary, fontStyle: 'italic' },

  /* Year picker rows */
  yearRow: {
    height: YEAR_ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  yearRowSelected: { backgroundColor: '#E7F8EE' },
  yearText: { fontSize: 16, color: '#222', fontWeight: '600' },
  yearTextSelected: { color: COLORS.primary, fontWeight: '800' },
});

/* Modal styles */
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialog: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#222' },
  closeBtn: { position: 'absolute', right: 10, top: 6, padding: 8 },
});
