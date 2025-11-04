// src/api/ptApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Chỉnh lại API_BASE thành host backend của bạn
 * Ví dụ: https://api.yourdomain.com hoặc http://10.0.2.2:3000
 */
const API_BASE = 'https://yourdomain.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// helper: set token (gọi khi user login hoặc từ AsyncStorage)
export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// optional: load token từ AsyncStorage (nếu bạn lưu token ở đó)
export const loadTokenFromStorage = async (storageKey = 'authToken') => {
  try {
    const token = await AsyncStorage.getItem(storageKey);
    if (token) setAuthToken(token);
    return token;
  } catch (err) {
    console.warn('loadTokenFromStorage error', err);
    return null;
  }
};

/* ===== API methods ===== */

// GET chi tiết PT
export const getPTDetail = async staffId => {
  if (!staffId) throw new Error('staffId is required');
  const { data } = await api.get(`/api/admin/staff/${staffId}`);
  return data;
};

// PUT upload avatar (multipart/form-data)
export const uploadPTAvatar = async (staffId, image) => {
  // image: { uri, name?, type? } -> chúng ta chuẩn hoá
  if (!staffId) throw new Error('staffId is required');
  if (!image || !image.uri) throw new Error('image.uri is required');

  const formData = new FormData();
  const fileName = image.fileName || image.name || 'avatar.jpg';
  const mimeType = image.type || 'image/jpeg';

  formData.append('avatar', {
    uri: image.uri,
    name: fileName,
    type: mimeType,
  });

  const { data } = await api.put(
    `/api/admin/staff/${staffId}/avatar`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return data;
};

// PATCH approve/update skills (tùy API backend, ở đây gửi skills list)
export const updatePTSkills = async (staffId, skills = []) => {
  if (!staffId) throw new Error('staffId is required');
  const { data } = await api.patch(
    `/api/admin/staff/${staffId}/skills/approve`,
    {
      skills,
    },
  );
  return data;
};

// PATCH cập nhật thông tin chung (nếu backend hỗ trợ)
// Nếu backend có endpoint khác (ví dụ PATCH /api/admin/staff/{id}), bạn thay đổi ở đây
export const updatePTProfile = async (staffId, payload = {}) => {
  if (!staffId) throw new Error('staffId is required');
  // ví dụ payload = { name, email }
  const { data } = await api.patch(`/api/admin/staff/${staffId}`, payload);
  return data;
};

export default api;
