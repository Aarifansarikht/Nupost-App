import React from 'react';
import { Image, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
function Header() {
    const navigation = useNavigation();
    const handleProfile = () => {
        navigation.navigate('Profile')
    }
    return (
        <View >
            <TouchableOpacity onPress={handleProfile}>

                <View style={{ backgroundColor: '#5F76FD', justifyContent: 'center', alignItems: 'center', height: 35, width: 35, borderRadius: 50, marginLeft: 10 }}>
                    <Image style={{ height: 30, width: 30 }} source={require('../assets/img/profileImg.png')} />
                </View>
            </TouchableOpacity>

        </View>
    );
}



export default Header;