import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UserProvider } from '@context/UserContext';
import AppNavigator from '@navigation/AppNavigator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

MaterialIcons.loadFont();
Ionicons.loadFont();

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
});

export default App;
