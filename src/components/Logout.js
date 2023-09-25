import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View,Button, Text} from 'react-native';
function Logout({navigation}) {
    const handleLogout = async () => {

        await AsyncStorage.removeItem('keepLoggedIn');
        navigation.navigate('LogIn')
        console.warn('h');
 
      };
    return (
       <View>
        <Text>Home</Text>
        <Text>My Downloads</Text>
            <Button title={'Log Out'} onPress={handleLogout}></Button>
       </View>
    );
}

export default Logout;