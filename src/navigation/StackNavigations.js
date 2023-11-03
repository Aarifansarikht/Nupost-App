import React, { useEffect, useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PreviewScreen from '../screens/PreviewScreen';
import DrawerNavigation from './DrawerNavigation';
import ProfileScreen from '../screens/ProfileScreen';
import SearchBar from '../components/SearchBar';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import MyDownloadScreen from '../screens/MyDownloadScreen';


const Stack = createStackNavigator();
function StackNavigations() {


  return (
    <Stack.Navigator screenOptions={{
      headerShown: false, cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
          cardStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        };
      },
    }} >
        <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{
        headerShown: true
      }} />
      <Stack.Screen name="Search" component={SearchBar} />
      <Stack.Screen name="Preview" component={PreviewScreen} options={{
        headerShown: true
      }} />
      <Stack.Screen name="LogIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />

      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Downloads" component={MyDownloadScreen} />

     

    </Stack.Navigator>
  );
}

export default StackNavigations;