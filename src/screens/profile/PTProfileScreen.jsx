import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PTProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert('Xác nhận đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => navigation.replace('LoginScreen'),
      },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('UpdatePTProfileScreen');
  };

  const handleGoHome = () => {
    navigation.navigate('HomePTScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* 🔙 Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
        <Icon name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>

      {/* 👤 Icon đại diện */}
      <View style={styles.avatarCircle}>
        <Icon name="person" size={80} color="#20B24A" />
      </View>

      {/* 👨‍🏫 Thông tin PT */}
      <Text style={styles.name}>Nguyễn Văn A</Text>
      <Text style={styles.phone}>📞 0912345678</Text>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Icon name="fitness-center" size={22} color="#20B24A" />
          <Text style={styles.infoText}>Kinh nghiệm: 5 năm</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="check-circle" size={22} color="#20B24A" />
          <Text style={styles.infoText}>Chuyên môn: Giảm mỡ, Tăng cơ</Text>
        </View>
      </View>

      {/* ✏️ Nút chỉnh sửa */}
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Icon name="edit" size={20} color="#fff" />
        <Text style={styles.buttonText}>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>

      {/* 🚪 Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PTProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 5,
  },
  avatarCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 15,
    color: '#000',
  },
  phone: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  infoBox: {
    width: '90%',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
    backgroundColor: '#20B24A',
    paddingVertical: 14,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
