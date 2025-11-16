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
import PTBottomScanBar from '../../components/PTBottomScanBar';

const HomePTScreen = ({ navigation }) => {
  React.useEffect(() => {
    // Ẩn thanh trạng thái & thanh điều hướng để hiển thị toàn màn hình
    StatusBar.setHidden(true);
    if (Platform.OS === 'android') SystemNavigationBar.stickyImmersive();

    // Khi thoát khỏi màn hình, hiện lại thanh điều hướng
    return () => {
      if (Platform.OS === 'android') SystemNavigationBar.navigationShow();
    };
  }, []);

  // Danh sách các nút chức năng chính
  const buttons = [
    { title: 'Hồ sơ PT', icon: 'person', screen: 'PTProfileScreen' },
    { title: 'Lịch PT', icon: 'calendar-today', screen: 'PTScheduleScreen' },
    {
      title: 'Lịch trống PT',
      icon: 'event-available',
      screen: 'PTFreeScheduleScreen', // ✅ Khi nhấn sẽ chuyển đến màn hình này
    },
    { title: 'Khách hàng', icon: 'groups', screen: 'PTCustomerListScreen' },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {/* 🟩 Header gồm logo và nút quét QR */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image
              source={require('@assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>GymXFit PT</Text>
          </View>

          {/* 🟩 Nút QR ở góc phải */}
          <TouchableOpacity
            style={styles.qrButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('QrScannerModel')} // ✅ Chuyển đến QrScannerModel
          >
            <Icon name="qr-code-scanner" size={28} color="#20B24A" />
          </TouchableOpacity>
        </View>

        {/* 🟩 Lời chào */}
        <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
        <Text style={styles.subnote}>
          Chọn chức năng để bắt đầu công việc hôm nay
        </Text>

        {/* 🟩 Danh sách các nút chức năng */}
        <View style={styles.buttonContainer}>
          {buttons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(btn.screen)}
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

      <PTBottomScanBar
        onScanPress={() => navigation.navigate('QrScannerModel')}
      />
    </View>
  );
};

export default HomePTScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAF9' },
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#20B24A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qrButton: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 10,
    elevation: 3,
    shadowColor: '#20B24A',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
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
