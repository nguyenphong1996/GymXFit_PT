import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPTScreen from '@screens/auth/LoginPTScreen';
import VerifyLoginScreen from '@screens/auth/VerifyLoginScreen';
import PTScheduleScreen from '@screens/booking/PTScheduleScreen';
import HomePTScreen from '@screens/home/HomePTScreen'

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="HomePTScreen"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginPTScreen" component={LoginPTScreen} />
    <Stack.Screen name="VerifyLoginScreen" component={VerifyLoginScreen} />
    <Stack.Screen name="PTScheduleScreen" component={PTScheduleScreen} />
    <Stack.Screen name="HomePTScreen" component={HomePTScreen}/>
  </Stack.Navigator>
);

export default AuthNavigator;
