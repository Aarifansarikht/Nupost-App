import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import { Image, View, Button, Text, StyleSheet } from 'react-native';
import { collection, getDocs, query, where, doc, updateDoc } from '@firebase/firestore';
import { firestore } from "../firebase/firebase";
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/firebase';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ImagePicker from 'react-native-image-crop-picker';

import { BottomSheetScrollView, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { deleteObject } from 'firebase/storage';

function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [profileimg, setProfileImg] = useState(null);
    const [politicalImgUrl, setPoliticalImgUrl] = useState(null);
    const [mobileNumber, setMobileNumber] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [politicalParty, setPoliticalParty] = useState(null);

    console.warn(profileimg);


    const handleLogout = async () => {
        await AsyncStorage.removeItem('keepLoggedIn');
        navigation.navigate('Welcome')
    };

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
    const getUserIDByEmail = async (email) => {
        const querySnapshot = await getDocs(collection(firestore, "users"));

        let userId = null;

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.email === email) {
                userId = doc.id;
            }
        });

        return userId;
    }
    const emailToFind = userData?.userData.email;
    const updateProfile = async () => {
        const userId = await getUserIDByEmail(emailToFind);
        const imageUrl = await uploadImage();
        const docRef = doc(firestore, "users", userId);
        await updateDoc(docRef, {
            designation: designation,
            mobileNumber: mobileNumber,
            politicalParty: politicalParty,
            imageUrl: imageUrl
        });
    }
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
                    setProfileImg(image.path)
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
            setProfileImg(image.path)

        });
    }
    const cancelUpload = () => {
        bottomSheetModalRef.current?.close();
    };


    const uploadImage = async () => {
        if (profileimg == null) {
            return null;
        }

        const uploadUri = profileimg;
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

            setProfileImg(imageUrl)
            // Display a success message or perform any other necessary actions
            alert(
                'Image uploaded!',
                'Your image has been uploaded to Firebase Cloud Storage successfully!'
            );

            return imageUrl;
        } catch (e) {
            console.error('Error uploading image:', e);
            return null;
        }
    };

    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={styles.main_container}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.profile_container}>
                        <View style={styles.images_wrapper}>
                            <TouchableOpacity onPress={handleImagePick}>


                                <View>
                                    <View style={styles.logos}>
                                        {
                                            profileimg ? (

                                                <Image style={styles.logo_images} resizeMode='contain' source={{ uri: profileimg }} />

                                            )
                                                :
                                                (<Image style={styles.logo_images} resizeMode='contain' source={{ uri: userData?.userData.imageUrl }} />)
                                        }
                                        <MaterialIcons style={{ position: 'absolute', right: 10, bottom: 0, color: 'black' }} name='add-a-photo' size={30} />
                                    </View>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 12 }}>Upload Profile</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View>
                                    <View style={styles.logos}>
                                        <Image style={styles.logo_images} resizeMode='contain' source={{ uri: userData?.userData.imageUrl }} />
                                        <MaterialIcons style={{ position: 'absolute', right: 10, bottom: 0, color: 'black' }} name='add-a-photo' size={30} />
                                    </View>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 12 }}>Upload Political Logo</Text>
                                </View>
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
                        <View style={styles.fields_wrapper}>
                            {userData?.userData && userData?.userData.email ? (
                                <>
                                    <View >
                                        <TextInput style={styles.textInput} value={userData.userData.name} placeholderTextColor="#888" />
                                        <TextInput style={styles.textInput} value={userData.userData.email} placeholderTextColor="#888" />
                                        <TextInput style={styles.textInput} value={mobileNumber} placeholder='Mobile Number' placeholderTextColor="#888" onChangeText={(text) => setMobileNumber(text)} />
                                        <TextInput style={styles.textInput} value={designation} placeholder='Designation' placeholderTextColor="#888" onChangeText={(text) => setDesignation(text)} />
                                        <TextInput style={styles.textInput} value={politicalParty} placeholder='Political Party' placeholderTextColor="#888" onChangeText={(text) => setPoliticalParty(text)} />
                                        <TouchableOpacity style={styles.profile_edit_btn} onPress={updateProfile}>
                                            <Text style={styles.logout_btn_text}>Update Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.logout_btn} onPress={handleLogout}>
                                            <Text style={styles.logout_btn_text}>Log Out</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <Text>User data not available</Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </BottomSheetModalProvider>
    )
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        padding: 5
    },
    profile_container: {
        flex: 1
    },
    images_wrapper: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-around'
    },
    fields_wrapper: {

        padding: 20
    },
    logos: {
        backgroundColor: 'skyblue',
        height: 120,
        width: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo_images: {
        height: 120,
        width: 120,
        borderRadius: 100
    },
    textInput: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: 'black', // Color of the text entered by the user
    },
    logout_btn: {
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,

    },
    logout_btn_text: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16
    },
    profile_edit_btn: {
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    }
    ,
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

export default ProfileScreen;