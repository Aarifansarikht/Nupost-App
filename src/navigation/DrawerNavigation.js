import React from 'react';
import { DrawerToggleButton, createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import Header from '../components/Header';
import { TouchableOpacity, View } from "react-native";

import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import MyDownloadScreen from '../screens/MyDownloadScreen';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
function DrawerNavigation(props) {
    const navigation = useNavigation();
    return (
        <Drawer.Navigator screenOptions={{
            headerShown: false, drawerPosition: 'right', headerLeft: () => <Header />, headerRight: () => <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                   
                
                <TouchableOpacity onPress={()=>navigation.navigate('Search')}><Feather name='search' style={{ color: 'black', padding: 5 }} size={20}  /></TouchableOpacity>
                <DrawerToggleButton />
                </View>, headerTitle: "",

        }}>

            <Drawer.Screen name="Home!" component={HomeScreen} options={{
                headerShown: true, drawerIcon: ({ focused, size }) => (
                    <Ionicons
                        name="home"
                        size={20}
                        style={{ color: 'black' }}
                    />
                ),
            }} />



            <Drawer.Screen name='MyDownloads' component={MyDownloadScreen} options={{
                drawerIcon: () => (<FontAwesome
                    name="download"
                    size={20}
                    style={{ color: 'black' }}
                />),
            }} />




        </Drawer.Navigator>
    );
}

export default DrawerNavigation;