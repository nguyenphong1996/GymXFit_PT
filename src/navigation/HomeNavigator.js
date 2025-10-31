import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePTScreen from '@screens/home/HomePTScreen';
import PTProfileScreen from '@screens/profile/PTProfileScreen';
import PTScheduleScreen from '@screens/booking/PTScheduleScreen';
import PTCustomerListScreen from '@screens/customers/PTCustomerListScreen';
import PTLessonPlanScreen from '@screens/workouts/PTLessonPlanScreen';
import PTLessonHistoryScreen from '@screens/workouts/PTLessonHistoryScreen';
imp

const Stack = createNativeStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomePTScreen" component={HomePTScreen} />
    <Stack.Screen name="PTProfileScreen" component={PTProfileScreen} />
    <Stack.Screen name="PTScheduleScreen" component={PTScheduleScreen} />
    <Stack.Screen name="PTCustomerListScreen" component={PTCustomerListScreen} />
    <Stack.Screen name="PTLessonPlanScreen" component={PTLessonPlanScreen} />
    <Stack.Screen
      name="PTLessonHistoryScreen"
      component={PTLessonHistoryScreen}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
