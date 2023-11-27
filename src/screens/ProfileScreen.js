import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState, useRef, useContext} from 'react';

import {
  Image,
  View,
  Button,
  Text,
  StyleSheet,
  Linking,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
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
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {deleteObject, updateMetadata} from 'firebase/storage';
import DropdownComponent from '../components/Dropdown';
import Logo_list from '../components/logo';
import {get_user} from '../utils/user';
import {ThemeContext} from '../utils/ThemeContext';
import {setDarkTrue} from '../redux/reducer/isDarkMode';

import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SubscriptionModal from '../components/Modal/SubscriptionModal';

function ProfileScreen({navigation}) {
  const [userData, setUserData] = useState(null);
  const [UserName, setUserName] = useState(null);
  const [profileimg, setProfileImg] = useState('');
  const [politicalImgUrl, setPoliticalImgUrl] = useState('');
  const [businesslogoUrl, setbusinesslogoUrl] = useState('');
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
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const {isDarkMode} = useContext(ThemeContext);

  console.log(isDarkMode, 'isDarkMode');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('keepLoggedIn');
    navigation.navigate('Welcome');
  };

  const handleSelectlogo = uri => {
    console.log('selected______frame_____uri', uri);
    setPoliticalImgUrl(uri);
  };

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const user = await get_user();
      // console.log(user,"user")
      setUserData(user);
      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
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

  const hideAlert = () => {
    setShowAlert(false);
  };

  const confirmAlert = async () => {
    navigation.navigate('Home');
  };

  const updateProfile = async () => {
    setIsLoading(true);
    const emailToFind = userData?.userData.email;
    // console.log('check___________Users', emailToFind);
    try {
      const userId = await getUserIDByEmail(emailToFind);
      console.log('userId______', userId);
      // const imageUrl =  await  uploadImage() ;
      // console.log(
      //   'URL1_____________',
      //   imageUrl,
      // );

      const docRef = doc(firestore, 'users', userId);
      // console.log('docref_______________Data______log', docRef);
      const updatedData = {
        name: UserName || userData?.userData?.name,
        designation: designation || userData?.userData?.designation,
        imageUrl: profileimg || userData?.userData?.imageUrl,
        mobileNumber: mobileNumber || userData?.userData?.mobileNumber,
        politicalParty: politicalParty || userData?.userData?.politicalParty,
        politicalImgUrl: politicalImgUrl,
        InstaUrl: InstaUrl || userData?.userData?.InstaUrl,
        FacebookUrl: FacebookUrl || userData?.userData?.FacebookUrl,
        TwitterUrl: TwitterUrl || userData?.userData?.TwitterUrl,
        WhatsappNumber: WhatsappNumber || userData?.userData?.WhatsappNumber,
        businesslogoUrl: businesslogoUrl,
      };

      const response = await updateDoc(docRef, updatedData);
      console.log(response, 'get_updated_response');
      console.log(updatedData, 'updatedData');
      // await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      // dispatch(getUserData(updatedData))
      setIsLoading(false);
      setShowAlert(true);
      setRefresh(true);
      setTitle('Profile Updated Successfully!');
      setMessage('Your profile has been updated successfully.');
      // Alert.alert(
      //   'Profile Updated Successfully!',
      //   'Your profile has been updated successfully.',
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => navigation.navigate('Welcome'),
      //     },
      //   ],
      // );
    } catch (error) {
      setShowAlert(true);
      setTitle('');
      setMessage(
        'Failed to update profile. Please check the console for details.',
      );
      console.log('Error updating profile:', error);
      // alert('Failed to update profile. Please check the console for details.');
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
          }
          // else {
          //   setPoliticalImgUrl(image.path);
          // }
          bottomSheetModalRef.current?.close();
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  const openLibrary = async () => {
    console.log('library called');
    ImagePicker.openPicker({
      // width: 300,
      // height: 300,
      cropping: true,
      // compressImageQuality: 0.7,
      mime: 'image/png',
    }).then(image => {
      console.log('image', image);
      if (isProfile) {
        uploadImage(image.path);
        // setProfileImg(image.path);
        console.log('isprofile_____________true', isProfile);
      } else {
        console.log('isprofile_____________true', isProfile);
        uploadBusinesslogo(image.path);
      }
      bottomSheetModalRef.current?.close();
    });
  };

  const cancelUpload = () => {
    bottomSheetModalRef.current?.close();
  };

  const uploadImage = async profileimg => {
    setIsLoading(true);
    console.log('upload image called');
    if (profileimg == null) {
      return console.log('profile image is null');
      setIsLoading(false);
    }
    const uploadUri = profileimg;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    console.log(filename, 'filename');
    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    console.log(extension, 'extension');
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    const storageRef = ref(storage, `user_profile/${filename}`);
    try {
      // Fetch the image data from the local file path
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      // Upload the image to Firebase Cloud Storage
      const uploadTaskSnapshot = await uploadBytes(storageRef, blob, {
        contentType: 'image/png', // Specify the content type here
      });

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      console.log(imageUrl, 'url_image');
      setIsLoading(false);
      // Set the image URL state or use it as needed
      setProfileImg(imageUrl);
      // Display a success message or perform any other necessary actions
      // setShowAlert(true)
      // setTitle('Image uploaded!')
      // setMessage('Your image has been uploaded to Firebase Cloud Storage successfully!')
      // alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to Firebase Cloud Storage successfully!',
      // );
      // return imageUrl;
    } catch (e) {
      console.log('Error uploading image:', e);
      return null;
    }
  };

  const uploadBusinesslogo = async businesslogoUrl => {
    setIsLoading(true);
    console.log('upload business logo called');
    if (profileimg == null) {
      setIsLoading(false);
      return console.log('businesslogoUrl image is null');
    }

    const uploadUri = businesslogoUrl;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    const storageRef = ref(storage, `business_logo/${filename}`);

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
      console.log(imageUrl);
      // Set the image URL state or use it as needed
      setIsLoading(false);
      setbusinesslogoUrl(imageUrl);

      // Display a success message or perform any other necessary actions
      // alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to Firebase Cloud Storage successfully!',
      // );
      // return imageUrl;
    } catch (e) {
      console.log('Error uploading image:', e);
      return null;
    }
  };

  const handlePartySelect = (selectedParty, id) => {
    // Handle the selected party here
    console.log(id, 'selected_paty_name_Id');
    setSelectedPartyId(id);
    setPoliticalParty(selectedParty);
    console.log('Selected party___________:', selectedParty);
  };
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={styles.main_container}
        showsVerticalScrollIndicator={false}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.SubscriptionPlan}>
            <Text style={{fontSize: 13, color: 'white'}}>
              Upgrade Your Plan For More Features
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: '#fff',
                flexDirection: 'row',
                gap: 2,
                padding: 8,
                borderRadius: 5,
                fontSize: 15,
              }}>
              <FontAwesome5 name="crown" size={16} color="#EEBC1D" />
              <Text style={{color: '#000'}}>Upgrade</Text>
            </TouchableOpacity>
          </View>
          <SubscriptionModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
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
                        source={{uri: userData?.userData?.imageUrl}}
                      />
                    )}
                    <MaterialIcons
                      style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 0,
                        color: '#333',
                      }}
                      name="add-a-photo"
                      size={30}
                    />
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: 12,
                    }}>
                    Upload Profile
                  </Text>
                </View>
              </TouchableOpacity>
              <>
                <TouchableOpacity onPress={handleImagePick1}>
                  <View>
                    <View style={styles.logos}>
                      {businesslogoUrl ? (
                        <Image
                          style={styles.logo_images}
                          resizeMode="contain"
                          source={{uri: businesslogoUrl}}
                        />
                      ) : (
                        <Image
                          style={styles.logo_images}
                          resizeMode="contain"
                          source={{uri: userData?.userData.businesslogoUrl}}
                        />
                      )}
                      <MaterialIcons
                        style={{
                          position: 'absolute',
                          right: 10,
                          bottom: 0,
                          color: '#333',
                        }}
                        name="add-a-photo"
                        size={30}
                      />
                    </View>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 12,
                      }}>
                      Upload Business Logo
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
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

            <View style={styles.fields_wrapper}>
              {userData?.userData && userData?.userData.email ? (
                <>
                  <View>
                    <TextInput
                      style={[styles.textInput]}
                      value={
                        UserName !== null ? UserName : userData.userData.name
                      }
                      placeholderTextColor={isDarkMode ? '#fff' : '#888'}
                      onChangeText={text => setUserName(text)}
                    />
                    <TextInput
                      style={[styles.textInput]}
                      value={userData.userData.email}
                      placeholderTextColor="#888"
                    />
                    <TextInput
                      style={[styles.textInput]}
                      value={
                        mobileNumber !== null
                          ? mobileNumber
                          : userData.userData.mobileNumber
                      }
                      keyboardType="numeric"
                      placeholder="Mobile Number"
                      placeholderTextColor="#888"
                      onChangeText={text =>
                        text == ''
                          ? setMobileNumber(' ')
                          : setMobileNumber(text)
                      }
                    />
                    <TextInput
                      style={[styles.textInput]}
                      value={
                        WhatsappNumber !== null
                          ? WhatsappNumber
                          : userData.userData.WhatsappNumber
                      }
                      keyboardType="numeric"
                      placeholder="WhatsApp Number"
                      placeholderTextColor="#888"
                      onChangeText={text =>
                        text == ''
                          ? setWhatsappNumber(' ')
                          : setWhatsappNumber(text)
                      }
                    />
                    <TextInput
                      style={[styles.textInput]}
                      value={
                        designation !== null
                          ? designation
                          : userData.userData.designation
                      }
                      placeholder="Designation"
                      placeholderTextColor="fff"
                      onChangeText={text =>
                        text == '' ? setDesignation(' ') : setDesignation(text)
                      }
                    />
                    <>
                      <DropdownComponent
                        onPartySelect={handlePartySelect}
                        politicalParty={userData.userData.politicalParty}
                      />
                      <Logo_list
                        onSelectImage={handleSelectlogo}
                        partyId={selectedPartyId}
                        title="Choose Political logo"
                      />
                    </>
                    {/* <TextInput style={[styles.textInput,{color: isDarkMode ? '#fff' : "#000"}]} value={userData.userData.politicalParty} placeholder='Political Party' placeholderTextColor="#888" onChangeText={(text) => setPoliticalParty(text)} /> */}
                    {showInsta && (
                      <View>
                        <TextInput
                          style={[styles.textInput]}
                          value={
                            InstaUrl !== null
                              ? InstaUrl
                              : userData.userData.InstaUrl
                          }
                          placeholder="Paste Instagram Url"
                          placeholderTextColor="#888"
                          onChangeText={text =>
                            text == '' ? setInstaUrl(' ') : setInstaUrl(text)
                          }
                        />
                      </View>
                    )}
                    {showFacebook && (
                      <View>
                        <TextInput
                          style={[styles.textInput]}
                          value={
                            FacebookUrl !== null
                              ? FacebookUrl
                              : userData.userData.FacebookUrl
                          }
                          placeholder="Paste Facebook Url"
                          placeholderTextColor="#888"
                          onChangeText={text =>
                            text == ''
                              ? setFacebookUrl(' ')
                              : setFacebookUrl(text)
                          }
                        />
                      </View>
                    )}
                    {showTwitter && (
                      <View>
                        <TextInput
                          style={[styles.textInput]}
                          value={
                            TwitterUrl !== null
                              ? TwitterUrl
                              : userData.userData.TwitterUrl
                          }
                          placeholder="Paste Twitter Url"
                          placeholderTextColor="#888"
                          onChangeText={text =>
                            text == ''
                              ? setTwitterUrl(' ')
                              : setTwitterUrl(text)
                          }
                        />
                      </View>
                    )}
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#fff',
                        textAlign: 'center',
                      }}>
                      For Adding Social Media Accounts click below.
                    </Text>
                    <View style={styles.icons_view}>
                      <TouchableOpacity onPress={() => SetshowInsta(true)}>
                        <FontAwesome name="instagram" size={30} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setshowFacebook(true)}>
                        <FontAwesome
                          name="facebook-square"
                          size={28}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => SetshowTwitter(true)}>
                        <FontAwesome6
                          name="square-x-twitter"
                          size={30}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.profile_edit_btn}
                      onPress={updateProfile}>
                      <Text style={[styles.logout_btn_text]}>
                        Update Profile
                      </Text>
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

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}>
          <ActivityIndicator
            size="large"
            color={isDarkMode ? '#000' : '#fff'}
          />
        </View>
      )}
      {/* <View style={{justifyContent:"center",alignSelf:"center"}}>
      {isLoading &&  <ActivityIndicator size="large" color={'black'} marginTop={20} style={styles.activityIndicator}/>}
      </View> */}
      {showAlert && (
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={title}
          message={message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Ok"
          confirmButtonColor="#DD6B55"
          onCancelPressed={hideAlert}
          onConfirmPressed={confirmAlert}
        />
      )}
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#000',
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
    backgroundColor: '#fff',
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
    color: '#fff', // Color of the text entered by the user
  },
  logout_btn: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'gray',
  },
  profile_edit_btn: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  logout_btn_text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  icons_view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    padding: 20,
    alignItems: 'center',
  },
  icons: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
  button: {
    borderWidth: 2,
    borderColor: 'gray',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  SubscriptionPlan: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
});

export default ProfileScreen;
