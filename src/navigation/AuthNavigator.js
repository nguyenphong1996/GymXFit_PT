import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPTScreen from '@screens/auth/LoginPTScreen';
import VerifyLoginScreen from '@screens/auth/VerifyLoginScreen';
import PTScheduleScreen from '@screens/booking/PTScheduleScreen';
import HomePTScreen from '@screens/home/HomePTScreen'
import PTLessonHistoryScreen from '@screens/workouts/PTLessonHistoryScreen';
import PTLessonPlanScreen from '@screens/workouts/PTLessonPlanScreen';
import PTProfileScreen from '@screens/profile/PTProfileScreen';
import UpdatePTProfileScreen from '@screens/profile/UpdatePTProfileScreen'
import PTCustomerListScreen from '@screens/customers/PTCustomerListScreen';
import QrScannerModel from '@screens/qr/QrScannerModel';
import PTFreeScheduleScreen from '@screens/booking/PTFreeScheduleScreen';




const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="UpdatePTProfileScreen"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginPTScreen" component={LoginPTScreen} />
    <Stack.Screen name="VerifyLoginScreen" component={VerifyLoginScreen} />
    <Stack.Screen name="PTScheduleScreen" component={PTScheduleScreen} />
    <Stack.Screen name="HomePTScreen" component={HomePTScreen} />
    <Stack.Screen
      name="PTLessonHistoryScreen"
      component={PTLessonHistoryScreen}
    />
    <Stack.Screen name="PTLessonPlanScreen" component={PTLessonPlanScreen} />
    <Stack.Screen name="PTProfileScreen" component={PTProfileScreen} />
    <Stack.Screen
      name="UpdatePTProfileScreen"
      component={UpdatePTProfileScreen}
    />
    <Stack.Screen
      name="PTCustomerListScreen"
      component={PTCustomerListScreen}
    />
    <Stack.Screen name="QrScannerModel" component={QrScannerModel} />
    <Stack.Screen
      name="PTFreeScheduleScreen"
      component={PTFreeScheduleScreen}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
