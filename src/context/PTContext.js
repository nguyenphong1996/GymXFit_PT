// 📁 src/context/PTContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getProfile } from '@api/ptApi';

export const PTContext = createContext({});

export const PTProvider = ({ children }) => {
  const [ptInfo, setPtInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const login = async (tokenValue, user) => {
    setToken(tokenValue);
    setPtInfo(user);
  };

  const logout = () => {
    setToken(null);
    setPtInfo(null);
  };

  const fetchProfile = async () => {
    if (!token) return;
    setLoadingProfile(true);
    try {
      const response = await getProfile();

      // Nếu API trả về dữ liệu chuẩn
      if (response?.data?.user?.role === 'PT') {
        setPtInfo(response.data.user);
      } else {
        throw new Error('Không tìm thấy PT');
      }
    } catch (error) {
      console.warn('Fetch PT profile failed:', error.message);
      setPtInfo(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  return (
    <PTContext.Provider
      value={{
        ptInfo,
        token,
        login,
        logout,
        fetchProfile,
        loadingProfile,
      }}
    >
      {children}
    </PTContext.Provider>
  );
};
