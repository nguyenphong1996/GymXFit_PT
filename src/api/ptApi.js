// 📁 src/api/ptApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔹 Thay URL này bằng API thật của bạn:
const BASE_URL = 'https://gymxfit-api.azurewebsites.net/api/admin';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// 🔹 Thêm token tự động nếu có
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error),
);

// 🔹 Xử lý lỗi chung
const handleError = err => {
  console.error('PT API Error:', err);
  if (err.response?.data) {
    throw new Error(
      err.response.data.message || JSON.stringify(err.response.data),
    );
  }
  throw err;
};

// === 🟩 API functions ===

// 🔸 Lấy chi tiết PT
export const getPTDetail = async staffId => {
  try {
    const res = await api.get(`/staff/${staffId}`);
    return res.data?.data ?? res.data;
  } catch (err) {
    handleError(err);
  }
};

// 🔸 Cập nhật hồ sơ PT
export const updatePTProfile = async (staffId, body) => {
  try {
    const res = await api.patch(`/staff/${staffId}`, body);
    return res.data?.data ?? res.data;
  } catch (err) {
    handleError(err);
  }
};

// 🔸 Upload avatar
export const uploadPTAvatar = async (staffId, fileUri, mime = 'image/jpeg') => {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: fileUri,
      type: mime,
      name: `avatar_${Date.now()}.jpg`,
    });

    const res = await api.put(`/staff/${staffId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data ?? res.data;
  } catch (err) {
    handleError(err);
  }
};

// 🔸 Lấy danh sách kỹ năng
export const getAllSkills = async () => {
  try {
    const res = await api.get(`/skills`);
    return res.data?.data ?? res.data;
  } catch (err) {
    console.warn('⚠️ Không thể lấy skills từ server, dùng danh sách mặc định');
    return [
      { id: 1, name: 'Workout' },
      { id: 2, name: 'Cardio' },
      { id: 3, name: 'Stretching' },
      { id: 4, name: 'Nutrition' },
      { id: 5, name: 'Yoga' },
    ];
  }
};

// 🔸 Admin phê duyệt kỹ năng (nếu có quyền)
export const approvePTSkills = async (staffId, skills) => {
  try {
    const res = await api.patch(`/staff/${staffId}/skills/approve`, { skills });
    return res.data?.data ?? res.data;
  } catch (err) {
    handleError(err);
  }
};

export default {
  getPTDetail,
  updatePTProfile,
  uploadPTAvatar,
  getAllSkills,
  approvePTSkills,
};
