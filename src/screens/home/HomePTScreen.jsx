// 📁 src/screens/PT/HomePTScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const HomePTScreen = ({ navigation }) => {
  React.useEffect(() => {
    // Ẩn thanh trạng thái & điều hướng để giao diện toàn màn hình
    StatusBar.setHidden(true);
    if (Platform.OS === 'android') SystemNavigationBar.stickyImmersive();

    return () => {
      if (Platform.OS === 'android') SystemNavigationBar.navigationShow();
    };
  }, []);

  // Danh sách các nút chức năng
  const buttons = [
    { title: 'Hồ sơ PT', icon: 'person', screen: 'PTProfileScreen' },
    { title: 'Lịch PT', icon: 'calendar-today', screen: 'PTScheduleScreen' },
    {
      title: 'Lịch trống PT',
      icon: 'event-available',
      screen: 'PTFreeScheduleScreen',
    }, // 🟩 Nút mới
    { title: 'Khách hàng', icon: 'groups', screen: 'PTCustomerListScreen' },
  ];

  return (
    <View style={styles.container}>
      {/* Logo và tiêu đề */}
      <View style={styles.header}>
        <Image
          source={require('@assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>GymXFit PT</Text>
      </View>

      {/* Lời chào */}
      <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
      <Text style={styles.subnote}>
        Chọn chức năng để bắt đầu công việc hôm nay
      </Text>

      {/* Danh sách nút */}
      <View style={styles.buttonContainer}>
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuButton}
            onPress={() => navigation.navigate(btn.screen)}
            activeOpacity={0.85}
          >
            <View style={styles.iconWrapper}>
              <Icon name={btn.icon} size={26} color="#20B24A" />
            </View>
            <Text style={styles.menuText}>{btn.title}</Text>
            <Icon name="arrow-forward-ios" size={18} color="#888" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomePTScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 150,
    height: 60,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#20B24A',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  subnote: {
    fontSize: 14,
    color: '#777',
    marginBottom: 28,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },
});
