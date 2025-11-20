import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PTBottomScanBar = ({ onScanPress }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabPlaceholder}>
        <Text style={styles.placeholderText}> </Text>
      </View>

      <TouchableOpacity
        style={styles.fabContainer}
        onPress={onScanPress}
        activeOpacity={0.85}
      >
        <View style={styles.fab}>
          <Icon name="qr-code-scanner" size={36} color="#fff" />
        </View>
        <Text style={styles.fabLabel}>Quét mã</Text>
      </TouchableOpacity>

      <View style={styles.tabPlaceholder}>
        <Text style={styles.placeholderText}> </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#30C451',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 20,
  },
  tabPlaceholder: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'transparent',
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -20,
  },
  fab: {
    backgroundColor: '#30C451',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 14,
    shadowColor: '#30C451',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 6,
    borderColor: '#fff',
  },
  fabLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default PTBottomScanBar;
