import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';


import DrawerNavigation from './src/navigation/DrawerNavigation';
import StackNavigations from './src/navigation/StackNavigations';
import AuthStack from './src/navigation/AuthStack';
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
  
  useEffect(()=>{
    SplashScreen.hide();
    retrieveData();
  },[])

  
  return (
    <NavigationContainer>
      {
        isLogged?<StackNavigations/>:<AuthStack/>
      }
    
    </NavigationContainer>
  );
}

export default App;