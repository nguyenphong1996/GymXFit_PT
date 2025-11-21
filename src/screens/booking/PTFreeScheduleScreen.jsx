// PTFreeScheduleScreen.js
// Material Design 3 calendar — Full screen component with Year Picker modal
// Reference screenshot (for visual parity): /mnt/data/65241b0b-3600-4a9c-a01d-790747fe36b8.png

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
  Modal,
  Pressable,
  Alert,
  RefreshControl,
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

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = 64;

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

const formatDateKey = date => {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

/* DayItem component (horizontal pill) */
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

const PTFreeScheduleScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const todayRef = useRef(new Date());
  todayRef.current.setHours(0, 0, 0, 0);

  const flatListRef = useRef(null);

  // mode determines whether the "Month label" shows month or week label
  const [mode, setMode] = useState('week'); // 'week' or 'month'

  // currentMonth is first day of month being viewed
  const [currentMonth, setCurrentMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  // selectedDate is full Date object for currently selected day
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // index of selected date inside daysForMonth
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // modal for year picker
  const [yearModalVisible, setYearModalVisible] = useState(false);

  // slots & selections
  const [selectedSlots, setSelectedSlots] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const slots = [
    { label: 'Ca 1 (06:00 - 10:00)', key: 'Ca 1' },
    { label: 'Ca 2 (10:00 - 12:00)', key: 'Ca 2' },
    { label: 'Ca 3 (14:00 - 17:00)', key: 'Ca 3' },
    { label: 'Ca 4 (17:00 - 21:00)', key: 'Ca 4' },
  ];

  // helper: number of days in a month
  const daysInMonthCount = useCallback((year, month) => {
    // month: 0-11
    return new Date(year, month + 1, 0).getDate();
  }, []);

  // build days for currentMonth (array of day objects)
  const daysForMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const total = daysInMonthCount(year, month);
    const arr = [];
    for (let i = 1; i <= total; i++) {
      const d = new Date(year, month, i);
      d.setHours(0, 0, 0, 0);
      arr.push({
        id: `${d.getTime()}`,
        index: i - 1,
        dateObj: d,
        dayNumber: d.getDate(),
        label: dayNames[d.getDay()],
        isToday: isSameDay(d, todayRef.current),
      });
    }
    return arr;
  }, [currentMonth, daysInMonthCount]);

  // when daysForMonth or selectedDate changes, update index and scroll
  useEffect(() => {
    // find index of selectedDate in daysForMonth
    const idx = daysForMonth.findIndex(d => isSameDay(d.dateObj, selectedDate));
    if (idx >= 0) {
      setSelectedDateIndex(idx);
      // scroll to index
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: idx,
          animated: true,
          viewPosition: 0.5,
        });
      }, 50);
      return;
    }

    // if selectedDate not in this month, keep same day number
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
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysForMonth]);

  // Helper to toggle slot for selected date
  const toggleSlot = useCallback((dateKey, slotKey) => {
    setSelectedSlots(prev => {
      const current = prev[dateKey] || [];
      const updated = current.includes(slotKey)
        ? current.filter(s => s !== slotKey)
        : [...current, slotKey];
      return { ...prev, [dateKey]: updated };
    });
  }, []);

  const handleSave = useCallback(() => {
    const key = formatDateKey(selectedDate);
    const chosen = selectedSlots[key] || [];
    if (chosen.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 ca rảnh để lưu.');
      return;
    }
    Alert.alert(
      'Đã lưu lịch rảnh',
      `Ngày ${key}
Các ca rảnh: ${chosen.join(', ')}
Thông tin đã gửi đến Admin.`,
    );
  }, [selectedDate, selectedSlots]);

  // month navigation: previous/next month (handles year rollover)
  const goToPreviousMonth = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const newMonthDate = new Date(year, month - 1, 1);
    setCurrentMonth(newMonthDate);

    // try to keep same day number
    const desiredDay = selectedDate.getDate();
    const maxDays = daysInMonthCount(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth(),
    );
    const clampedDay = Math.min(desiredDay, maxDays);
    const newSelected = new Date(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth(),
      clampedDay,
    );
    newSelected.setHours(0, 0, 0, 0);
    setSelectedDate(newSelected);
  }, [currentMonth, selectedDate, daysInMonthCount]);

  const goToNextMonth = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const newMonthDate = new Date(year, month + 1, 1);
    setCurrentMonth(newMonthDate);

    // try to keep same day number
    const desiredDay = selectedDate.getDate();
    const maxDays = daysInMonthCount(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth(),
    );
    const clampedDay = Math.min(desiredDay, maxDays);
    const newSelected = new Date(
      newMonthDate.getFullYear(),
      newMonthDate.getMonth(),
      clampedDay,
    );
    newSelected.setHours(0, 0, 0, 0);
    setSelectedDate(newSelected);
  }, [currentMonth, selectedDate, daysInMonthCount]);

  const goToToday = useCallback(() => {
    const today = new Date(todayRef.current);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }, []);

  // Press a day pill
  const handlePressDay = useCallback(dayItem => {
    setSelectedDate(dayItem.dateObj);
    setSelectedDateIndex(dayItem.index);
    // ensure center
    flatListRef.current?.scrollToIndex({
      index: dayItem.index,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  // Renderers
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

  // Derived values for header label
  const currentMonthLabel = `${
    currentMonth.getMonth() + 1
  }/${currentMonth.getFullYear()}`;

  // dateKey for selectedDate
  const dateKey = formatDateKey(selectedDate);
  const selectedForDay = selectedSlots[dateKey] || [];

  // handle refresh (kept simple)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700); // simulate refresh
  }, []);

  // Year modal constants
  const ROW_HEIGHT = 56; // each year row height
  const VISIBLE_ROWS = 7; // visible rows in modal (approx.)

  // Year list will be lazy-loaded (append more years when reaching end)
  // initial start=2015, initialEnd = currentYear + 5
  const initialStartYear = 2015;
  const initialEndYear =
    Math.max(new Date().getFullYear(), initialStartYear) + 5;

  // We'll keep the years in state inside YearPickerList (see component below)

  const onSelectYear = useCallback(
    year => {
      // Keep same month; clamp day
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

  // when layout or data changes, ensure FlatList has valid initial scroll
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
          <Text style={styles.headerSub}>Chọn ngày & ca rảnh</Text>
        </View>

        <View style={{ width: 40 }}>
          <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
            <Icon name="today" size={20} color={COLORS.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar area */}
      <View style={styles.calendarSection}>
        {/* month navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.calendarNavButton}
            onPress={goToPreviousMonth}
          >
            <Icon name="chevron-left" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.monthYearButton}
            onPress={() => setYearModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.monthYearText}>
              {`${
                fullDayNames[selectedDate.getDay()]
              }, ${selectedDate.getDate()}/${
                selectedDate.getMonth() + 1
              }/${selectedDate.getFullYear()}`}
            </Text>
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

        {/* Horizontal days for current month only */}
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
            // fallback when scrollToIndex fails
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

      {/* Body: slots and actions */}
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
          <Text style={styles.daySummarySubtitle}>Chọn ca rảnh trong ngày</Text>
        </View>

        <View style={styles.slotSection}>
          {slots.map((slot, i) => {
            const isSelected = selectedForDay.includes(slot.key);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.slotCard, isSelected && styles.slotCardSelected]}
                onPress={() => toggleSlot(dateKey, slot.key)}
                activeOpacity={0.8}
              >
                <View style={styles.slotCardContent}>
                  <Icon
                    name="schedule"
                    size={18}
                    color={isSelected ? COLORS.onPrimary : COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.slotLabel,
                      isSelected && { color: COLORS.onPrimary },
                    ]}
                  >
                    {slot.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu lịch rảnh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Year picker modal (centered dialog) */}
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
          <Pressable
            style={[
              modalStyles.dialog,
              { maxHeight: ROW_HEIGHT * VISIBLE_ROWS + 72 },
            ]}
            onPress={() => {}}
          >
            {/* Header */}
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

            {/* Year list (infinite / lazy load) */}
            <YearPickerList
              startYear={initialStartYear}
              initialEndYear={initialEndYear}
              rowHeight={ROW_HEIGHT}
              visibleRows={VISIBLE_ROWS}
              selectedYear={selectedDate.getFullYear()}
              onSelectYear={onSelectYear}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default PTFreeScheduleScreen;

/* Styles (kept close to your original) */
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
  headerSub: {
    color: COLORS.primaryContainer || '#C2F0D4',
    fontSize: 12,
    marginTop: 4,
  },
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
  selectedDayName: { color: COLORS.primaryContainer || '#C2F0D4' },
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

  slotSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  slotCard: {
    backgroundColor: '#F2FBF6',
    borderWidth: 1,
    borderColor: '#CFF1D9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  slotCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotCardContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  slotLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },

  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: { color: COLORS.onPrimary, fontWeight: '800', fontSize: 16 },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialog: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  closeBtn: { position: 'absolute', right: 10, top: 8, padding: 8 },
  listContainer: { paddingVertical: 6 },
  yearRow: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  yearRowSelected: { backgroundColor: '#E7F8EE' },
  yearText: { fontSize: 16, color: '#222', fontWeight: '600' },
  yearTextSelected: { color: COLORS.primary, fontWeight: '800' },
});

/* ---------------------------
   YearPickerList component
   - startYear: number (e.g. 2015)
   - initialEndYear: number (e.g. currentYear + 5)
   - rowHeight: number
   - visibleRows: number
   - selectedYear: number
   - onSelectYear(year)
   --------------------------- */
const YearPickerList = ({
  startYear = 2015,
  initialEndYear = new Date().getFullYear() + 5,
  rowHeight = 56,
  visibleRows = 7,
  selectedYear,
  onSelectYear,
}) => {
  // keep years in local state so we can append more when reaching end
  const [years, setYears] = useState(() => {
    const arr = [];
    for (let y = startYear; y <= initialEndYear; y++) arr.push(y);
    return arr;
  });

  const listRef = useRef(null);
  const [isAppending, setIsAppending] = useState(false);

  // When the modal opens, scroll to the selected year (if present)
  useEffect(() => {
    if (!listRef.current) return;
    const idx = years.findIndex(y => y === selectedYear);
    if (idx >= 0) {
      // center the selected item
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: idx,
          animated: false,
          viewPosition: 0.5,
        });
      }, 40);
    } else {
      // if selected year not in current list, expand until it is
      if (selectedYear < years[0]) {
        // prepend years (rare for your use-case)
        const newStart = Math.max(startYear, selectedYear - 10);
        const prepend = [];
        for (let y = newStart; y < years[0]; y++) prepend.push(y);
        setYears(prev => [...prepend, ...prev]);
        setTimeout(() => {
          const newIdx = years.findIndex(y => y === selectedYear);
          if (newIdx >= 0) {
            listRef.current?.scrollToIndex({
              index: newIdx,
              animated: false,
              viewPosition: 0.5,
            });
          }
        }, 60);
      } else if (selectedYear > years[years.length - 1]) {
        // append until selectedYear in list
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
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const appendMore = useCallback(() => {
    if (isAppending) return;
    setIsAppending(true);
    // append next 10 years
    setTimeout(() => {
      setYears(prev => {
        const last = prev[prev.length - 1];
        const next = [];
        for (let y = last + 1; y <= last + 10; y++) next.push(y);
        return [...prev, ...next];
      });
      setIsAppending(false);
    }, 120);
  }, [isAppending]);

  const renderItem = useCallback(
    ({ item }) => {
      const isCurrent = item === selectedYear;
      return (
        <TouchableOpacity
          style={[
            modalStyles.yearRow,
            isCurrent && modalStyles.yearRowSelected,
          ]}
          activeOpacity={0.8}
          onPress={() => onSelectYear(item)}
        >
          <Text
            style={[
              modalStyles.yearText,
              isCurrent && modalStyles.yearTextSelected,
            ]}
          >
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
      onEndReachedThreshold={0.5}
      onEndReached={appendMore}
      initialNumToRender={visibleRows + 2}
      nestedScrollEnabled
    />
  );
};
