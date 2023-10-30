import React,{useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


function Header() {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);

    const handleProfile = () => {
        navigation.navigate('Profile')
    }

    const getUserData = async () => {
        const data = await AsyncStorage.getItem('userData');
   
        if (data) {
            const parsedData = JSON.parse(data);
          
            console.log("Parsed_____________header_________data",parsedData)
            setUserData(parsedData);
        }
    };
    // console.log(userData?.userData?.imageUrl,"userdata")

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleProfile}>
                <View style={{ backgroundColor: '#5F76FD', justifyContent: 'center', alignItems: 'center', height: 35, width: 35, borderRadius: 50, marginLeft: 10 }}>
                    {userData?.userData?.imageUrl ? <Image style={{ height: "100%", width: "100%", borderRadius: 20 }} source={{ uri: userData?.userData?.imageUrl }} /> :
                        <Image style={{ height: "100%", width: "100%", borderRadius: 20 }} source={require("../assets/img/profileImg.png")} />
                    }
                </View>
            </TouchableOpacity>

            <Image
                source={require("../assets/img/welcomeimg.png")} // Use the correct source for the right image
                style={{ height: 150, width: 150, borderRadius: 50, marginLeft: '25%' }}
            />
        </View>
    );
}



export default Header;