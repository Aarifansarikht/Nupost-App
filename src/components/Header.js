import React,{useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, View, Text,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import Feather from 'react-native-vector-icons/Feather'
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
  } from '@firebase/firestore';
import {firestore} from '../firebase/firebase';
import {storage, ref, uploadBytes, getDownloadURL} from '../firebase/firebase';

function Header({userData}) {
    const navigation = useNavigation();
    console.log(userData,"header")
    // const [userData, setUserData] = useState(null);

    const handleProfile = () => {
        navigation.navigate('Profile')
    }

    // const getUserData = async () => {
    //     try {
    //       const data = await AsyncStorage.getItem('userData');
    //       if (data) {
    //         const parsedData = JSON.parse(data);
    //         console.log("Parsed_____________user_data", parsedData)
    //         const email = parsedData?.userData?.email;
    //         const usersRef = collection(firestore, 'users');
    //         const q = query(usersRef, where('email', '==', email));
    //         const querySnapshot = await getDocs(q);
    //         const userDoc = querySnapshot.docs[0];
    //         const updatedData = userDoc?.data();
    //         setUserData({userData:updatedData});
    //       }
    //     } catch (error) {
    //       console.log(error,"error")
    //     }
    //   };


    // useEffect(() => {
    //     getUserData();
    // }, []);

    return (
        <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between",backgroundColor:"white"}}>
            <TouchableOpacity onPress={handleProfile}>
                <View style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', height: 35, width: 35, borderRadius: 50, marginLeft: 10 }}>
                    {userData?.userData?.imageUrl ? <Image style={{ height: "100%", width: "100%", borderRadius: 20 }} source={{ uri: userData?.userData?.imageUrl }} /> :
                        <Image style={{ height: "100%", width: "100%", borderRadius: 20 }} source={require("../assets/img/profileImg.png")} />
                    }
                </View>
            </TouchableOpacity>
                        <View>
                                        <TouchableOpacity ><Feather name='help-circle' style={{ color: 'black', padding: 5 ,}} size={20} /></TouchableOpacity>
                                        <Text style={{color:"black",fontSize:14}}>Use how</Text>
                        </View>

                   <View>
                         <Image
                            source={require("../assets/img/logo.png")} // Use the correct source for the right image
                            style={{ height: 50, width: 70,resizeMode:"contain",marginTop:5}}
                            />
                   </View>
                                    <View>
                                                <TouchableOpacity ><Feather name='phone-call' style={{ color: 'black', padding: 5 }} size={20} /></TouchableOpacity>
                                                <Text style={{color:"black",fontSize:14}}>Support</Text>
                                    </View>
                                    <View style={{justifyContent:"center"}}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Search')}><Feather name='search' style={{ color: 'black', padding: 5 }} size={20} /></TouchableOpacity>
                                        <Text style={{color:"black",fontSize:14}}>Search</Text>
                                    </View>
                 
        </View>
    );
}



export default Header;