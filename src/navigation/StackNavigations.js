import React, {useEffect, useState, useContext} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PreviewScreen from '../screens/PreviewScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchBar from '../components/SearchBar';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import MyDownloadScreen from '../screens/MyDownloadScreen';
import VideoPlayerComponent from '../components/FullScreen';
import ViewAllPost from '../screens/ViewallPost';
import {ThemeProvider} from '../utils/ThemeContext';
import {ThemeContext} from '../utils/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkTrue} from '../redux/reducer/isDarkMode';
import ResetPassword from '../screens/Auth/ResetPassword';
import TodayPostView from '../components/ViewAll/TodayPostView';
import UpcomingPostView from '../components/ViewAll/UpcomingPostView';
import CategoryAllPostScreen from '../screens/CategoryAllPostScreen';

const Stack = createStackNavigator();

function StackNavigations() {
  const dispatch = useDispatch();
  // const {isDarkMode} = useContext(ThemeContext);

  // if (isDarkMode) {
  //   dispatch(setDarkTrue());
  // }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({current, next, layouts}) => {
          return {
            cardStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          };
        },
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="Search" component={SearchBar} />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CategoryAllPost"
        component={CategoryAllPostScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="LogIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />

      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Downloads" component={MyDownloadScreen} />
      <Stack.Screen name="FullScreen" component={VideoPlayerComponent} />
      <Stack.Screen
        name="ViewAllPost"
        component={ViewAllPost}
        options={{
          headerShown: true,
          title: 'View All',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, // Set the desired font size
          },
        }}
      />
      <Stack.Screen
        name="TodayPostView"
        component={TodayPostView}
        options={{
          headerShown: true,
          title: 'Today Post',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, // Set the desired font size
          },
        }}
      />
      <Stack.Screen
        name="UpcomingPostView"
        component={UpcomingPostView}
        options={{
          headerShown: true,
          title: 'UpcomingPostView',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, // Set the desired font size
          },
        }}
      />
      <Stack.Screen name="resetpassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}

export default StackNavigations;
