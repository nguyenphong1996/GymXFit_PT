import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'token_expires_at';
const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const padBase64 = value => {
  const padding = (4 - (value.length % 4)) % 4;
  return value + '='.repeat(padding);
};

const base64UrlDecode = segment => {
  if (typeof segment !== 'string' || !segment.length) {
    return null;
  }

  const normalised = padBase64(
    segment.replace(/-/g, '+').replace(/_/g, '/'),
  );

  let bitsCollected = 0;
  let accumulator = 0;
  let decoded = '';

  for (let i = 0; i < normalised.length; i += 1) {
    const char = normalised.charAt(i);
    if (char === '=') {
      break;
    }
    const value = BASE64_ALPHABET.indexOf(char);
    if (value < 0) {
      return null;
    }

    accumulator = (accumulator << 6) | value;
    bitsCollected += 6;

    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      const code = (accumulator >> bitsCollected) & 0xff;
      decoded += String.fromCharCode(code);
    }
  }

  try {
    return decodeURIComponent(
      decoded
        .split('')
        .map(char =>
          `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`,
        )
        .join(''),
    );
  } catch {
    return decoded;
  }
};

const parseExpiryCandidate = value => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e12 ? value : value * 1000;
  }

  if (typeof value === 'string' && value.trim().length) {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric > 1e12 ? numeric : numeric * 1000;
    }

    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
};

const decodeJwtExpiry = token => {
  if (typeof token !== 'string') {
    return null;
  }

  const [, payloadSegment] = token.split('.');
  if (!payloadSegment) {
    return null;
  }

  const payloadString = base64UrlDecode(payloadSegment);
  if (!payloadString) {
    return null;
  }

  try {
    const payload = JSON.parse(payloadString);
    if (typeof payload?.exp === 'number') {
      return payload.exp * 1000;
    }
  } catch {
    // ignore malformed JWT payloads
  }

  return null;
};

const resolveExpiryFromMetadata = metadata => {
  if (!metadata || typeof metadata !== 'object') {
    return null;
  }

  const candidates = [
    metadata,
    metadata.token,
    metadata.data,
    metadata.user,
    metadata.staff,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const direct =
      parseExpiryCandidate(candidate.tokenExpiresAt) ||
      parseExpiryCandidate(candidate.expiresAt) ||
      parseExpiryCandidate(candidate.tokenExpiry) ||
      parseExpiryCandidate(candidate.expiredAt) ||
      parseExpiryCandidate(candidate.expireAt) ||
      parseExpiryCandidate(candidate.token_expires_at) ||
      parseExpiryCandidate(candidate.token_expiresAt);
    if (direct) {
      return direct;
    }

    if (typeof candidate.expiresIn === 'number') {
      return Date.now() + candidate.expiresIn * 1000;
    }
    if (typeof candidate.tokenExpiresIn === 'number') {
      return Date.now() + candidate.tokenExpiresIn * 1000;
    }
  }

  return null;
};

export const normalizeTokenValue = tokenValue => {
  if (!tokenValue) {
    return '';
  }

  if (typeof tokenValue === 'string') {
    return tokenValue;
  }

  if (typeof tokenValue === 'object') {
    if (typeof tokenValue.accessToken === 'string') {
      return tokenValue.accessToken;
    }
    if (typeof tokenValue.token === 'string') {
      return tokenValue.token;
    }
    if (typeof tokenValue.value === 'string') {
      return tokenValue.value;
    }
  }

  return String(tokenValue);
};

export const persistToken = async (tokenValue, metadata = null) => {
  const token = normalizeTokenValue(tokenValue);
  if (!token) {
    throw new Error('Token đăng nhập không hợp lệ');
  }

  await AsyncStorage.setItem(TOKEN_KEY, token);

  const expiresAt =
    resolveExpiryFromMetadata(metadata) ?? decodeJwtExpiry(token) ?? null;

  if (expiresAt) {
    await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
  } else {
    await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  return { token, expiresAt };
};

export const readStoredToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const expiresRaw = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
  const expiresAt = expiresRaw ? Number(expiresRaw) : null;

  return {
    token: token || null,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : null,
  };
};

export const clearStoredToken = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY]);
};

export const isTokenExpired = expiresAt => {
  if (!expiresAt || !Number.isFinite(expiresAt)) {
    return false;
  }
  return Date.now() >= expiresAt;
};
