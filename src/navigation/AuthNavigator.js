import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPTScreen from '@screens/auth/LoginPTScreen';
import VerifyLoginScreen from '@screens/auth/VerifyLoginScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginPTScreen"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginPTScreen" component={LoginPTScreen} />
    <Stack.Screen name="VerifyLoginScreen" component={VerifyLoginScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
