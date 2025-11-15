import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PTProvider } from '@context/PTContext'; // ✅ Sử dụng đúng PTProvider
import { ToastProvider } from '@context/ToastContext';
import AppNavigator from '@navigation/AppNavigator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

MaterialIcons.loadFont();
Ionicons.loadFont();

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <PTProvider>
          <View style={styles.container}>
            <AppNavigator />
          </View>
        </PTProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
