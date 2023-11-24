import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import ContactInfoPopup from './ContactInfoPopup';
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
  console.log(userData, 'header');
  const [popupVisible, setPopupVisible] = useState(false);
  // const [userData, setUserData] = useState(null);

  const togglePopup = () => {
    console.log('popup called');
    setPopupVisible(!popupVisible);
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

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
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'black',
          paddingBottom: 5,
          paddingTop: 5,
        }}>
        <TouchableOpacity
          onPress={handleProfile}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}>
          <View
            style={{
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
              height: 24,
              width: 24,
              borderRadius: 50,
              marginLeft: 10,
              borderWidth: 1,
              borderColor: '#fff',
            }}>
            {userData?.userData?.imageUrl ? (
              <Image
                style={{height: '100%', width: '100%', borderRadius: 20}}
                source={{uri: userData?.userData?.imageUrl}}
              />
            ) : (
              <Image
                style={{height: '100%', width: '100%', borderRadius: 20}}
                source={require('../assets/img/profileImg.png')}
              />
            )}
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 500,
              paddingLeft: 10,
            }}>
            Profile
          </Text>
        </TouchableOpacity>

        <View style={{alignItems: 'center', textAlign: 'center', gap: 3}}>
          <TouchableOpacity>
            <Feather
              name="help-circle"
              style={{color: 'white', padding: 2}}
              size={20}
            />
          </TouchableOpacity>
          <Text style={style.headerIconText}>Use how</Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}>
          <Image
            source={require('../assets/img/logo2.png')} // Use the correct source for the right image
            style={{
              height: 40,
              width: 70,
              resizeMode: 'contain',
              marginTop: 5,
            }}
          />
        </View>

        <View style={{alignItems: 'center', textAlign: 'center', gap: 3}}>
          <TouchableOpacity onPress={togglePopup}>
            <Feather
              name="phone-call"
              style={{color: 'white', padding: 2}}
              size={20}
            />
          </TouchableOpacity>
          <Text style={style.headerIconText}>Support</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            gap: 3,
            alignItems: 'center',
            textAlign: 'center',
            paddingRight: 8,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather
              name="search"
              style={{color: 'white', padding: 2}}
              size={20}
            />
          </TouchableOpacity>
          <Text style={style.headerIconText}>Search</Text>
        </View>
      </View>
      <ContactInfoPopup visible={popupVisible} onClose={togglePopup} />
    </>
  );
}
const style = StyleSheet.create({
  headerIconText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default Header;
