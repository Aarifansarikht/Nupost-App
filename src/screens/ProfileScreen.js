import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, View, Button, Text, StyleSheet } from 'react-native';


import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
function ProfileScreen({ navigation }) {
    const handleLogout = async () => {

        await AsyncStorage.removeItem('keepLoggedIn');
        navigation.navigate('Welcome')
    };

    const [userData, setUserData] = useState(null);
    console.warn(userData);
    useEffect(() => {
        const getUserData = async () => {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const parsedData = JSON.parse(data);
                setUserData(parsedData);
            }
        };
        getUserData();
    }, []);
    return (



        // <SafeAreaView>



        // </SafeAreaView>

        <SafeAreaView style={styles.main_container}>
            <View style={styles.top_container}>
                <Image style={styles.top_img} source={require('../assets/img/welcomeimg.png')}></Image>
            </View>
            <View style={styles.bottom_container}>
                <View style={styles.profile_img_wrapper}>
                    <Image style={styles.profile_img} source={{uri:userData?.userData.imageUri}} />
                </View>
                <View style={styles.fields_wrapper}>
                    {userData?.userData && userData?.userData.email ? (
                        <>
                            <View >
                                <TextInput style={styles.textfields} value={userData.userData.email} />
                                <TextInput style={styles.textfields} value={userData.userData.password} />
                                <TextInput style={styles.textfields} value={userData.userData.name} />
                                <TouchableOpacity style={styles.logout_btn} onPress={handleLogout}>
                                    <Text style={styles.logout_btn_text}>Log Out</Text>
                                </TouchableOpacity>
                            </View>{
                                console.warn(userData)
                            }


                        </>
                    ) : (
                        <Text>User data not available</Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: 'white',
    },
    top_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    top_img: {
        height: 200,
        width: 330
    },
    profile_img_wrapper: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        borderRadius: 50,
        marginLeft: 10,
        position: 'absolute',
        top: -25
    },
    profile_img: {
        height: 80,
        width: 80
    },
    bottom_container: {
        flex: 2,
        backgroundColor: 'black',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30, alignItems: 'center'
    },
    fields_wrapper: {
        flex: 1,
        width: '100%',
        marginTop:80
    },
    textfields: {
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 10,
        fontSize: 20,
        marginBottom: 20,
        padding: 10
    },
    logout_btn: {
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        borderRadius: 20
    },
    logout_btn_text: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700'
    }

})

export default ProfileScreen;