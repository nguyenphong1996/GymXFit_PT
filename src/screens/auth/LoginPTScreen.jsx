import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { requestLoginOtp } from '@api/ptApi';
import { PTContext } from '@context/PTContext';
import { useToast } from '@context/ToastContext';
import translateStaffAuthError from '../../utils/translateStaffAuthError';

const LoginPTScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useContext(PTContext);
  const { showToast } = useToast();

  const handleLogin = async () => {
    const trimmedNumber = mobileNumber.trim();
    if (!trimmedNumber) {
      showToast({
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập số điện thoại.',
      });
      return;
    }
    if (trimmedNumber.length !== 10) {
      showToast({
        type: 'warning',
        title: 'Số điện thoại chưa hợp lệ',
        message: 'Số điện thoại phải gồm đúng 10 chữ số.',
      });
      return;
    }

    const requestOtp = async (purpose, successMessage) => {
      await requestLoginOtp(trimmedNumber, purpose);
      const otpMessage =
        successMessage || 'Mã OTP đã được gửi đến số điện thoại của bạn.';
      showToast({
        type: purpose === 'first_login' ? 'warning' : 'success',
        title: 'Thành công',
        message: otpMessage,
      });
      navigation.navigate('VerifyLoginScreen', {
        phone: trimmedNumber,
        purpose,
      });
    };

    setIsLoading(true);
    try {
      await requestOtp('login');
      return;
    } catch (error) {
      if (error?.code === 'staff_not_verified') {
        try {
          await requestOtp(
            'first_login',
            'Đây là lần đăng nhập đầu tiên, mã OTP kích hoạt đã được gửi.',
          );
          return;
        } catch (firstLoginError) {
          showToast({
            type: 'error',
            title: 'Đăng nhập thất bại',
            message: translateStaffAuthError(firstLoginError),
          });
          await logout();
          return;
        }
      }

      showToast({
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: translateStaffAuthError(error),
      });
      await logout(); // reset PTContext nếu login thất bại
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.loginText}>Đăng nhập PT</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="smartphone"
          size={24}
          color="#20B24A"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <MaterialIcons name="login" size={22} color="#fff" />
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginPTScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: { width: 200, height: 100, marginBottom: 20 },
  loginText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#20B24A',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  button: {
    backgroundColor: '#20B24A',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: '#A5D6A7' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
