import {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Alert,
  LogBox,
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
import VideoPlayer from 'react-native-video-player';
import RNFetchBlob from 'rn-fetch-blob';
import PhotoEditor from 'react-native-photo-editor';
import RNFS from 'react-native-fs';
import {uploadImage} from '../components/OverlayComponent';
import Frame_list from '../components/Frames';
import ViewShot from 'react-native-view-shot';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Frames} from '../vectors/frames/Frames';
import {err} from 'react-native-svg/lib/typescript/xml';

import {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {setVideoTrue} from '../redux/reducer/isVideo';
import LottieView from 'lottie-react-native';
import Loading from '../components/Modal/Loading';
// import { get_user } from '../utils/user';
const POSTER_WIDTH = SCREEN_WIDTH - 20;
const POSTER_RATIO = 1 / 1;
const POSTER_HEIGHT = POSTER_WIDTH / POSTER_RATIO;

function PreviewScreen({navigation, route}) {
  const {selectedImage, filteredData} = route.params;
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage_p, setSelectedImage_p] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolitical, setIsPolitical] = useState(true);

  const [isBusiness, setIsBusiness] = useState(true);

  const [isWaterMark, setisWaterMark] = useState(false);
  const scrollViewRef = useRef(null);
  const REMOTE_IMAGE_PATH = selectedImage?.data.url;
  const LOCAL_IMAGE_PATH = `${RNFS.DocumentDirectoryPath}/photo.jpg`;
  const viewShotRef = useRef(null);
  const [limitModal, setIsLimitModal] = useState(false);
  const toggleModal = () => {
    setIsLimitModal(!limitModal);
  };
  const bottomSheetModalRef = useRef(null);

  const openModel = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeModel = () => {
    bottomSheetModalRef.current?.close();
  };

  useEffect(() => {
    openModel();
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

  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsedData = JSON.parse(data);
        const email = parsedData?.userData?.email;
        const userId = await getUserIDByEmail(email);
        setUserId(userId);
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        const updatedData = userDoc?.data();
        const user = {userData: updatedData};
        watermark(user);
        setUserData({userData: updatedData});
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const watermark = data => {
    const user = data?.userData;

    if (user?.userType === 'free') {
      console.log('free user called');
      resetDownloadCount(user);
      setisWaterMark(true);
    } else if (user?.userType === 'basic' && user?.downloadCount >= 7) {
      console.log('basic user called');
      resetDownloadCount(user);
      // setisWaterMark(true);
    }
  };

  const resetDownloadCount = user => {
    try {
      const currentDate = new Date().toDateString();
      const lastDownloadDate =
        new Date(user?.lastDownloadDate).toDateString() || '';
      console.log(currentDate, lastDownloadDate, 'date');
      if (lastDownloadDate !== currentDate) {
        setisWaterMark(false);
        const userDocRef = doc(firestore, 'users', userId);
        const updatedData = {
          downloadCount: 0,
          lastDownloadDate: currentDate,
        };

        updateDoc(userDocRef, updatedData)
          .then(() => {
            console.log('Successfully updated');
          })
          .catch(error => {
            console.error('Error updating last download date:', error);
          });
      } else {
        setisWaterMark(true);
      }
    } catch (error) {
      console.log(error, 'error while updating resetDownloadCount');
    }
  };

  const handelPolitical = () => {
    setIsPolitical(true);
    setIsBusiness(false);
    console.log('====================================');
    console.log(isBusiness + '====' + isPolitical);
    console.log('====================================');
    // bottomSheetModalRef.current?.close();
    closeModal();
  };

  const handelBusiness = () => {
    setIsPolitical(false);
    setIsBusiness(true);
    // bottomSheetModalRef.current?.close();
    closeModal();
  };

  const captureImage = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        console.log('Captured image URI:', uri);
        const EditdedUri = await uploadImage(uri);
        await checkDownloadLimit(
          EditdedUri,
          userId,
          userData?.userData?.userType,
        );
        // You can now use this URI as needed, e.g., save it or share it.
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };

  const handleImagePress = image => {
    setSelectedImage_p(image);
    navigation.navigate('Preview', {
      selectedImage: image,
      filteredData: filteredData,
    });
    scrollToTop();
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: true});
    }
  };

  const checkPermission = async () => {
    setIsLoading(true);

    if (Platform.OS === 'ios') {
      checkDownloadLimit(
        REMOTE_IMAGE_PATH,
        userId,
        userData?.userData?.userType,
      );
    } else {
      try {
        if (Platform.Version <= 31) {
          const storagePermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message: 'App needs access to your storage to download Photos',
            },
          );
          if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
            // Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            setModalVisible(!modalVisible);
            captureImage();
          } else {
            // If permission denied then show alert
            alert('Storage Permission Not Granted');
          }
        } else {
          const mediaImagesPermission = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_IMAGES',
            {
              title: 'Media Images Permission Required',
              message: 'App needs access to media images.',
            },
          );
          const mediaVideosPermission = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_VIDEO',
            {
              title: 'Media Videos Permission Required',
              message: 'App needs access to media videos.',
            },
          );

          const mediaAudioPermission = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_AUDIO',
            {
              title: 'Media Audio Permission Required',
              message: 'App needs access to media audio.',
            },
          );
          if (
            mediaImagesPermission === PermissionsAndroid.RESULTS.GRANTED &&
            mediaVideosPermission === PermissionsAndroid.RESULTS.GRANTED &&
            mediaAudioPermission === PermissionsAndroid.RESULTS.GRANTED
          ) {
            // Once all permissions are granted, start downloading
            console.log('All Permissions Granted.');
            setModalVisible(!modalVisible);
            captureImage();
          } else {
            // If any permission is denied, show an alert
            alert('Permissions Not Granted');
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
        alert('Error requesting storage permission: ' + err.message);
        setIsLoading(false);
      }
    }
  };

  const openPhotoEditor = img => {
    try {
      setIsLoading(false);
      PhotoEditor.Edit({
        path: img,
        onDone: () => console.log('done'),
      });
    } catch (error) {
      console.error('Error opening the photo editor:', error);
      Alert.alert('Error', 'Failed to open the photo editor.');
    }
  };

  const handleSelectImage = uri => {
    setSelectedFrame(uri);
  };

  const checkDownloadLimit = async (editedImage, userId, userType) => {
    console.log(userData, 'userData download limit function');
    // console.log('props',JSON.stringify(userId),userType)
    const currentDate = new Date().toDateString();
    if (userType === 'free') {
      // Retrieve user's download count and last download date from Firestore
      setisWaterMark(true);
      if (userData?.userData) {
        const lastDownloadDate = userData?.userData?.lastDownloadDate || '';
        const userDownloadCount = userData?.userData?.downloadCount || 0;

        if (lastDownloadDate !== currentDate) {
          // Reset download count for a new day
          const userDocRef = doc(firestore, 'users', userId);
          const updatedData = {
            downloadCount: 0,
            lastDownloadDate: currentDate,
          };

          updateDoc(userDocRef, updatedData)
            .then(() => {
              console.log('Successfully updated');
              // Successfully updated last download date and reset download count
            })
            .catch(error => {
              console.error('Error updating last download date:', error);
            });
        }

        if (userDownloadCount >= 7) {
          setIsLoading(false);
          toggleModal();

          console.log('You have reached your daily download limit');
          return; // Stop the download process
        }
        // Continue with the download process for free users
        downloadImage(editedImage);
        setIsLoading(false);
        const newDownloadCount = userDownloadCount + 1;
        const userDocRef = doc(firestore, 'users', userId);
        const updatedData = {
          downloadCount: newDownloadCount,
        };
        console.log(updatedData, 'updated download count');
        updateDoc(userDocRef, updatedData)
          .then(() => {
            console.log('Successfully updated');
            // Successfully updated last download date and reset download count
          })
          .catch(error => {
            console.error('Error updating new download count:', error);
          });
      } else {
        console.log('User data not found ');
      }
    } else if (userType === 'basic') {
      if (userData?.userData) {
        const lastDownloadDate = userData?.userData?.lastDownloadDate || '';
        const userDownloadCount = userData?.userData?.downloadCount || 0;
        if (lastDownloadDate !== currentDate) {
          const userDocRef = doc(firestore, 'users', userId);
          const updatedData = {
            downloadCount: 0,
            lastDownloadDate: currentDate,
          };
          updateDoc(userDocRef, updatedData)
            .then(() => {
              console.log('Successfully updated');
            })
            .catch(error => {
              console.error('Error updating last download date:', error);
            });
        }
        downloadImage(editedImage);

        const newDownloadCount = userDownloadCount + 1;
        const userDocRef = doc(firestore, 'users', userId);
        const updatedData = {
          downloadCount: newDownloadCount,
        };
        console.log(updatedData, 'updated download count');
        updateDoc(userDocRef, updatedData)
          .then(() => {
            console.log('Successfully updated');
            // Successfully updated last download date and reset download count
          })
          .catch(error => {
            console.error('Error updating new download count:', error);
          });
      } else {
        console.log('User data not found ');
      }
    } else {
      downloadImage(editedImage);
    }
  };

  const downloadImage = async editedImage => {
    console.log(editedImage, 'check______');
    setModalVisible(true);
    let date = new Date();
    let ext = getExtention(editedImage);
    ext = '.' + ext;

    // Define the path to the 'Nupost_Images' directory
    const {config, fs} = RNFetchBlob;
    const PictureDir = fs.dirs.PictureDir;
    const nupostImagesDir = PictureDir + '/Nupost_Images';
    // Check if the 'Nupost_Images' directory exists, and create it if not
    if (!fs.exists(nupostImagesDir)) {
      fs.mkdir(nupostImagesDir)
        .then(() => {
          // Directory is created, proceed with downloading the image
          const options = {
            fileCache: false,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: (
                nupostImagesDir +
                '/' +
                Math.floor(date.getTime() + date.getSeconds() / 2) +
                ext
              ).replace('?alt=media', ''),
              description: 'Nupost_Images',
            },
          };
          config(options)
            .fetch('GET', editedImage)
            .then(res => {
              // Showing alert after successful downloading
              setModalVisible(false);
              openPhotoEditor(options.addAndroidDownloads.path);
              setIsLoading(false);
            })
            .catch(err => {
              console.error('Error downloading image:', err);
            });
        })
        .catch(err => {
          console.log('Error creating directory:', err);
        });
    } else {
      // The 'Nupost_Images' directory already exists, proceed with downloading the image
      const options = {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: (
            nupostImagesDir +
            '/' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext
          ).replace('?alt=media', ''),
          description: 'Nupost_Images',
        },
      };
      config(options)
        .fetch('GET', editedImage)
        .then(res => {
          // Showing alert after successful downloading
          setModalVisible(false);
          openPhotoEditor(options.addAndroidDownloads.path);
          setIsLoading(false);
        })
        .catch(err => {
          console.log('Error downloading image:', err);
        });
    }
  };

  const getExtention = filename => {
    // To get the file extension
    return filename.split('.').pop();
  };

  const url = selectedImage?.data.url;
  const isVideo = url && /\.(mp4|mov|avi|mkv)$/i.test(url);
  const [indicator, setIndicator] = useState(false);

  const handleLoadStart = () => {
    setIndicator(true);
  };

  const handleSelect = option => {
    setSelectedOption(option);
  };

  const handleBuffering = isBuffering => {
    if (isBuffering) {
      console.log('Video is buffering...');
    } else {
      console.log('Buffering is complete.');
    }
  };

  const maxFramesAllowed = {
    free: 5,
    basic: 10,
    premium: Frames.length,
  };
  const userType = userData?.userData?.userType || 'free';
  const allowedFrames = Frames.slice(0, maxFramesAllowed[userType]);

  if (selectedFrame >= 6 && userType === 'free') {
    // Show an alert or perform any action to notify the user
    Alert.alert('Nupost', 'Please subscribe to access this frame.');
  } else if (selectedFrame >= 10 && userType === 'basic') {
    Alert.alert('Nupost', 'Please upgraid your plan to access all frames.');
  }

  LogBox.ignoreAllLogs();
  // console.log('====================================');
  // console.log(userData.userData.businesslogoUrl);
  // console.log('====================================');
  const [selectmodalVisible, setSelectModalVisible] = useState(false);

  const openModal = () => {
    setSelectModalVisible(true);
  };

  const closeModal = () => {
    setSelectModalVisible(false);
  };

  useEffect(() => {
    openModal();
  }, []);
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.top_container}>
          {isVideo ? (
            <View style={styles.videoContainer}>
              <VideoPlayer
                video={{uri: url}}
                style={styles.video}
                resizeMode="cover"
                controls={false}
                repeat={true}
                disableControlsAutoHide={true}
                pauseOnPress={true}
                onLoadStart={handleLoadStart}
                onBuffer={handleBuffering}
                onLoad={() => setIndicator(false)}
              />
              {indicator ? (
                <ActivityIndicator
                  size="small"
                  color="black"
                  style={styles.activityIndicator}
                />
              ) : null}
            </View>
          ) : userData == null ? (
            <View
              style={{
                margin: 0,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: modalVisible ? '#6600000' : '#fff',
              }}>
              <LottieView
                source={require('../assets/lottie/loading.json')}
                resizeMode="cover"
                style={{height: 50, width: 100}}
                autoPlay
                loop={true}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                marginBottom: 4,
              }}>
              <ViewShot
                ref={viewShotRef}
                options={{format: 'jpg', quality: 0.9}}
                style={styles.preview_image}>
                {/* Background Image */}
                <View style={styles.backgroundImage}>
                  {allowedFrames
                    .filter(item => item.id === selectedFrame)[0]
                    ?.image(POSTER_WIDTH + 1, POSTER_HEIGHT + 1, {
                      name: userData?.userData?.name,
                      email: userData?.userData.email,
                      designation: userData?.userData.designation,
                      mobileNumber: userData?.userData.mobileNumber,
                      WhatsappNumber: userData?.userData.WhatsappNumber,
                      politicalImgUrl: isBusiness
                        ? userData?.userData?.businesslogoUrl
                        : userData?.userData?.politicalImgUrl,
                      imageUrl: userData?.userData?.imageUrl,
                      FacebookUrl: userData?.userData.FacebookUrl,
                      InstaUrl: userData?.userData.InstaUrl,
                      TwitterUrl: userData?.userData.TwitterUrl,
                    })}
                </View>
                <Image
                  source={{uri: REMOTE_IMAGE_PATH}}
                  style={styles.overlayImage}
                />
                <Image
                  source={{
                    uri: isBusiness
                      ? userData?.userData?.businesslogoUrl
                      : userData?.userData?.politicalImgUrl,
                  }}
                  style={styles.logo}
                />
                {isWaterMark && (
                  <Image
                    source={require('../assets/img/logo.png')}
                    style={styles.watermark}
                  />
                )}
              </ViewShot>
            </View>
          )}
          {(isPolitical || isBusiness) &&
            (userData == null ? (
              <View
                style={{
                  margin: 0,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#66000000',
                }}>
                <LottieView
                  source={require('../assets/lottie/loading.json')}
                  resizeMode="cover"
                  style={{height: 50, width: 100}}
                  autoPlay
                  loop={true}
                />
              </View>
            ) : (
              <Frame_list
                selectedImage={selectedImage}
                onSelectImage={handleSelectImage}
                image={REMOTE_IMAGE_PATH}
                allowedFrames={allowedFrames}
              />
            ))}

          <View style={styles.btns_wrapper}>
            <TouchableOpacity onPress={checkPermission} style={styles.btns}>
              <Text style={styles.btns_text}>Download</Text>
              <Feather name="download" style={{color: 'white'}} size={20} />
            </TouchableOpacity>
          </View>
        </View>
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
            <Loading />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectmodalVisible}
          onRequestClose={closeModal}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#000',
                padding: 20,
                borderRadius: 10,
                width: '80%',
                borderWidth: 2,
                borderColor: '#000',
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: '#fff'}}>Making Post For?</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={handelBusiness}>
                  <View style={styles.bottomButton}>
                    <Text style={styles.buttonText}>Business</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handelPolitical}>
                  <View style={styles.bottomButton}>
                    <Text style={styles.buttonText}>Political</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={limitModal}
          onRequestClose={() => {
            toggleModal();
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#000',
                padding: 20,
                borderRadius: 10,
                alignItems: 'center',
                flexDirection: 'column',
                gap: 5,
              }}>
              <Text style={{color: 'red'}}>
                You have reached your daily download limit
              </Text>
              <TouchableOpacity
                onPress={toggleModal}
                style={{
                  backgroundColor: '#fff',

                  padding: 10,
                  borderRadius: 5,
                }}>
                <Text style={{color: '#000'}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  top_container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#333',
    // alignItems:'center'
  },
  // preview_image: {
  //   height: 380,
  //   width: "100%",
  //   marginBottom: 170,
  //   position:"relative",
  // },
  bottomButton: {
    borderWidth: 2,
    borderColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  btns_wrapper: {
    flexDirection: 'row',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  btns: {
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  btns_text: {
    fontSize: 16,
    color: 'white',
  },
  video: {
    height: 380,
    width: 320,
    borderRadius: 20,
  },
  videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    position: 'absolute',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview_image: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    zIndex: 9,
    top: 0,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    justifyContent: 'flex-end',
  },
  overlayImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 10,
    paddingLeft: 0,
  },
  nameText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  phoneText: {
    fontSize: 10,
    color: 'black',
  },
  phoneText1: {
    fontSize: 10,
    color: 'black',
  },
  logo: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40, // Adjust the size as needed
    height: 40,
    borderRadius: 50,
  },
  watermark: {
    position: 'absolute',
    top: 15,
    // right: 15,
    left: 10,
    width: 35,
    height: 15,
    resizeMode: 'cover',
  },
  profile_picture: {
    position: 'absolute',
    bottom: 50,
    right: 2,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  userName: {
    position: 'absolute',
    bottom: 46,
    left: 15,
    fontSize: 16,
    color: '#000',
  },
});

export default PreviewScreen;
