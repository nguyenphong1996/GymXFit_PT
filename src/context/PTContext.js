// 📁 src/context/PTContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '@api/ptApi';
import {
  clearStoredToken,
  isTokenExpired,
  persistToken,
  readStoredToken,
} from '../utils/tokenStorage';

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
  const [tokenExpiry, setTokenExpiry] = useState(null);

  const fetchProfile = useCallback(async () => {
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
      if (error?.status === 401 || error?.status === 403) {
        await clearStoredToken();
        setUserToken(null);
        setTokenExpiry(null);
      }
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
        const { token: storedToken, expiresAt } = await readStoredToken();
        if (!storedToken) {
          setUserToken(null);
          setPtInfo(null);
          setTokenExpiry(null);
          return;
        }

        if (isTokenExpired(expiresAt)) {
          await clearStoredToken();
          setUserToken(null);
          setPtInfo(null);
          setTokenExpiry(null);
          return;
        }

        setUserToken(storedToken);
        setTokenExpiry(expiresAt ?? null);
        await fetchProfile();
      } catch (error) {
        console.warn('Restore PT session failed:', error.message);
        if (error?.status === 401 || error?.status === 403) {
          await clearStoredToken();
          setUserToken(null);
          setPtInfo(null);
          setTokenExpiry(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [fetchProfile]);

  const login = useCallback(
    async (tokenValue, user, metadata = null) => {
      if (!tokenValue) {
        throw new Error('Thiếu token đăng nhập');
      }

      setIsLoading(true);
      try {
        const stored = await persistToken(tokenValue, metadata);
        setUserToken(stored.token);
        setTokenExpiry(stored.expiresAt ?? null);
        const profile = extractProfilePayload(user);
        if (isValidPtAccount(profile)) {
          setPtInfo(profile);
        } else {
          await fetchProfile();
        }
      } catch (error) {
        await clearStoredToken();
        setUserToken(null);
        setTokenExpiry(null);
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
      await clearStoredToken();
    } catch (error) {
      console.warn('Failed to clear PT token:', error.message);
    } finally {
      setUserToken(null);
      setTokenExpiry(null);
      setPtInfo(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userToken || !tokenExpiry) {
      return undefined;
    }

    if (isTokenExpired(tokenExpiry)) {
      logout();
      return undefined;
    }

    const timeout = setTimeout(() => {
      logout();
    }, Math.max(tokenExpiry - Date.now(), 0));

    return () => clearTimeout(timeout);
  }, [userToken, tokenExpiry, logout]);

  return (
    <PTContext.Provider
      value={{
        ptInfo,
        userToken,
        isLoading,
        tokenExpiry,
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
