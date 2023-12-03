import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { decode, encode } from 'base-64';

import StackNavigations from './src/navigation/StackNavigations';
import AuthStack from './src/navigation/AuthStack';
import { ThemeProvider } from './src/utils/ThemeContext';
import LottieView from 'lottie-react-native';
import Splash from './src/components/SplashScreen/Splash';

function App() {

  const [isLogged, setIsLogged] = useState(false);

  const retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem('keepLoggedIn');
      if (data !== null) {
        // Parse the retrieved data as a boolean
        const parsedData = JSON.parse(data);
  
        setIsLogged(parsedData);
      }
    } catch (error) {
      // Handle errors here
      console.error('Error retrieving data:', error);
    }
  }

  useEffect(() => {
    SplashScreen.hide();
    retrieveData();
    if (!global.btoa) {
      global.btoa = encode;
    }

    // Check if global.atob is undefined and set it to the decode function
    if (!global.atob) {
      global.atob = decode;
    }
  }, [])


  return (
    <NavigationContainer>
      <ThemeProvider>
    
      {
        isLogged ? <StackNavigations /> : <AuthStack />
      }
      </ThemeProvider>
    </NavigationContainer>
  );
}

export default App;