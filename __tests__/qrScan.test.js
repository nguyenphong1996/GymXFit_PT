// Test file for QR scanning functionality
import { scanAttendance } from '../src/api/ptApi';

// Mock the axios instance
jest.mock('../src/api/axiosInstance', () => {
  return jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  }));
});

describe('QR Scanning functionality', () => {
  const mockAxiosInstance = require('../src/api/axiosInstance')();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully scan attendance with valid QR data', async () => {
    const mockResponse = {
      success: true,
      message: 'Quét mã thành công! Học viên đã được điểm danh.',
    };

    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const qrData = {
      classId: '507f1f77bcf86cd799439013',
      token: 'abc123',
      type: 'class_check',
      generatedAt: '2025-01-01T08:00:00.000Z',
    };

    const qrValue = JSON.stringify(qrData);

    const result = await scanAttendance({
      classId: '507f1f77bcf86cd799439013',
      qrValue: qrValue,
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/api/staff/classes/507f1f77bcf86cd799439013/attendance/scan',
      {
        qrValue: qrValue,
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle invalid QR data', async () => {
    const invalidQrValue = 'invalid-qr-data';

    await expect(
      scanAttendance({
        classId: '507f1f77bcf86cd799439013',
        qrValue: invalidQrValue,
      }),
    ).rejects.toThrow('Mã QR không hợp lệ - Không thể phân tích dữ liệu.');
  });

  test('should handle missing classId', async () => {
    const qrData = {
      classId: '507f1f77bcf86cd799439013',
      token: 'abc123',
      type: 'class_check',
      generatedAt: '2025-01-01T08:00:00.000Z',
    };

    const qrValue = JSON.stringify(qrData);

    await expect(
      scanAttendance({
        classId: '',
        qrValue: qrValue,
      }),
    ).rejects.toThrow('Thiếu mã lớp học trong QR.');
  });

  test('should handle missing qrValue', async () => {
    await expect(
      scanAttendance({
        classId: '507f1f77bcf86cd799439013',
        qrValue: '',
      }),
    ).rejects.toThrow('Không đọc được dữ liệu QR.');
  });
});
