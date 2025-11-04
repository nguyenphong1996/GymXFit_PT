// src/screens/PT/PTProfileScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getPTDetail, loadTokenFromStorage, setAuthToken } from '@api/ptApi';

const PRIMARY_COLOR = '#30C451';
const LIGHT_GREEN = '#E8F9EF';

/**
 * LƯU Ý:
 * - staffId: bạn cần truyền staffId từ context/asyncStorage/auth state hoặc params
 * - Ở đây mình demo staffId lấy từ AsyncStorage key 'staffId' (bạn có thể thay đổi).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PTProfileScreen = () => {
  const navigation = useNavigation();
  const [ptData, setPtData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // hàm lấy staffId từ AsyncStorage (bạn có thể dùng context)
  const getStaffIdFromStorage = async () => {
    try {
      const id = await AsyncStorage.getItem('staffId');
      return id || null;
    } catch (err) {
      console.warn('getStaffIdFromStorage', err);
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // load token nếu bạn lưu trong storage (tuỳ project)
      await loadTokenFromStorage();
      const staffId = await getStaffIdFromStorage();
      if (!staffId) {
        Alert.alert('Lỗi', 'Không tìm thấy staffId. Vui lòng đăng nhập lại.');
        setPtData(null);
        return;
      }
      const res = await getPTDetail(staffId);
      /**
       * res structure tuỳ backend. Mình giả định backend trả về object { id, name, email, phone, avatar, skills }
       */
      setPtData(res);
    } catch (err) {
      console.error('fetchData error', err);
      Alert.alert('Lỗi', 'Không thể tải thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (!ptData) {
    return (
      <View style={styles.loadingWrap}>
        <Text>Không có dữ liệu huấn luyện viên.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
          <Text style={styles.retryText}>Tải lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const specialty =
    ptData.skills && ptData.skills.length > 0 ? ptData.skills[0] : 'Chưa có';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={PRIMARY_COLOR}
        />
      }
    >
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.avatarContainer}>
          {ptData.avatar ? (
            <Image style={styles.avatar} source={{ uri: ptData.avatar }} />
          ) : (
            <View style={[styles.avatar, styles.iconAvatar]}>
              <IconMC name="account-circle" size={110} color="#A5D6A7" />
            </View>
          )}
        </View>

        <Text style={styles.name}>{ptData.name || '---'}</Text>
        <Text style={styles.email}>{ptData.email || '---'}</Text>

        <View style={styles.infoBox}>
          <View style={styles.statBoxFull}>
            <Text style={styles.statValue}>{specialty}</Text>
            <Text style={styles.statLabel}>Chuyên môn</Text>
          </View>
        </View>
      </View>

      {/* options */}
      <View style={styles.optionContainer}>
        <OptionItem
          iconLib="MI"
          icon="edit"
          text="Chỉnh sửa hồ sơ"
          onPress={() =>
            navigation.navigate('UpdatePTProfileScreen', { ptData })
          }
        />
        <OptionItem
          iconLib="Ion"
          icon="calendar-outline"
          text="Lịch làm việc"
          onPress={() => {}}
        />
        <OptionItem
          iconLib="MI"
          icon="group"
          text="Danh sách học viên"
          onPress={() => {}}
        />
        <OptionItem
          iconLib="Ion"
          icon="document-text-outline"
          text="Hợp đồng huấn luyện"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          // ví dụ logout: clear token + go to login
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('staffId');
          setAuthToken(null);
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      >
        <IconMI
          name="logout"
          size={22}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const OptionItem = ({ iconLib, icon, text, onPress }) => {
  const IconSet =
    iconLib === 'MC' ? IconMC : iconLib === 'MI' ? IconMI : IconIon;
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <IconSet name={icon} size={26} color={PRIMARY_COLOR} />
      <Text style={styles.optionText}>{text}</Text>
      <IconMI name="chevron-right" size={26} color="#A0A0A0" />
    </TouchableOpacity>
  );
};

export default PTProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryBtn: {
    marginTop: 12,
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },

  banner: {
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15,
  },
  avatarContainer: { marginBottom: 10 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#fff',
  },
  iconAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginTop: 5,
  },
  email: { fontSize: 14, color: '#555', marginBottom: 10 },

  infoBox: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '85%',
    alignItems: 'center',
  },
  statBoxFull: { alignItems: 'center', width: '100%' },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  statLabel: {
    color: '#E8F9EF',
    fontSize: 13,
    marginTop: 3,
    textAlign: 'center',
  },

  optionContainer: { marginTop: 10, paddingHorizontal: 20 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    marginLeft: 15,
  },

  logoutButton: {
    backgroundColor: '#E53935',
    marginHorizontal: 30,
    marginTop: 35,
    marginBottom: 50,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    elevation: 3,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
