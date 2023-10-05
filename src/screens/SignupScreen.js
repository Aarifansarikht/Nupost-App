import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking, KeyboardAvoidingView, Pressable, ActivityIndicator, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { firestore } from "../firebase/firebase";
import { addDoc, collection } from '@firebase/firestore';
import CheckBox from '@react-native-community/checkbox';


function SignupScreen({ navigation }) {

    const dbRef = collection(firestore, 'users');
    const [clicked, setClicked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handlePasswordShow = () => setShowPassword(!showPassword);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isPasswordMatch, setIsPasswordMatch] = useState(false)
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmpasswordError, setconfirmPasswordError] = useState(false);
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const passEmailRegex = /^(?=.*[@])$/
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const toggleTermsCheck = () => {
        setIsTermsChecked(!isTermsChecked);
    };


    const storeUser = async () => {
        setClicked(true)
        if (name === '' || email === '' || password === '' || confirmPassword === '' || !passRegex.test(password) || email.indexOf('@') === -1) {
            if (name === "") {
                setNameError(true)
            } else {
                setNameError(false)
            }
            if (email === "" || email.indexOf('@') === -1) {
                setEmailError(true)
            } else {
                setEmailError(false)
            }
            if (password === "") {
                setPasswordError(true)
            } else {
                setPasswordError(false)
            }
            if (confirmPassword === "") {
                setconfirmPasswordError(true)
            } else {
                setconfirmPasswordError(false)
            }
            setClicked(false)
            return;
        }

        setIsLoading(true);
        try {
            const docRef = await addDoc(dbRef, {
                name,
                email,
                password,
            });
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsLoading(false);
            setModalVisible(true);

            navigation.navigate('LogIn', { modalVisible });
            setClicked(false)
        } catch (error) {
            console.error('Error found: ', error);
            setClicked(false)

            setIsLoading(false);
        }
    };





    const handleNameChange = (text) => {
        setName(text);
        if (name !== "") {
            setNameError(false)
        }
    }

    const handleEmailChange = (text) => {
        setEmail(text)
        if (email !== "") {
            setEmailError(false)
        }
    }

    const handlePasswordChange = (text) => {
        setPassword(text)
        if (password !== "") {
            setPasswordError(false)
        }
    }

    const handleConfirmPassword = (text) => {
        setConfirmPassword(text)
        if (password === text) {
            setIsPasswordMatch(false)
        } else {
            setIsPasswordMatch(true)
        }
    }
    const openTermsAndConditionsLink = () => {
        const url = 'https://nupost-app.web.app/terms-and-condition.html';
        Linking.openURL(url);
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
                            <View style={styles.signup_text_container}>
                                <Text style={styles.signup_text}>Sign Up</Text>
                            </View>
                            <View style={styles.inputfields}>
                                <FontAwesome name='user' size={25} style={styles.inputfields_icons} />
                                <TextInput style={styles.textfields} placeholder='Name' placeholderTextColor={'black'} value={name} onChangeText={handleNameChange}></TextInput>
                            </View>
                            {nameError && <Text style={styles.error_text} >Name must be filled out.</Text>}

                            <View style={styles.inputfields}>
                                <MaterialIcons name='email' size={20} style={styles.inputfields_icons} />
                                <TextInput style={styles.textfields} placeholder='Email' placeholderTextColor={'black'} value={email} onChangeText={handleEmailChange}></TextInput>
                            </View>
                            {emailError && <Text style={styles.error_text} > eg: xyz@gmail.com</Text>}

                            <View style={styles.inputfields}>
                                <MaterialIcons name='lock' size={20} style={styles.inputfields_icons} />
                                <TextInput style={styles.textfields} placeholder='Password' secureTextEntry={showPassword ? false : true} placeholderTextColor={'black'} value={password} onChangeText={handlePasswordChange}></TextInput>
                                <TouchableOpacity style={styles.inputfields_icons} onPress={handlePasswordShow} activeOpacity={0.8}>
                                    <Ionicons name={showPassword ? "eye" : "eye-off"} style={{ color: 'black' }} size={20} />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? <Text style={styles.error_text} >Password must be filled out.</Text> : password !== "" && !passRegex.test(password) ? <Text style={{ color: 'red', marginBottom: 20 }}>Minimum 8 characters,  at least 1 uppercase and lowercase letter , 1 number and 1 special character</Text> : ""}

                            <View style={styles.inputfields}>
                                <MaterialIcons name='lock' size={20} style={styles.inputfields_icons} />
                                <TextInput style={styles.textfields} placeholder='Confirm Password' secureTextEntry={showPassword ? false : true} placeholderTextColor={'black'} value={confirmPassword} onChangeText={handleConfirmPassword}></TextInput>
                                <TouchableOpacity style={styles.inputfields_icons} onPress={handlePasswordShow} activeOpacity={0.8}>
                                    <Ionicons name={showPassword ? "eye" : "eye-off"} style={{ color: 'black' }} size={20} />
                                </TouchableOpacity>
                            </View>
                            {confirmpasswordError && <Text style={styles.error_text} >ConfirmPassword must be filled out</Text>}

                            {isPasswordMatch && <Text style={styles.error_text} >Password not Match</Text>}
                            <View style={styles.terms_container}>
                                <CheckBox
                                    value={isTermsChecked}
                                    onValueChange={toggleTermsCheck}
                                    style={styles.checkbox}
                                />
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={styles.terms_label}>I agree to the <Text onPress={openTermsAndConditionsLink} style={{ textDecorationLine: 'underline', marginLeft: 20 }}>Terms and Conditions</Text></Text>

                                </View>
                            </View>


                            {
                                clicked ? <ActivityIndicator size={'large'} color={'white'} marginTop={20} /> :
                                    <TouchableOpacity
                                        style={[
                                            styles.submit_btn,
                                            isTermsChecked ? null : styles.disabled_submit_btn 
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            if (isTermsChecked) {
                                                storeUser();
                                            }
                                        }}
                                        disabled={!isTermsChecked} 
                                    >
                                        <View>
                                            <Text style={styles.submit_btn_text}>Sign Up</Text>
                                        </View>
                                    </TouchableOpacity>
                            }
                        </View>
                    </KeyboardAvoidingView>

                </ScrollView>
            </View>
        </SafeAreaView>
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
    top_image: {
        height: 200,
        width: 330
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
    signup_text_container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    signup_text: {
        fontSize: 25,
        fontWeight: '900',
        color: 'white'
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
    inputfields_icons: {
        color: 'black',
        padding: 6,
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
    error_text: {
        color: 'red',
        marginBottom: 10
    },
    terms_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    terms_label: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',

        alignItems: 'center',

    },
    disabled_submit_btn: {
        backgroundColor: 'gray', // Style for the disabled button
    },

})

export default SignupScreen;