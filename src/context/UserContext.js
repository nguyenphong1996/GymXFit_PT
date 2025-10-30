import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getProfile } from '@api/userApi';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Persist the token, optionally prime user state, then refresh profile from API.
   * Dùng khi đăng nhập hoặc xác thực OTP thành công.
   */
  const login = useCallback(async (token, initialUser = null) => {
    setIsLoading(true);
    setUserToken(token);
    await AsyncStorage.setItem('token', token);

    if (initialUser) {
      setUser(prev => ({ ...prev, ...initialUser }));
    }

    try {
      const response = await getProfile();
      if (response?.ok && response?.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Lỗi khi lấy profile sau khi đăng nhập:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Xóa token khỏi AsyncStorage và reset toàn bộ state.
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setUser(null);
    setUserToken(null);
    await AsyncStorage.removeItem('token');
    setIsLoading(false);
  }, []);

  /**
   * Tải lại thông tin profile của user hiện tại.
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await getProfile();
      if (response?.ok && response?.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Lỗi khi làm mới thông tin user:', error);
    }
  }, []);

  /**
   * Khi app khởi động, kiểm tra xem đã có token lưu sẵn không.
   */
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await login(token);
          return;
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [login]);

  return (
    <UserContext.Provider
      value={{
        user,
        userToken,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
