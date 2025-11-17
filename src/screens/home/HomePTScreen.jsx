import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useNavigation } from '@react-navigation/native';

import PTProfileScreen from '@screens/profile/PTProfileScreen';
import PTScheduleScreen from '@screens/booking/PTScheduleScreen';
import PTFreeScheduleScreen from '@screens/booking/PTFreeScheduleScreen';
import PTCustomerListScreen from '@screens/customers/PTCustomerListScreen';

const Tab = createBottomTabNavigator();

const TAB_ITEMS = [
  {
    name: 'PTCustomersTab',
    label: 'Khách hàng',
    icon: 'groups',
    component: PTCustomerListScreen,
  },
  {
    name: 'PTScheduleTab',
    label: 'Lịch làm việc',
    icon: 'calendar-today',
    component: PTScheduleScreen,
  },
  {
    name: 'QRPlaceholder',
    label: '',
    icon: '',
    component: PTScheduleScreen, // Placeholder
  },
  {
    name: 'PTFreeScheduleTab',
    label: 'Lịch trống',
    icon: 'event-available',
    component: PTFreeScheduleScreen,
  },
  {
    name: 'PTProfileTab',
    label: 'Hồ sơ',
    icon: 'person',
    component: PTProfileScreen,
  },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;
        const isQRPlaceholder = route.name === 'QRPlaceholder';

        const onPress = () => {
          if (isQRPlaceholder) {
            navigation.navigate('QrScannerModel');
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Middle QR button (elevated)
        if (isQRPlaceholder) {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.qrButtonContainer}
              onPress={onPress}
              activeOpacity={0.85}
            >
              <View style={styles.qrButton}>
                <MaterialIcons name="qr-code-scanner" size={36} color="#fff" />
              </View>
              <Text style={styles.qrLabel}>Quét mã</Text>
            </TouchableOpacity>
          );
        }

        // Regular tabs
        const tabItem = TAB_ITEMS.find(item => item.name === route.name);
        const iconName = tabItem?.icon || 'help';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={iconName}
              size={24}
              color={isFocused ? '#fff' : 'rgba(255,255,255,0.6)'}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? '#fff' : 'rgba(255,255,255,0.6)' },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomePTScreen = () => {
  useEffect(() => {
    StatusBar.setHidden(true);
    if (Platform.OS === 'android') SystemNavigationBar.stickyImmersive();
    return () => {
      if (Platform.OS === 'android') SystemNavigationBar.navigationShow();
    };
  }, []);

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TAB_ITEMS.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            tabBarLabel: item.label,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#30C451',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  qrButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -28,
    flex: 1,
  },
  qrButton: {
    backgroundColor: '#30C451',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#30C451',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 5,
    borderColor: '#fff',
  },
  qrLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '700',
  },
});

export default HomePTScreen;
