
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🔹 Import các màn hình
import HomePTScreen from '@screens/home/HomePTScreen';
import PTProfileScreen from '@screens/profile/PTProfileScreen';
import PTScheduleScreen from '@screens/booking/PTScheduleScreen';
import PTCustomerListScreen from '@screens/customers/PTCustomerListScreen';
import PTLessonPlanScreen from '@screens/workouts/PTLessonPlanScreen';
import PTLessonHistoryScreen from '@screens/workouts/PTLessonHistoryScreen';

// 🔹 Thêm các màn hình mới
import UpdatePTProfileScreen from '@screens/profile/UpdatePTProfileScreen';
import PTFreeScheduleScreen from '@screens/booking/PTFreeScheduleScreen';
import QrScannerModel from '@screens/qr/QrScannerModel';
import PTCustomerDetailScreen from '@screens/customers/PTCustomerDetailScreen';
import PTRecentCustomerScreen from '@screens/customers/PTRecentCustomerScreen';


const Stack = createNativeStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomePTScreen" component={HomePTScreen} />
    <Stack.Screen name="PTProfileScreen" component={PTProfileScreen} />
    <Stack.Screen name="PTScheduleScreen" component={PTScheduleScreen} />
    <Stack.Screen
      name="PTCustomerListScreen"
      component={PTCustomerListScreen}
    />
    <Stack.Screen name="PTLessonPlanScreen" component={PTLessonPlanScreen} />
    <Stack.Screen
      name="PTLessonHistoryScreen"
      component={PTLessonHistoryScreen}
    />

    <Stack.Screen
      name="UpdatePTProfileScreen"
      component={UpdatePTProfileScreen}
    />
    <Stack.Screen
      name="PTFreeScheduleScreen"
      component={PTFreeScheduleScreen}
    />
    <Stack.Screen name="QrScannerModel" component={QrScannerModel} />
    <Stack.Screen
      name="PTCustomerDetailScreen"
      component={PTCustomerDetailScreen}
    />
    <Stack.Screen
      name="PTRecentCustomerScreen"
      component={PTRecentCustomerScreen}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
