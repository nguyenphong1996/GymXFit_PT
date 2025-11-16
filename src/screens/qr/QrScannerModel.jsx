import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const PALETTE = {
  background: '#05130B',
  surface: 'rgba(6, 20, 12, 0.96)',
  mutedSurface: 'rgba(9, 27, 17, 0.72)',
  accent: '#81F4A8',
  textPrimary: '#F1FFF6',
  textSecondary: '#9BBEA9',
  outline: 'rgba(129, 244, 168, 0.28)',
};

const QrScannerModel = () => {
  const navigation = useNavigation();
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);

  const toggleTorch = () => {
    setIsTorchEnabled(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={toggleTorch}
          activeOpacity={0.85}
        >
          <Icon
            name={isTorchEnabled ? 'white-balance-sunny' : 'weather-night'}
            size={24}
            color={PALETTE.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quét mã QR</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Icon name="close" size={24} color={PALETTE.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.scanFrame}>
            <View style={[styles.frameCorner, styles.topLeft]} />
            <View style={[styles.frameCorner, styles.topRight]} />
            <View style={[styles.frameCorner, styles.bottomLeft]} />
            <View style={[styles.frameCorner, styles.bottomRight]} />
          </View>
        </View>

        <Text style={styles.helperText}>
          Giữ thiết bị ổn định, đưa QR vào khung để quét mã.
        </Text>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={toggleTorch}
          activeOpacity={0.9}
        >
          <Text style={styles.actionEmoji}>
            {isTorchEnabled ? '🌙' : '💡'}
          </Text>
          <Text style={styles.actionButtonText}>
            {isTorchEnabled ? 'Tắt đèn' : 'Bật đèn'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: PALETTE.surface,
    borderBottomColor: PALETTE.outline,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.mutedSurface,
    borderWidth: 1,
    borderColor: PALETTE.outline,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.textPrimary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  cameraPlaceholder: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderColor: 'rgba(129, 244, 168, 0.42)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(3, 18, 10, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: PALETTE.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  helperText: {
    color: PALETTE.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  actionsBar: {
    paddingBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionButton: {
    backgroundColor: '#092612',
    borderRadius: 22,
    paddingHorizontal: 36,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default QrScannerModel;
