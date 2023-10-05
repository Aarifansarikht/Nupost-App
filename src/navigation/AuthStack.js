import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigation from './DrawerNavigation';
import ProfileScreen from '../screens/ProfileScreen';
import PreviewScreen from '../screens/PreviewScreen';
import SearchBar from '../components/SearchBar';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import VerifyOtp from '../screens/Auth/VerifyOtp';
import ResetPassword from '../screens/Auth/ResetPassword';



const Stack = createStackNavigator();

function AuthStack() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: "modal" ,cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
        cardStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      };
    },}}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LogIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name='Home' component={DrawerNavigation} />
      <Stack.Screen name="Search" component={SearchBar} />
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="Preview" component={PreviewScreen} options={{
        headerShown: true
      }} />
          <Stack.Screen name='forgotpassword' component={ForgotPassword}/>
          <Stack.Screen name='verifyOTP' component={VerifyOtp}/>
          <Stack.Screen name='resetpassword' component={ResetPassword}/>
    </Stack.Navigator>
  );
}

export default AuthStack;