import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TYPE_CONFIG = {
  success: {
    backgroundColor: '#E8F6EC',
    borderColor: '#B8E0C2',
    icon: 'checkmark-circle',
    iconColor: '#1E7B34',
    titleColor: '#154720',
    messageColor: '#276738',
  },
  warning: {
    backgroundColor: '#FFF5E6',
    borderColor: '#FFD8A8',
    icon: 'warning',
    iconColor: '#DB7C1C',
    titleColor: '#8A4D02',
    messageColor: '#B86807',
  },
  error: {
    backgroundColor: '#FDECEC',
    borderColor: '#F4B4B4',
    icon: 'close-circle',
    iconColor: '#C62828',
    titleColor: '#8B0000',
    messageColor: '#B71C1C',
  },
  info: {
    backgroundColor: '#E7F2FF',
    borderColor: '#BAD8FF',
    icon: 'information-circle',
    iconColor: '#1E5AA8',
    titleColor: '#0B3A73',
    messageColor: '#1A4D8D',
  },
};

const ToastBanner = ({
  visible,
  type = 'info',
  title,
  message,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: visible ? 0 : -40,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 160 : 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, translateY]);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableWithoutFeedback onPress={onHide}>
        <View
          style={[
            styles.toast,
            {
              backgroundColor: config.backgroundColor,
              borderColor: config.borderColor,
            },
          ]}
        >
          <Ionicons
            name={config.icon}
            size={22}
            color={config.iconColor}
            style={styles.icon}
          />
          <View style={styles.textGroup}>
            {title ? (
              <Text
                style={[styles.title, { color: config.titleColor }]}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : null}
            {message ? (
              <Text
                style={[styles.message, { color: config.messageColor }]}
                numberOfLines={2}
              >
                {message}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 9999,
    elevation: 10,
    paddingHorizontal: 24,
    paddingTop: '20%',
  },
  toast: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
  },
  icon: {
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ToastBanner;
