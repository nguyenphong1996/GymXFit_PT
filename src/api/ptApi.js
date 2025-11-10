// 📁 src/api/ptApi.js
import createAxiosInstance from '@api/axiosInstance';

// 📨 Gửi OTP đăng nhập cho PT
export async function requestLoginOtp(phoneNumber) {
  try {
    const response = await createAxiosInstance().post('/api/auth/login', {
      phone: phoneNumber,
    });
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Không thể gửi mã OTP, vui lòng thử lại.';
    console.error('requestLoginOtp ERROR:', errorMessage);
    throw new Error(errorMessage);
  }
}

// ✅ Xác thực OTP đăng nhập PT
export async function verifyLoginOtp(phoneNumber, code) {
  try {
    const response = await createAxiosInstance().post('/api/auth/verify-login', {
      phone: phoneNumber,
      code: code,
    });
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.';
    console.error('verifyLoginOtp ERROR:', errorMessage);
    throw new Error(errorMessage);
  }
}

// // 👤 Lấy thông tin hồ sơ PT
// export async function getProfile() {
//   try {
//     const response = await createAxiosInstance().get('/api/pt/profile');
//     return response;
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || 'Không thể tải thông tin PT.';
//     console.error('getProfile ERROR:', errorMessage);
//     throw new Error(errorMessage);
//   }
// }
