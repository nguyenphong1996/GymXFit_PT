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
    const response = await createAxiosInstance().get('/api/staff/profile');
    return response;
  } catch (error) {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Không thể tải thông tin PT.';
    const customError = new Error(errorMessage);
    if (status) {
      customError.status = status;
    }
    if (error.response?.data?.error) {
      customError.code = error.response.data.error;
    }
    throw customError;
  }
}

const serializeQrValue = value => {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const normalizeScanError = error => {
  const data = error.response?.data;
  const status = error.response?.status;
  const message =
    data?.message ||
    data?.error ||
    (status === 404
      ? 'Không tìm thấy lớp học tương ứng với mã QR.'
      : error.message) ||
    'Không thể điểm danh bằng QR.';

  const customError = new Error(message);
  if (data?.error) {
    customError.code = data.error;
  }
  if (status) {
    customError.status = status;
  }
  return customError;
};

export async function scanAttendance({ classId, qrValue }) {
  if (!classId) {
    throw new Error('Thiếu mã lớp học trong QR.');
  }
  if (!qrValue) {
    throw new Error('Không đọc được dữ liệu QR.');
  }

  const payload = {
    qrValue: serializeQrValue(qrValue),
  };

  const axiosInstance = createAxiosInstance();

  try {
    const response = await axiosInstance.post(
      `/api/staff/classes/${classId}/attendance/scan`,
      payload,
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 404) {
      try {
        const fallbackResponse = await axiosInstance.post(
          '/api/staff/classes/attendance/scan',
          {
            ...payload,
            classId,
          },
        );
        return fallbackResponse;
      } catch (fallbackError) {
        throw normalizeScanError(fallbackError);
      }
    }

    throw normalizeScanError(error);
  }
}
