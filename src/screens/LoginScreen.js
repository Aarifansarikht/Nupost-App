import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Modal, Pressable, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, getDocs, query, where } from '@firebase/firestore';
import { firestore } from "../firebase/firebase";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getUserData } from '../redux/action/imageData';
import AwesomeAlert from 'react-native-awesome-alerts';
function LoginScreen() {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const handlePasswordShow = () => setShowPassword(!showPassword)
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [name, setName] = useState('')
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [clicked, setClicked] = useState(true);
    const  [showAlert,setShowAlert] = useState(false)


    const handleLogin = async () => {
        try {
            if (email === '' || password === '') {
                if (email === "") {
                    setEmailError(true)
                } else {
                    setEmailError(false)
                }
                if (password === "") {
                    setPasswordError(true)
                } else {
                    setPasswordError(false)
                }
                setClicked(true);
                return;
            }
            setClicked(false);
            if (!email) {
                setClicked(true);
                setLoginError('Email is required.');
                return;
            }

            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc?.data();

            if (querySnapshot.empty) {
                setClicked(true);
                setLoginError('User not found!');
                return;
            }
            if (!userData || userData.password !== password) {
                setClicked(true);
                setLoginError('Incorrect email or password');
                return;
            }
            setName(userData.name)
            const user = { userData };
            console.log("UserData__________loginScreen",JSON.stringify(user))
            // dispatch(getUserData(user));
            AsyncStorage.setItem('userData', JSON.stringify(user));
            AsyncStorage.setItem('keepLoggedIn', JSON.stringify(true));
            navigation.navigate('Home');
            setEmail('');
            setPassword('');
            setLoginError(null);
            setClicked(true);
        } catch (error) {
            console.error('Login error:', error);
            setClicked(true);
            setLoginError('An error occurred');
        }
    };

                const hideAlert = () => {
                     setShowAlert(false);
                };
    
            const confirmAlert =  () => {
                navigation.navigate('resetpassword');
                setShowAlert(false)
            };
    
    return (
        <SafeAreaView style={styles.main_container}>
            <View style={styles.top_container}>
                <Image style={styles.top_image} source={require('../assets/img/welcomeimg.png')}></Image>
            </View>
            <View style={styles.bottom_container}>
                <ScrollView>
                    <KeyboardAvoidingView behavior='padding'>
                        <View style={styles.form_wrapper}>
                            <View style={styles.login_text_container}>
                                <Text style={styles.login_text}>Log In</Text>
                            </View>
                            <View style={styles.inputfields}>
                                <MaterialIcons name='email' size={20} style={styles.inputfields_icons} />
                                <TextInput style={styles.textfields} placeholder='Email' placeholderTextColor={'black'} value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                            </View>
                            {emailError && <Text style={styles.error_text} >Email must be filled out.</Text>}
                            <View style={styles.inputfields}>
                                <MaterialIcons name='lock' size={20} style={styles.inputfields_icons} />
                                <TextInput style={styles.textfields} placeholder='Password' secureTextEntry={showPassword ? false : true} placeholderTextColor={'black'} value={password} onChangeText={(text) => setPassword(text)}></TextInput>
                                <TouchableOpacity style={styles.inputfields_icons} onPress={handlePasswordShow} activeOpacity={0.8}>
                                    <Ionicons name={showPassword ? "eye" : "eye-off"} style={{ color: 'black' }} size={20} />
                                </TouchableOpacity>
                            </View>
                            {passwordError && <Text style={styles.error_text}>Password must be filled out.</Text>}
                            <View>
                                <TouchableOpacity onPress={() => setShowAlert(true)}>
                                    <Text style={styles.forgot_pass_text}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            { clicked ? <TouchableOpacity style={styles.submit_btn} activeOpacity={0.7} onPress={handleLogin}>
                                    <Text style={styles.submit_btn_text}>Log In</Text>
                                </TouchableOpacity> : <ActivityIndicator size="large" color={'white'} marginTop={20} />
                            }
                            <View >
                                {loginError && <Text style={styles.login_error_text}>{loginError}</Text>}
                            </View>
                        </View>
                        <AwesomeAlert
                                show={showAlert}
                                showProgress={false}
                                title={'Forgot Password?'}
                                message={'Are you sure, You want to submit the reset password request?'}
                                closeOnTouchOutside={true}
                                closeOnHardwareBackPress={false}
                                showCancelButton={true}
                                showConfirmButton={true}
                                cancelText="No, cancel"
                                confirmText="YES"
                                confirmButtonColor="#DA6F29"
                                onCancelPressed={hideAlert}
                                onConfirmPressed={confirmAlert}
                            />
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
        color: 'black'
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
        color: 'white'
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
    error_text: {
        color: 'red',
        marginBottom: 10
    }


})

export default LoginScreen;