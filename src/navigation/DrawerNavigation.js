import React,{useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
function DrawerNavigation({props,route}) {
    const [userData, setUserData] = useState(null); 
    const getUserData = async () => {
        const data = await AsyncStorage.getItem('userData');
   
        if (data) {
            const parsedData = JSON.parse(data);
            setUserData(parsedData);
        }
    };


    useEffect(() => {
        getUserData();
    }, []);

    const navigation = useNavigation();
    return (
        <Drawer.Navigator screenOptions={{
            headerShown: false, headerLeft: () => <Header />, headerRight: () => <View style={{ alignItems: 'center', flexDirection: 'row' ,justifyContent:"space-between"}}>


                <TouchableOpacity onPress={() => navigation.navigate('Search')}><Feather name='search' style={{ color: 'black', padding: 5 }} size={23} /></TouchableOpacity>
                {/* <DrawerToggleButton /> */}
            </View>, headerTitle: "",

        }}>

            <Drawer.Screen name="Home!" component={HomeScreen} options={{
                swipeEnabled: false,
                headerShown: true, drawerIcon: ({ focused, size }) => (
                    <Ionicons
                        name="home"
                        size={20}
                        style={{ color: 'black' }}
                    />
                ),
            }} />



            <Drawer.Screen name='MyDownloads' component={MyDownloadScreen} options={{
                swipeEnabled: false,
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