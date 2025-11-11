// 📁 src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🔹 Import PTContext (chứa token, trạng thái loading)
import { PTContext } from '@context/PTContext';

// 🧭 Import các navigator & màn hình
import AuthNavigator from '@navigation/AuthNavigator';
import HomeNavigator from '@navigation/HomeNavigator';
import QrScannerModel from '@screens/qr/QrScannerModel';
import PTFreeScheduleScreen from '@screens/booking/PTFreeScheduleScreen';
import PTCustomerListScreen from '@screens/customers/PTCustomerListScreen';
import PTCustomerDetailScreen from '@screens/customers/PTCustomerDetailScreen'; // 🔹 Thêm chi tiết KH nếu có

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(PTContext);

  // 🌀 Hiển thị vòng loading khi đang xác thực
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#20B24A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userToken ? 'HomeApp' : 'Auth'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {userToken ? (
          <>
            {/* 🔹 Giao diện chính sau đăng nhập */}
            <Stack.Screen
              name="HomeApp"
              component={HomeNavigator}
              options={{ gestureEnabled: false }}
            />

            {/* 🔹 Các màn riêng biệt (truy cập từ nhiều chỗ) */}
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

            <Stack.Screen
              name="PTCustomerListScreen"
              component={PTCustomerListScreen}
              options={{
                headerShown: true,
                title: 'Danh sách khách hàng',
                headerBackTitleVisible: false,
              }}
            />

            <Stack.Screen
              name="PTCustomerDetailScreen"
              component={PTCustomerDetailScreen}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ gestureEnabled: false }}
          />
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
