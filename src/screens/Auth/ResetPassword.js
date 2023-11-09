import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator ,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, getDocs, query, where ,addDoc} from '@firebase/firestore';
import { firestore } from "../../firebase/firebase";
import { useNavigation } from '@react-navigation/native';



function ResetPassword(props) {
    const dbRef = collection(firestore, 'ResetPasswordRequest');
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);

    const [clicked, setClicked] = useState(true);
    const [showAlert,setShowAlert] = useState(false);
    const [title,setTitle] = useState('')
    const [message,setMessage] = useState('')
    const [isLoading , setIsLoading] = useState(true);

    const getUserIDByEmail = async email => {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
    
        let userId = null;
    
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.email === email) {
            userId = doc.id;
          }
        });
    
        return userId;
      };

      const hideAlert = () => {
        setShowAlert(false);
      };
    
      const confirmAlert = async () => {
        navigation.navigate('LogIn');
      };
    
// const getUserData =async () => {

//     const querySnapshot = await getDocs(collection(firestore, 'ResetPasswordRequest'));
//     querySnapshot.forEach(doc => {
//         const userData = doc.data();
//         console.log(userData,"Data")
//     });
// }
  
// useEffect(()=>{
//  getUserData()
// },[])


    const resetPasswordRequest = async () => {
        setClicked(true)
        if (name === '' || email === '' || phone === ''  || email.indexOf('@') === -1) {
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
            if (phone === "") {
                setPhoneError(true)
            } else {
                setPhoneError(false)
            }
            // setClicked(false)
            return;
        }
        setClicked(false)
         const userId = await getUserIDByEmail(email)
         if(!userId){
             setTitle("Invalid Email")
             setMessage("User Not Found with This Email Address Please check your email")
             setShowAlert(true)
            // Alert.alert("Invalid Email", "User Not Found with This Email Address Please check your email");
            setClicked(true)
             return;
         }
        try {
            const docRef = await addDoc(dbRef, {
                userId,
                name,
                email,
                phone,
                timestamp:Date.now()
            });
            console.log(docRef,"documnet submit")
            setName('');
            setEmail('');
            setPhone('')
            setIsLoading(false);
            setClicked(true)
            setTitle("Success")
            setMessage("Reset Password Request Submit Succesfully")
            setShowAlert(true)
        } catch (error) {
            console.error('Error found: ', error);
            setClicked(false)
            setIsLoading(false);
        }
    };




    return (
        <SafeAreaView style={styles.main_container}>


        <View style={styles.top_container}>
            <Image style={styles.top_image} source={require('../../assets/img/welcomeimg.png')}></Image>
        </View>

        <View style={styles.bottom_container}>
            <ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.form_wrapper}>
                        <View style={styles.login_text_container}>
                            <Text>Please Enter the Details Below</Text>
                        </View>
                        <View style={styles.inputfields}>
                        <FontAwesome name='user' size={25} style={styles.inputfields_icons} />
                            <TextInput style={styles.textfields} placeholder='Name'  placeholderTextColor={'black'} value={name} onChangeText={(text) => setName(text)}></TextInput>
                        </View>    
                        {nameError && <Text style={styles.error_text}>Name must be filled out.</Text>}
                        <View style={styles.inputfields}>
                            <MaterialIcons name='email' size={20} style={styles.inputfields_icons} />
                            <TextInput style={styles.textfields} placeholder='Email'  placeholderTextColor={'black'} value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                        </View>  
                        {emailError && <Text style={styles.error_text}>Please enter a valid email address</Text>}
                          <View style={styles.inputfields}>
                            <MaterialIcons name='phone' size={20} style={styles.inputfields_icons} />
                            <TextInput style={styles.textfields} placeholder='Mobile'  placeholderTextColor={'black'} value={phone} onChangeText={(text) => setPhone(text)}></TextInput>
                        </View>  
                        {phoneError && <Text style={styles.error_text}>MobileNumber must be filled out.</Text>}
                        {
                            clicked ? <TouchableOpacity style={styles.submit_btn} activeOpacity={0.7} onPress={resetPasswordRequest}>
                                <Text style={styles.submit_btn_text}>Submit</Text>
                            </TouchableOpacity> : <ActivityIndicator size="large" color={'white'} marginTop={20} />
                        }
                        {/* <View >
                            {loginError && <Text style={styles.login_error_text}>{loginError}</Text>}
                        </View> */}
                    </View>
                    <AwesomeAlert
                                show={showAlert}
                                showProgress={false}
                                title={title}
                                message={message}
                                closeOnTouchOutside={true}
                                closeOnHardwareBackPress={false}
                                showCancelButton={true}
                                showConfirmButton={true}
                                confirmText="Ok"
                                confirmButtonColor="#DD6B55"
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

export default ResetPassword;