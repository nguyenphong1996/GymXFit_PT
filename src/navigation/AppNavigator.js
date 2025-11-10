// 📁 src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🔹 SỬA IMPORT CONTEXT
import { PTContext } from '@context/PTContext';

// 🧭 Import các navigator và màn hình
import AuthNavigator from '@navigation/AuthNavigator';
import HomeNavigator from '@navigation/HomeNavigator';
import QrScannerModel from '@screens/qr/QrScannerModel';
import PTFreeScheduleScreen from '@screens/booking/PTFreeScheduleScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // 🔹 Dùng PTContext thay vì UserContext
  const { userToken, isLoading } = useContext(PTContext);

  // 🌀 Hiển thị loading khi đang xác thực
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true, // Cho phép vuốt để quay lại (iOS)
        }}
        initialRouteName={userToken ? 'HomeApp' : 'Auth'}
      >
        {userToken ? (
          <>
            {/* 🔹 Navigator chính sau khi đăng nhập */}
            <Stack.Screen
              name="HomeApp"
              component={HomeNavigator}
              options={{ gestureEnabled: false }} // Tắt vuốt trong navigator chính
            />

            {/* 🔹 Các màn hình có thể mở từ nhiều nơi */}
            <Stack.Screen
              name="PTFreeScheduleScreen"
              component={PTFreeScheduleScreen}
              options={{
                headerShown: true,
                title: 'Lịch rảnh PT',
                headerBackTitleVisible: false,
              }}
            />

            <Stack.Screen
              name="QrScannerModel"
              component={QrScannerModel}
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Quét mã QR',
                headerBackTitleVisible: false,
              }}
            />
          </>
        ) : (
          <>
            {/* 🔹 Navigator cho phần đăng nhập */}
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ gestureEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default AppNavigator;
