import React, { useEffect, useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';

import PreviewScreen from '../screens/PreviewScreen';
import DrawerNavigation from './DrawerNavigation';
import ProfileScreen from '../screens/ProfileScreen';
import SearchBar from '../components/SearchBar';

const Stack = createStackNavigator();
function StackNavigations() {


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="LogIn" component={LoginScreen} />
            <Stack.Screen name='Home' component={DrawerNavigation} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Search" component={SearchBar} />
            <Stack.Screen name="Preview" component={PreviewScreen} options={{
                headerShown: true
            }} />
        </Stack.Navigator>
    );
}

export default StackNavigations;