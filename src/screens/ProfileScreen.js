import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  View,
  Button,
  Text,
  StyleSheet,
  Linking,
  PermissionsAndroid,
  Alert,
} from 'react-native';
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
import { useDispatch } from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';

import {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {deleteObject, updateMetadata} from 'firebase/storage';
import DropdownComponent from '../components/Dropdown';
import Logo_list from '../components/logo';

function ProfileScreen({navigation}) {
  const [userData, setUserData] = useState(null);
  const [UserName, setUserName] = useState(null);
  const [profileimg, setProfileImg] = useState('');
  const [politicalImgUrl, setPoliticalImgUrl] = useState('');
  const [mobileNumber, setMobileNumber] = useState(null);
  const [WhatsappNumber, setWhatsappNumber] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [politicalParty, setPoliticalParty] = useState('');
  const [showInsta, SetshowInsta] = useState(false);
  const [showFacebook, setshowFacebook] = useState(false);
  const [showTwitter, SetshowTwitter] = useState(false);
  const [InstaUrl, setInstaUrl] = useState(null);
  const [FacebookUrl, setFacebookUrl] = useState(null);
  const [TwitterUrl, setTwitterUrl] = useState(null);
  const [isProfile, setIsProfile] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState(null);

  const dispatch = useDispatch();
  // console.warn("profile________image",profileimg);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('keepLoggedIn');
    navigation.navigate('Welcome');
  };

  const handleSelectlogo = (uri) => {
    console.log('selected______frame_____uri', uri);
    setPoliticalImgUrl(uri);
  };

  // console.warn("User__________data",userData);
  const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');

    if (data) {
      const parsedData = JSON.parse(data);

      console.log('Parsed_____________user_data', parsedData);
      setUserData(parsedData);
    }
  };



  useEffect(() => {
    getUserData();
  }, []);

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

  const updateProfile = async () => {
    const emailToFind = userData?.userData.email;

    console.log('check___________Users', emailToFind);
    try {
      const userId = await getUserIDByEmail(emailToFind);
      console.log('userId______', userId);
      const imageUrl = await uploadImage();
      const imageUrl1 = await uploadImage1();
      console.log(
        'URL1_____________',
        imageUrl,
        'URL2_______________________',
        imageUrl1,
      );

      const docRef = doc(firestore, 'users', userId);
      console.log('docref_______________Data______log', docRef);
      const updatedData = {
        name: UserName || userData?.userData?.name,
        designation: designation || userData?.userData?.designation,
        imageUrl: imageUrl || userData?.userData?.imageUrl,
        mobileNumber: mobileNumber || userData?.userData?.mobileNumber,
        politicalParty: politicalParty || userData?.userData?.politicalParty,
        politicalImgUrl: imageUrl1 || userData?.userData?.politicalImgUrl,
        InstaUrl: InstaUrl || userData?.userData?.InstaUrl,
        FacebookUrl: FacebookUrl || userData?.userData?.FacebookUrl,
        TwitterUrl: TwitterUrl || userData?.userData?.TwitterUrl,
        WhatsappNumber: WhatsappNumber || userData?.userData?.WhatsappNumber,
      };
      console.log('Update_______________Data______log', updatedData);
      
      await updateDoc(docRef, updatedData);
      Alert.alert(
        'Profile Updated Successfully!',
        'Your profile has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Welcome'),
          },
        ],
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please check the console for details.');
    }
  };

  const bottomSheetModalRef = useRef(null);
  const handleImagePick = () => {
    setIsProfile(true);
    bottomSheetModalRef.current?.present();
  };

  const handleImagePick1 = () => {
    setIsProfile(false);
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
        }).then(image => {
          console.log(image);
          if (isProfile) {
            setProfileImg(image.path);
          } else {
            setPoliticalImgUrl(image.path);
          }
          bottomSheetModalRef.current?.close();
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
      compressImageQuality: 0.7,
    }).then(image => {
      console.log('image', image);
      if (isProfile) {
        setProfileImg(image.path);
        console.log('isprofile_____________true');
      } else {
        setPoliticalImgUrl(image.path);
        console.log('isprofile_____________false', isProfile);
      }
      bottomSheetModalRef.current?.close();
    });
  };

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

      setProfileImg(imageUrl);

      // Display a success message or perform any other necessary actions
      alert(
        'Image uploaded!',
        'Your image has been uploaded to Firebase Cloud Storage successfully!',
      );

      return imageUrl;
    } catch (e) {
      console.error('Error uploading image:', e);
      return null;
    }
  };

  const uploadImage1 = async () => {
    // if (politicalImgUrl == null) {
    //     return null;
    // }

    const uploadUri = politicalImgUrl;
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

      setPoliticalImgUrl(imageUrl);

      // Display a success message or perform any other necessary actions
      alert(
        'Image uploaded!',
        'Your image has been uploaded to Firebase Cloud Storage successfully!',
      );

      return imageUrl;
    } catch (e) {
      console.error('Error uploading image:', e);
      return null;
    }
  };

  // console.log(politicalImgUrl,"image___________________url")

  const handlePartySelect =( selectedParty ,id) => {
    // Handle the selected party here
    console.log(id,"selected_paty_name_Id")
    setSelectedPartyId(id)
    setPoliticalParty(selectedParty);
    console.log('Selected party___________:', selectedParty);
  };



  

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.main_container}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.profile_container}>
            <View style={styles.images_wrapper}>
              <TouchableOpacity onPress={handleImagePick}>
                <View>
                  <View style={styles.logos}>
                    {profileimg ? (
                      <Image
                        style={styles.logo_images}
                        resizeMode="contain"
                        source={{uri: profileimg}}
                      />
                    ) : (
                      <Image
                        style={styles.logo_images}
                        resizeMode="contain"
                        source={{uri: userData?.userData.imageUrl}}
                      />
                    )}
                    <MaterialIcons
                      style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 0,
                        color: 'black',
                      }}
                      name="add-a-photo"
                      size={30}
                    />
                  </View>
                  <Text
                    style={{color: 'black', textAlign: 'center', fontSize: 12}}>
                    Upload Profile
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={handleImagePick1}>
                                <View>
                                    <View style={styles.logos}>

                                    {
                                          politicalImgUrl ? (

                                                <Image style={styles.logo_images} resizeMode='contain' source={{ uri: politicalImgUrl }} />

                                            )
                                                :
                                                (<Image style={styles.logo_images} resizeMode='contain' source={{ uri: userData?.userData.politicalImgUrl }} />)
                                        }
                                        <MaterialIcons style={{ position: 'absolute', right: 10, bottom: 0, color: 'black' }} name='add-a-photo' size={30} />
                                    </View>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 12 }}>Upload Political Logo</Text>
                                </View>
                            </TouchableOpacity> */}
            </View>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={['30%', '50%']}
              backdropComponent={null}>
              <BottomSheetScrollView>
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
            <View>
            
            </View>
            <View style={styles.fields_wrapper}>
              {userData?.userData && userData?.userData.email ? (
                <>
                  <View>
                    <TextInput
                      style={styles.textInput}
                      value={
                        UserName !== null
                          ? UserName
                          : userData.userData.name
                      }
                      placeholderTextColor="#888"
                      onChangeText={text =>setUserName(text)}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={userData.userData.email}
                      placeholderTextColor="#888"
                    />
                    <TextInput
                      style={styles.textInput}
                      value={
                        mobileNumber !== null
                          ? mobileNumber
                          : userData.userData.mobileNumber
                      }
                      placeholder="Mobile Number"
                      placeholderTextColor="#888"
                      onChangeText={text =>setMobileNumber(text)}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={
                        WhatsappNumber !== null
                          ? WhatsappNumber
                          : userData.userData.WhatsappNumber
                      }
                      placeholder="WhatsApp Number"
                      placeholderTextColor="#888"
                      onChangeText={text => setWhatsappNumber(text)}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={
                        designation !== null
                          ? designation
                          : userData.userData.designation
                      }
                      placeholder="Designation"
                      placeholderTextColor="#888"
                      onChangeText={text => setDesignation(text)}
                    />
                    <DropdownComponent
                      onPartySelect={handlePartySelect}
                      politicalParty={userData.userData.politicalParty}
                    />
                      <Logo_list onSelectImage={handleSelectlogo} partyId={selectedPartyId}/>
                    {/* <TextInput style={styles.textInput} value={userData.userData.politicalParty} placeholder='Political Party' placeholderTextColor="#888" onChangeText={(text) => setPoliticalParty(text)} /> */}
                    {showInsta && (
                      <View>
                        <TextInput
                          style={styles.textInput}
                          value={
                            InstaUrl !== null
                              ? InstaUrl
                              : userData.userData.InstaUrl
                          }
                          placeholder="Paste Instagram Url"
                          placeholderTextColor="#888"
                          onChangeText={text => setInstaUrl(text)}
                        />
                      </View>
                    )}
                    {showFacebook && (
                      <View>
                        <TextInput
                          style={styles.textInput}
                          value={
                            FacebookUrl !== null
                              ? FacebookUrl
                              : userData.userData.FacebookUrl
                          }
                          placeholder="Paste Facebook Url"
                          placeholderTextColor="#888"
                          onChangeText={text => setFacebookUrl(text)}
                        />
                      </View>
                    )}
                    {showTwitter && (
                      <View>
                        <TextInput
                          style={styles.textInput}
                          value={
                            TwitterUrl !== null
                              ? TwitterUrl
                              : userData.userData.TwitterUrl
                          }
                          placeholder="Paste Twitter Url"
                          placeholderTextColor="#888"
                          onChangeText={text => setTwitterUrl(text)}
                        />
                      </View>
                    )}
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      For Adding Social Media Accounts click below.
                    </Text>
                    <View style={styles.icons_view}>
                      <TouchableOpacity onPress={() => SetshowInsta(true)}>
                        <Image
                          source={{
                            uri: 'https://static.vecteezy.com/system/resources/previews/023/986/555/original/instagram-logo-instagram-logo-transparent-instagram-icon-transparent-free-free-png.png',
                          }}
                          style={styles.icons}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setshowFacebook(true)}>
                        <Image
                          source={{
                            uri: 'https://www.edigitalagency.com.au/wp-content/uploads/Facebook-logo-blue-circle-large-transparent-png.png',
                          }}
                          style={styles.icons}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => SetshowTwitter(true)}>
                        <Image
                          source={{
                            uri: 'https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-twitter-social-media-round-icon-png-image_6315985.png',
                          }}
                          style={styles.icons}
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.profile_edit_btn}
                      onPress={updateProfile}>
                      <Text style={styles.logout_btn_text}>Update Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.logout_btn}
                      onPress={handleLogout}>
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
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    padding: 5,
  },
  profile_container: {
    flex: 1,
  },
  images_wrapper: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
  },
  fields_wrapper: {
    padding: 20,
  },
  logos: {
    backgroundColor: 'skyblue',
    height: 120,
    width: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo_images: {
    height: 120,
    width: 120,
    borderRadius: 100,
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
  profile_edit_btn: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  logout_btn_text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  icons_view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  icons: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  button: {
    borderWidth: 2,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
