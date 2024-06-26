import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreviewScreen from '../screens/PreviewScreen';
import SearchBar from '../components/SearchBar';
import ResetPassword from '../screens/Auth/ResetPassword';
import MyDownloadScreen from '../screens/MyDownloadScreen';
import VideoPlayerComponent from '../components/FullScreen';
import ViewAllPost from '../screens/ViewallPost';
import TodayPostView from '../components/ViewAll/TodayPostView';
import UpcomingPostView from '../components/ViewAll/UpcomingPostView';
import CategoryAllPostScreen from '../screens/CategoryAllPostScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
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
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LogIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchBar} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
        }}
      />
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
      <Stack.Screen name="resetpassword" component={ResetPassword} />
      {/* <Stack.Screen name='forgotpassword' component={ForgotPassword}/>
          <Stack.Screen name='verifyOTP' component={VerifyOtp}/> */}
      <Stack.Screen name="Downloads" component={MyDownloadScreen} />
      <Stack.Screen name="FullScreen" component={VideoPlayerComponent} />
      <Stack.Screen
        name="ViewAllPost"
        component={ViewAllPost}
        options={{
          headerShown: true,
          title: 'View All',
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
          title: 'Upcoming Posts',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, // Set the desired font size
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
