import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//redux
import { Provider } from 'react-redux'
import store from './src/redux/store';
//naviagtion
import { NavigationContainer } from "@react-navigation/native";
import Splash from './src/screens/Splash';
import MainNavigator from './src/routers/MainNavigator';

const App = () => {
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWelcome(false)
    }, 800);

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          {
            welcome ? <Splash /> :
              <MainNavigator />
          }
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>

  );
}

const styles = StyleSheet.create({
});

export default App;
