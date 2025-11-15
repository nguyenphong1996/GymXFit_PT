// 📁 src/api/ptApi.js
import createAxiosInstance from '@api/axiosInstance';

// 📨 Gửi OTP đăng nhập cho PT
export async function requestLoginOtp(phoneNumber, purpose = 'login') {
  try {
    const response = await createAxiosInstance().post(
      '/api/staff/auth/request-otp',
      {
        phone: phoneNumber,
        purpose,
      },
    );
    return response;
  } catch (error) {
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      'Không thể gửi mã OTP, vui lòng thử lại.';
    const customError = new Error(errorMessage);
    if (errorData?.error) {
      customError.code = errorData.error;
    }
    throw customError;
  }
}

// ✅ Xác thực OTP đăng nhập PT
export async function verifyLoginOtp(
  phoneNumber,
  code,
  purpose = 'login',
) {
  try {
    const response = await createAxiosInstance().post(
      '/api/staff/auth/verify-otp',
      {
        phone: phoneNumber,
        code,
        purpose,
      },
    );
    return response;
  } catch (error) {
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      'Mã OTP không hợp lệ hoặc đã hết hạn.';
    const customError = new Error(errorMessage);
    if (errorData?.error) {
      customError.code = errorData.error;
    }
    throw customError;
  }
}

// 👤 Lấy thông tin hồ sơ PT
export async function getProfile() {
  try {
    const response = await createAxiosInstance().get('/api/pt/profile');
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Không thể tải thông tin PT.';
    throw new Error(errorMessage);
  }
}
