import React, { useContext, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import { PTContext } from '../../context/PTContext';

const PRIMARY_COLOR = '#30C451';
const LIGHT_GREEN = '#E8F9EF';

const PTProfileScreenContent = ({ navigation }) => {
  const { ptInfo, logout, fetchProfile, loadingProfile } =
    useContext(PTContext);
  const [refreshing, setRefreshing] = useState(false);

  const profile = ptInfo || {};
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  const specialty = useMemo(() => {
    if (!skills.length) return 'Chưa có';
    const skill = skills[0];
    return skill
      ? skill.charAt(0).toUpperCase() + skill.slice(1)
      : 'Chưa có';
  }, [skills]);

  // Ẩn trạng thái skill để giao diện gọn gàng
  const skillUpdateStatus = null;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProfile();
    } catch (error) {
      Alert.alert('Lỗi', error?.message || 'Không thể tải hồ sơ PT.');
    } finally {
      setRefreshing(false);
    }
  }, [fetchProfile]);

  const handleLogout = () => {
    if (typeof logout !== 'function') {
      Alert.alert('Lỗi', 'Không thể đăng xuất, vui lòng thử lại sau.');
      return;
    }

    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert(
              'Lỗi',
              error?.message || 'Không thể đăng xuất, vui lòng thử lại.',
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* 🔙 Nút back góc trái không nền */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomePTScreen')}
      >
        <IconIon name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loadingProfile}
            onRefresh={handleRefresh}
            tintColor={PRIMARY_COLOR}
          />
        }
      >
        {/* 🟩 Banner */}
        <View style={styles.banner}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image style={styles.avatar} source={{ uri: profile.avatar }} />
            ) : (
              <View style={[styles.avatar, styles.iconAvatar]}>
                <IconMC name="account-circle" size={110} color="#A5D6A7" />
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {profile.name || 'Chưa cập nhật họ tên'}
          </Text>
          <Text style={styles.email}>{profile.email || 'Chưa có email'}</Text>

          {/* Trạng thái kỹ năng bỏ hiển thị để gọn gàng */}
        </View>

        {/* ⚙️ Danh mục chức năng */}
        <View style={styles.optionContainer}>
          <OptionItem
            iconLib="MI"
            icon="edit"
            text="Chỉnh sửa hồ sơ"
            onPress={() => navigation.navigate('UpdatePTProfileScreen')}
          />
          <OptionItem
            iconLib="Ion"
            icon="calendar-outline"
            text="Lịch làm việc"
            onPress={() => navigation.navigate('PTFreeScheduleScreen')}
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

        {/* 🔴 Nút đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconMI
            name="logout"
            size={22}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

/* === COMPONENT: OptionItem === */
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

const PTProfileScreen = props => <PTProfileScreenContent {...props} />;

export default PTProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  /* 🔙 Back icon */
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 20,
  },

  /* 🟢 HEADER mới */
  banner: {
    backgroundColor: '#20B24A',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },

  avatarContainer: { marginBottom: 15 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#E8F5E9',
  },
  iconAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 10 },
  email: { fontSize: 14, color: '#E0FFE8', marginBottom: 20 },

  /* 🟢 Info Box (stats) */
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#1A9E42',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '85%',
  },

  statBoxFull: { alignItems: 'center', flex: 1 },
  statValue: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  skillStatus: {
    color: '#FBE9A7',
    marginTop: 8,
    fontSize: 13,
  },
  /* ⚙️ Options */
  optionContainer: { marginTop: 15, paddingHorizontal: 20 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    color: '#212121',
    fontWeight: '500',
    marginLeft: 15,
  },

  /* 🔴 Logout */
  logoutButton: {
    backgroundColor: '#20B24A',
    marginHorizontal: 30,
    marginTop: 40,
    marginBottom: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    elevation: 3,
    shadowColor: '#0F6427',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
