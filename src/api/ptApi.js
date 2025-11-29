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
export async function verifyLoginOtp(phoneNumber, code, purpose = 'login') {
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

// ✏️ Cập nhật hồ sơ PT (không bao gồm skills/avatar)
export async function updateProfile(payload = {}) {
  try {
    const response = await createAxiosInstance().put(
      '/api/staff/profile',
      payload,
    );
    return response;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Không thể cập nhật hồ sơ PT.';
    const customError = new Error(message);
    if (status) customError.status = status;
    if (error.response?.data?.error) {
      customError.code = error.response.data.error;
    }
    throw customError;
  }
}

// 🛠️ Gửi yêu cầu cập nhật kỹ năng (cần admin duyệt)
export async function requestSkillUpdate(skills = []) {
  try {
    const response = await createAxiosInstance().put(
      '/api/staff/profile/skills',
      { skills },
    );
    return response;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Không thể gửi yêu cầu cập nhật kỹ năng.';
    const customError = new Error(message);
    if (status) customError.status = status;
    if (error.response?.data?.error) {
      customError.code = error.response.data.error;
    }
    throw customError;
  }
}

// 🖼️ Cập nhật avatar PT
export async function updateAvatar(formData) {
  try {
    const response = await createAxiosInstance(
      'multipart/form-data',
    ).put('/api/staff/profile/avatar', formData);
    return response;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Không thể cập nhật ảnh đại diện.';
    const customError = new Error(message);
    if (status) customError.status = status;
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

  // Parse the QR value to extract the JSON data
  let parsedQrValue;
  try {
    parsedQrValue = JSON.parse(qrValue);
  } catch (error) {
    throw new Error('Mã QR không hợp lệ - Không thể phân tích dữ liệu.');
  }

  const payload = {
    qrValue: qrValue, // Send the raw string as expected by the API
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

// 📋 Lấy danh sách lớp học được giao cho PT
export async function getAssignedClasses(params = {}) {
  try {
    const response = await createAxiosInstance().get('/api/staff/classes', {
      params: {
        ...params,
        cacheBust: Date.now(),
      },
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Không thể tải danh sách lớp học được giao.';
    const customError = new Error(message);
    if (error.response?.data?.error) {
      customError.code = error.response.data.error;
    }
    if (error.response?.status) {
      customError.status = error.response.status;
    }
    throw customError;
  }
}

// 🔍 Kiểm tra xem PT có được giao lớp học cụ thể không
export async function verifyClassAssignment(classId) {
  if (!classId) {
    throw new Error('Thiếu mã lớp học để kiểm tra phân công.');
  }

  try {
    const response = await createAxiosInstance().get(
      `/api/staff/classes/${classId}/verify-assignment`,
    );
    return response;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      (status === 403
        ? 'Bạn không được phân công dạy lớp này.'
        : status === 404
        ? 'Không tìm thấy lớp học.'
        : error.message) ||
      'Không thể kiểm tra phân công lớp học.';

    const customError = new Error(message);
    if (error.response?.data?.error) {
      customError.code = error.response.data.error;
    }
    if (status) {
      customError.status = status;
    }
    throw customError;
  }
}

// 📊 Lấy thông tin chi tiết lớp học của PT
export async function getClassDetail(classId) {
  if (!classId) {
    throw new Error('Thiếu mã lớp học để lấy thông tin chi tiết.');
  }

  try {
    const response = await createAxiosInstance().get(
      `/api/staff/classes/${classId}`,
    );
    return response;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      (status === 403
        ? 'Bạn không có quyền xem thông tin lớp này.'
        : status === 404
        ? 'Không tìm thấy lớp học.'
        : error.message) ||
      'Không thể tải thông tin lớp học.';

    const customError = new Error(message);
    if (error.response?.data?.error) {
      customError.code = error.response.data.error;
    }
    if (status) {
      customError.status = status;
    }
    throw customError;
  }
}
