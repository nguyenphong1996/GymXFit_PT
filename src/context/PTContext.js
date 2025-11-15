// 📁 src/context/PTContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '@api/ptApi';

export const PTContext = createContext({});

const extractProfilePayload = payload => {
  if (!payload || typeof payload !== 'object') return null;

  if (payload.user || payload.staff) {
    return payload.user || payload.staff;
  }

  if (payload.data) {
    if (payload.data.user || payload.data.staff) {
      return payload.data.user || payload.data.staff;
    }
  }

  return payload;
};

const isValidPtAccount = profile => {
  if (!profile) return false;
  const roleValue =
    typeof profile.role === 'string' ? profile.role.toLowerCase() : null;

  if (!roleValue) return true; // Một số schema không trả role trong response OTP
  return roleValue === 'pt' || roleValue === 'staff';
};

export const PTProvider = ({ children }) => {
  const [ptInfo, setPtInfo] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = useCallback(async (overrideToken = null) => {
    const activeToken =
      overrideToken ?? (await AsyncStorage.getItem('token'));
    if (!activeToken) {
      setPtInfo(null);
      return null;
    }

    setLoadingProfile(true);
    try {
      const response = await getProfile();
      const profile = extractProfilePayload(response);
      if (!isValidPtAccount(profile)) {
        throw new Error('Không tìm thấy PT');
      }
      setPtInfo(profile);
      return profile;
    } catch (error) {
      console.warn('Fetch PT profile failed:', error.message);
      setPtInfo(null);
      throw error;
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setUserToken(storedToken);
          await fetchProfile(storedToken);
        }
      } catch (error) {
        console.warn('Restore PT session failed:', error.message);
        await AsyncStorage.removeItem('token');
        setUserToken(null);
        setPtInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [fetchProfile]);

  const login = useCallback(
    async (tokenValue, user) => {
      if (!tokenValue) {
        throw new Error('Thiếu token đăng nhập');
      }

      setIsLoading(true);
      try {
        await AsyncStorage.setItem('token', tokenValue);
        setUserToken(tokenValue);
        const profile = extractProfilePayload(user);
        if (isValidPtAccount(profile)) {
          setPtInfo(profile);
        } else {
          await fetchProfile(tokenValue);
        }
      } catch (error) {
        await AsyncStorage.removeItem('token');
        setUserToken(null);
        setPtInfo(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.warn('Failed to clear PT token:', error.message);
    } finally {
      setUserToken(null);
      setPtInfo(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <PTContext.Provider
      value={{
        ptInfo,
        userToken,
        isLoading,
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
