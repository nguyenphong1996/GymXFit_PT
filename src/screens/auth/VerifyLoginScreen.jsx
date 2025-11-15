import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { verifyLoginOtp } from '@api/ptApi';
import { PTContext } from '@context/PTContext';
import { useToast } from '@context/ToastContext';
import translateStaffAuthError from '../../utils/translateStaffAuthError';

const VerifyLoginScreen = ({ navigation }) => {
  const route = useRoute();
  const { phone, purpose = 'login' } = route.params || {};
  const { login } = useContext(PTContext);
  const { showToast } = useToast();

  const [code, setCode] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (text, index) => {
    const char = text.replace(/[^0-9]/g, '').slice(0, 1);
    setCode(prev => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleContinue = async () => {
    if (!phone) {
      showToast({
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Thiếu số điện thoại để xác minh OTP.',
      });
      return;
    }
    const otp = code.join('');
    if (otp.length !== 4) {
      showToast({
        type: 'warning',
        title: 'OTP chưa đủ 4 số',
        message: 'Vui lòng nhập chính xác 4 chữ số.',
      });
      return;
    }

    Keyboard.dismiss();
    setIsVerifying(true);
    try {
      const response = await verifyLoginOtp(phone, otp, purpose);
      const token = response?.token;
      const user = response?.user || response?.staff;
      const normalizedRole =
        typeof user?.role === 'string' ? user.role.toLowerCase() : null;

      if (
        !token ||
        (normalizedRole &&
          normalizedRole !== 'pt' &&
          normalizedRole !== 'staff')
      ) {
        throw new Error('Không tìm thấy PT hoặc tài khoản không hợp lệ.');
      }

      await login(token, user);
      showToast({
        type: 'success',
        title: 'Đăng nhập thành công',
        message: 'Chào mừng bạn trở lại GymXFit!',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: translateStaffAuthError(error),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!phone)
    return (
      <View style={styles.missingPhoneContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="red" />
        <Text style={styles.missingPhoneText}>
          Thiếu thông tin số điện thoại. Vui lòng quay lại.
        </Text>
        <TouchableOpacity
          style={styles.backToLoginButton}
          onPress={() => navigation.navigate('LoginPTScreen')}
        >
          <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('LoginPTScreen')}
        >
          <Ionicons name="arrow-back-outline" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Xác minh</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('LoginPTScreen')}
        >
          <Ionicons name="close-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Nhập mã gồm 4 chữ số mà GymXFit vừa gửi đến {phone}
        </Text>
        <View style={styles.inputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => (inputsRef.current[index] = el)}
              style={styles.input}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isVerifying && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Tiếp tục</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: { backgroundColor: '#A5D6A7' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerButton: { padding: 10 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    height: 55,
    width: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  missingPhoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  missingPhoneText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  backToLoginButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backToLoginText: { color: '#fff', fontSize: 16 },
});

export default VerifyLoginScreen;
