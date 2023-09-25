import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, getDocs, query, where } from '@firebase/firestore';
import { firestore } from "../firebase/firebase";
function VarifyOtp({navigation}) {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [clicked, setClicked] = useState(true);
    const [loginError, setLoginError] = useState(null);

    const handleFormValidation = (event) => {
        event.preventDefault()
        if (email === "") {
            setEmailError(true)
        } else {
            setEmailError(false);
            handleFormSubmit();
        }
    }
    const handleFormSubmit = ()=>{
        navigation.navigate('resetpassword')
    }
    return (
        <SafeAreaView style={styles.main_container}>


        <View style={styles.top_container}>
            <Image style={styles.top_image} source={require('./../../assets/img/welcomeimg.png')}></Image>
        </View>

        <View style={styles.bottom_container}>
            <ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.form_wrapper}>
                        <View style={styles.login_text_container}>
                            <Text style={styles.login_text}>Enter verification code</Text>
                            <Text>We have sent you <Text style={{fontWeight:'900'}}>One Time Password</Text> to your email</Text>
                        </View>

                        <View style={styles.inputfields}>
                            <TextInput style={styles.textfields} placeholder='Enter Here' placeholderTextColor={'gray'} value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                        </View>
                        {emailError && <Text style={styles.error_text} >Email must be filled out.</Text>}


                        {
                            clicked ? <TouchableOpacity style={styles.submit_btn} activeOpacity={0.7} onPress={handleFormValidation}>

                                <Text style={styles.submit_btn_text}>Verify OTP</Text>

                            </TouchableOpacity> : <ActivityIndicator size="large" color={'white'} marginTop={20} />
                        }

                        <View >
                            {loginError && <Text style={styles.login_error_text}>{loginError}</Text>}
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    </SafeAreaView >
    );
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
    bottom_container: {
        flex: 2,
        backgroundColor: 'black',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    form_wrapper: {
        flex: 1,
        padding: 20,
    },
    inputfields: {
        backgroundColor: 'white',
        marginBottom: 15,
        padding: 2,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textfields: {
        fontWeight: '900',
        fontSize: 15,
        flex: 1,
        color: 'black',
        padding:10
    },
    top_image: {
        height: 200,
        width: 330
    },
    login_text_container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    login_text: {
        fontSize: 25,
        fontWeight: '900',
        color: 'white',
        marginBottom:20
    },
    inputfields_icons: {
        color: 'black',
        padding: 6,
    },
    forgot_pass_text: {
        fontSize: 15,
        color: 'white',
        fontWeight: '800'
    },
    submit_btn: {
        backgroundColor: 'white',
        padding: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, borderRadius: 5
    },
    submit_btn_text: {
        color: 'black',
        fontWeight: '900',
        fontSize: 15
    },
    login_error_text: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 15
    },
    error_text:{
        color:'red',
        marginBottom:10
    }


})
export default VarifyOtp;