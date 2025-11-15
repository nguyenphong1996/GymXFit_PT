const normalizeString = value =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const matchCondition = (target, patterns = []) =>
  patterns.some(pattern => target.includes(pattern));

const TRANSLATIONS = [
  {
    patterns: ['staff_not_verified', 'not verified'],
    message:
      'Tài khoản PT chưa được kích hoạt. Vui lòng hoàn tất bước xác minh lần đầu hoặc liên hệ quản trị viên.',
  },
  {
    patterns: ['staff_deactivated', 'deactivated', 'inactive'],
    message:
      'Tài khoản PT đã bị vô hiệu hoá. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
  },
  {
    patterns: ['staff_not_found', 'not found', 'not exist'],
    message:
      'Không tìm thấy tài khoản PT với số điện thoại này. Vui lòng kiểm tra lại.',
  },
  {
    patterns: ['otp_invalid', 'invalid otp', 'otp is incorrect'],
    message:
      'Mã OTP không hợp lệ. Vui lòng kiểm tra lại và nhập chính xác 4 chữ số.',
  },
  {
    patterns: ['otp_expired', 'expired'],
    message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới và thử lại.',
  },
];

const translateStaffAuthError = error => {
  const defaultMessage =
    'Không thể đăng nhập, vui lòng thử lại hoặc liên hệ quản trị viên.';

  if (!error) {
    return defaultMessage;
  }

  const normalizedCode = normalizeString(error.code);
  const normalizedMessage = normalizeString(error.message);
  const combined = `${normalizedCode} ${normalizedMessage}`.trim();

  for (const translation of TRANSLATIONS) {
    if (matchCondition(combined, translation.patterns)) {
      return translation.message;
    }
  }

  return defaultMessage;
};

export default translateStaffAuthError;
