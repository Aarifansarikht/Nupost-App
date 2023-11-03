import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking, KeyboardAvoidingView, Pressable, PermissionsAndroid, ActivityIndicator, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { firestore } from "../firebase/firebase";
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/firebase';
import { addDoc, collection } from '@firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import 'firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';

import ImagePicker from 'react-native-image-crop-picker';
import { BottomSheetScrollView, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
    const [image, setImage] = useState(null);
    const [politicalImgUrl, setPoliticalImgUrl] = useState(null);
    const [mobileNumber, setMobileNumber] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [politicalParty, setPoliticalParty] = useState(null);
    const [InstaUrl,setInstaUrl] = useState('')
    const [FacebookUrl,setFacebookUrl] = useState('')
    const [TwitterUrl,setTwitterUrl] = useState('')
    const [WhatsappNumber, setWhatsappNumber] = useState('');
    

    const toggleTermsCheck = () => {
        setIsTermsChecked(!isTermsChecked);
    };

    const bottomSheetModalRef = useRef(null);

    const handleImagePick = () => {
        bottomSheetModalRef.current?.present();
    };


    const openCamera = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Permission granted, you can now open the camera
                ImagePicker.openCamera({
                    compressImageMaxWidth: 300,
                    compressImageMaxHeight: 300,
                    cropping: true,
                    compressImageQuality: 0.7,
                }).then((image) => {
                    console.log(image);
                    setImage(image.path);
                });
            } else {
                console.warn('Camera permission denied');
            }
        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }
    };


    const openLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            console.log(image);
            setImage(image.path);
        });
    }
    const cancelUpload = () => {
        bottomSheetModalRef.current?.close();
    };


    const storeUser = async () => {
        setClicked(true)
        if (name === '' || email === '' || password === '' || confirmPassword === '' || password === "" || email.indexOf('@') === -1) {
            if (name === "") {
                setNameError(true)
            } else {
                setNameError(false)
            }
            if (email === "" || email.indexOf('@') === -1) {
                setEmailError(true)
            } else {
                setEmailError(false)
            }pan
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
            const imageUrl = await uploadImage();
            const docRef = await addDoc(dbRef, {
                name,
                email,
                password,
                imageUrl,
                politicalImgUrl,
                mobileNumber,
                designation,
                WhatsappNumber,
                politicalParty,
                InstaUrl,
                FacebookUrl,
                TwitterUrl,
                timestamp:Date.now()
            });
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setImage(null);
            setPoliticalImgUrl(null);
            setDesignation('');
            setMobileNumber('');
            setWhatsappNumber('')
            setInstaUrl('')
            setFacebookUrl('')
            setTwitterUrl('')
            setPoliticalParty('');
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



    const uploadImage = async () => {
        if (image == null) {
            return null;
        }

        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        const storageRef = ref(storage, `user_profile/${filename}`);

        try {
            // Fetch the image data from the local file path
            const response = await fetch(uploadUri);
            const blob = await response.blob();

            // Upload the image to Firebase Cloud Storage
            const uploadTaskSnapshot = await uploadBytes(storageRef, blob, {
                contentType: 'image/jpeg', // Specify the content type here
            });

            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(storageRef);

            // Set the image URL state or use it as needed
            setImage(imageUrl);

            // Display a success message or perform any other necessary actions
            Alert.alert(
                'Image uploaded!',
                'Your image has been uploaded to Firebase Cloud Storage successfully!'
            );

            return imageUrl;
        } catch (e) {
            console.error('Error uploading image:', e);
            return null;
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
        <BottomSheetModalProvider>
            <SafeAreaView style={styles.main_container}>
                <View style={styles.top_container}>
                    <Image style={styles.top_image} source={require('../assets/img/welcomeimg.png')}></Image>
                </View>
                <View style={styles.bottom_container}>

                    <ScrollView>
                        <KeyboardAvoidingView behavior='padding'>

                            <View style={styles.form_wrapper}>

                                <View>
                                    <View style={styles.profile_img_container}>

                                        <TouchableOpacity onPress={handleImagePick}>
                                            {image ? (
                                                <Image style={styles.profile_img} source={{ uri: image }} />
                                            ) : (
                                                <Image
                                                    style={styles.profile_img}
                                                    source={require('../assets/img/profileImg.png')}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    <BottomSheetModal
                                        ref={bottomSheetModalRef}
                                        index={0}
                                        snapPoints={['30%', '50%']}
                                        backdropComponent={null}
                                    >
                                        <BottomSheetScrollView >
                                            <View styles={styles.button_wrapper}>

                                                <TouchableOpacity onPress={openCamera}>
                                                    <View style={styles.button}>
                                                        <Text style={styles.buttonText}>Open Camera</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={openLibrary}>
                                                    <View style={styles.button}>
                                                        <Text style={styles.buttonText}>Open Library</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={cancelUpload}>
                                                    <View style={styles.button}>
                                                        <Text style={styles.buttonText}>Cancel</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </BottomSheetScrollView>
                                    </BottomSheetModal>
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
                                {passwordError ? <Text style={styles.error_text} >Password must be filled out.</Text> : password !== "" && password.length < 8 ? <Text style={{ color: 'red', marginBottom: 20 }}>Password must be contain 8 characters?</Text> : ""}

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
        </BottomSheetModalProvider>
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
        flex: 3,
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
    profile_img_container: {

        flex: 1,
        alignItems: 'center',
        height: 110

    }
    ,
    profile_img_wrapper: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        width: 90,
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,

    },
    profile_img: {
        height: 80,
        width: 80,
        borderRadius: 50
    },


    button: {
        borderWidth: 2,
        borderColor: 'black',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center'

    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center'
    }

})

export default SignupScreen;