// 📁 src/screens/PT/PTProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PRIMARY_COLOR = '#30C451';
const LIGHT_GREEN = '#E8F9EF';

const PTProfileScreen = () => {
  const navigation = useNavigation();

  // 🔹 Dữ liệu mẫu (hiển thị tĩnh)
  const ptData = {
    name: 'Huấn luyện viên Nguyễn Văn Nam',
    email: 'namfit@example.com',
    phone: '0909 123 456',
    skills: ['Workout', 'Cardio', 'Stretching', 'Nutrition', 'Yoga'],
    avatar: null,
  };

  const specialty =
    ptData.skills && ptData.skills.length > 0 ? ptData.skills[0] : 'Chưa có';

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      {/* 🟩 Banner */}
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

        <Text style={styles.name}>{ptData.name}</Text>
        <Text style={styles.email}>{ptData.email}</Text>

        {/* 🟢 Info Box (Chuyên môn) */}
        <View style={styles.infoBox}>
          <View style={styles.statBoxFull}>
            <Text style={styles.statValue}>{specialty}</Text>
            <Text style={styles.statLabel}>Chuyên môn</Text>
          </View>
        </View>
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

      {/* 🔴 Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
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

export default PTProfileScreen;

/* === STYLES === */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

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

  /* ✅ Đồng bộ CSS vùng xanh với UpdatePTProfileScreen */
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
